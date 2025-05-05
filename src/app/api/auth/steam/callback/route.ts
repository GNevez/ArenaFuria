import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
const steamApiKey = process.env.STEAM_API_KEY!;

function extractSteamId(claimedId: string) {
  const match = claimedId.match(/\/id\/(\d+)$/) || claimedId.match(/\/(\d+)$/);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const claimedId = params.get("openid.claimed_id");
    if (!claimedId) {
      return NextResponse.redirect(`${baseUrl}/dna?error=steam`);
    }

    const steamId = extractSteamId(claimedId);
    if (!steamId) {
      return NextResponse.redirect(`${baseUrl}/dna?error=steamid`);
    }

    // Busca dados públicos do usuário na Steam
    let steamUser;
    try {
      const res = await axios.get(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/`,
        {
          params: {
            key: steamApiKey,
            steamids: steamId,
          },
        }
      );
      steamUser = res.data.response.players[0];
    } catch (err) {
      console.error("Erro ao buscar dados da Steam:", err);
      return NextResponse.redirect(`${baseUrl}/dna?error=steamapi`);
    }

    // Pega o usuário autenticado pelo cookie JWT
    const cookieStore = await cookies();
    const token = cookieStore.get("furia-auth")?.value;
    if (!token) {
      return NextResponse.redirect(`${baseUrl}/dna?error=auth`);
    }

      const jwtSecret = process.env.JWT_SECRET;
      const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

      if (!jwtSecret)
        throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
      if (!jwtExpiresIn) throw new Error("JWT_EXPIRES_IN não definido");


    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret) as { email: string };
    } catch (err) {
      console.error("Erro ao decodificar JWT:", err);
      return NextResponse.redirect(`${baseUrl}/dna?error=jwt`);
    }

    // Busca o id do usuário
    let userId;
    try {
      const [rows]: any = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [decoded.email]
      );
      userId = rows[0]?.id;
      if (!userId) throw new Error("Usuário não encontrado");
    } catch (err) {
      console.error("Erro ao buscar id do usuário:", err);
      return NextResponse.redirect(`${baseUrl}/dna?error=user_id`);
    }

    // Upsert na tabela steam_login
    try {
      await db.query(
        `INSERT INTO steam_login (user_id, steam_id, steam_persona, steam_avatar)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           steam_id = VALUES(steam_id),
           steam_persona = VALUES(steam_persona),
           steam_avatar = VALUES(steam_avatar)`,
        [userId, steamUser.steamid, steamUser.personaname, steamUser.avatarfull]
      );
    } catch (err) {
      console.error("Erro ao salvar dados da Steam:", err);
      return NextResponse.redirect(`${baseUrl}/dna?error=db`);
    }

    return NextResponse.redirect(`${baseUrl}/dna?success=steam`);
  } catch (err) {
    console.error("Erro no callback da Steam:", err);
    return NextResponse.redirect(`${baseUrl}/dna?error=steam`);
  }
}
