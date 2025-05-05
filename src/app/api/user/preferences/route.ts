import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

interface UserPreferences extends RowDataPacket {
  favoritePlayer: string | null;
  gamesPlayed: string | null;
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("furia-auth")?.value;

    if (!token) {
      console.log("Token não encontrado no cookie");
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES
    if (!jwtSecret)
      throw new Error(
        "JWT_SECRET não definido nas variáveis de ambiente"
      );
    if (!jwtExpiresIn) throw new Error("JWT_EXPIRES_IN não definido");

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { email: string };
      console.log("Email decodificado:", decoded.email);
    } catch (err) {
      console.error("Erro ao decodificar JWT:", err);
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Busca preferências do usuário
    console.log("Executando query com email:", decoded.email);
    const [preferences]: any = await pool.query(
      `SELECT 
         up.favoritePlayer,
         up.gamesPlayed,
         up.attendedEvents,
         tl.twitch_id, 
         tl.twitch_login, 
         tl.twitch_display_name, 
         tl.twitch_avatar,
         sl.steam_id, 
         sl.steam_persona, 
         sl.steam_avatar
       FROM gamerinfo up
       LEFT JOIN twitch_login tl ON tl.user_id = up.user_id
       LEFT JOIN steam_login sl ON sl.user_id = up.user_id
       WHERE up.user_id = (SELECT id FROM users WHERE email = ?)`,
      [decoded.email]
    );

    console.log("Resultado da query:", preferences);

    if (!preferences || preferences.length === 0) {
      console.log("Nenhuma preferência encontrada");
      return NextResponse.json({
        favoritePlayer: null,
        gamesPlayed: [],
        attendedEvents: [],
        twitch: null,
        steam: null,
      });
    }

    const pref = preferences[0];
    console.log("Preferências encontradas:", pref);

    const gamesPlayed = pref.gamesPlayed
      ? pref.gamesPlayed.split(",").map((game: any) => game.trim())
      : [];

    return NextResponse.json({
      favoritePlayer: pref.favoritePlayer,
      gamesPlayed: gamesPlayed,
      attendedEvents: pref.attendedEvents,
      twitch: pref.twitch_id
        ? {
            twitch_id: pref.twitch_id,
            twitch_login: pref.twitch_login,
            twitch_display_name: pref.twitch_display_name,
            twitch_avatar: pref.twitch_avatar,
          }
        : null,
      steam: pref.steam_id
        ? {
            steam_id: pref.steam_id,
            steam_persona: pref.steam_persona,
            steam_avatar: pref.steam_avatar,
          }
        : null,
    });
  } catch (err) {
    console.error("Erro detalhado ao buscar preferências:", {
      message: err instanceof Error ? err.message : "Erro desconhecido",
      stack: err instanceof Error ? err.stack : undefined,
      err,
    });
    return NextResponse.json(
      { error: "Erro ao buscar preferências" },
      { status: 500 }
    );
  }
}
