import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";

interface UserPreferences extends RowDataPacket {
  id: number;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("furia-auth")?.value;

    console.log("Cookie encontrado:", cookieStore.get("furia-auth"));
    console.log("Token:", token);

    if (!token) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as
      | jwt.JwtPayload
      | { email: string };

    if ("email" in decoded) {
      const { email } = decoded;

    } else {
      throw new Error("Token inválido: email ausente.");
    }

    console.log("Token decodificado:", decoded);
    const { favoritePlayer, favoriteGames } = await request.json();

    // Verifica se já existe preferências para o usuário
    const [existingPreferences] = await pool.query<UserPreferences[]>(
      `SELECT id FROM gamerinfo WHERE user_id = (SELECT id FROM users WHERE email = ?)`,
      [decoded.email]
    );

    if (existingPreferences && existingPreferences.length > 0) {
      // Atualiza preferências existentes
      await pool.query(
        `UPDATE gamerinfo 
         SET favoritePlayer = ?, gamesPlayed = ?
         WHERE user_id = (SELECT id FROM users WHERE email = ?)`,
        [favoritePlayer, JSON.stringify(favoriteGames), decoded.email]
      );
    } else {
      // Insere novas preferências
      await pool.query(
        `INSERT INTO gamerinfo (user_id, gamesPlayed, favoritePlayer)
         SELECT id, ?, ? FROM users WHERE email = ?`,
        [favoritePlayer, JSON.stringify(favoriteGames), decoded.email]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar preferências:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar preferências" },
      { status: 500 }
    );
  }
}
