import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import db from "@/lib/db"; 
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const clientId = process.env.TWITCH_CLIENT_ID!;
const clientSecret = process.env.TWITCH_CLIENT_SECRET!;
const redirectUri = process.env.TWITCH_REDIRECT_URI!;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    console.log("Code recebido:", code);
    if (!code) return NextResponse.redirect(`${baseUrl}/dna?error=twitch`);

    // Troca o code por um token
    let tokenRes;
    try {
      tokenRes = await axios.post(
        `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(
          redirectUri
        )}`
      );
      console.log("Resposta do token:", tokenRes.data);
    } catch (err: any) {
      console.error(
        "Erro ao trocar code por token:",
        err.response?.data || err
      );
      return NextResponse.redirect(`${baseUrl}/dna?error=token`);
    }
    const { access_token } = tokenRes.data;

    // Busca dados do usuário na Twitch
    let userRes;
    try {
      userRes = await axios.get("https://api.twitch.tv/helix/users", {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Client-Id": clientId,
        },
      });
      console.log("Dados do usuário Twitch:", userRes.data);
    } catch (err: any) {
      console.error(
        "Erro ao buscar usuário na Twitch:",
        err.response?.data || err
      );
      return NextResponse.redirect(`${baseUrl}/dna?error=user`);
    }
    const twitchUser = userRes.data.data[0];

    const cookieStore = await cookies();
    const token = cookieStore.get("furia-auth")?.value;

          const jwtSecret = process.env.JWT_SECRET;
          const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

          if (!jwtSecret)
            throw new Error(
              "JWT_SECRET não definido nas variáveis de ambiente"
            );
          if (!jwtExpiresIn) throw new Error("JWT_EXPIRES_IN não definido");

          console.log("Cookie furia-auth:", token);
          if (!token) {
            console.log("erro ta aq");

            return NextResponse.redirect(`${baseUrl}/dna?error=auth`);
          }

          let decoded;
          try {
            decoded = jwt.verify(token, jwtSecret) as { email: string };
            console.log("JWT decodificado:", decoded);
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

    // Upsert na tabela twitch_login
    try {
      await db.query(
        `INSERT INTO twitch_login (user_id, twitch_id, twitch_login, twitch_display_name, twitch_avatar)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           twitch_id = VALUES(twitch_id),
           twitch_login = VALUES(twitch_login),
           twitch_display_name = VALUES(twitch_display_name),
           twitch_avatar = VALUES(twitch_avatar)`,
        [
          userId,
          twitchUser.id,
          twitchUser.login,
          twitchUser.display_name,
          twitchUser.profile_image_url,
        ]
      );
      console.log("Twitch login salvo no banco para:", decoded.email);
    } catch (err) {
      console.error("Erro ao salvar no banco:", err);
      return NextResponse.redirect(`${baseUrl}/dna?error=db`);
    }

    return NextResponse.redirect(`${baseUrl}/dna?success=twitch`);
  } catch (err) {
    console.error("Erro no callback da Twitch:", err);
    return NextResponse.redirect(`${baseUrl}/dna?error=twitch`);
  }
}
