import { NextRequest, NextResponse } from "next/server";
import pool from "../../../lib/db";
import bcrypt from "bcrypt";
import { createSession, UserSession } from "../../../lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    const { email, senha } = await req.json();

    if (!email || !senha) {
      return NextResponse.json(
        { erro: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const [rows] = await connection.execute(
      `SELECT u.id, u.name, u.email, u.senha, u.role
       FROM users u
       WHERE u.email = ?`,
      [email]
    );

    const usuarios = rows as any[];

    if (usuarios.length === 0) {
      return NextResponse.json(
        { erro: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    const usuario = usuarios[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return NextResponse.json(
        { erro: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    // Criar objeto com apenas os dados necessários
    const userData: UserSession = {
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
    };

    // Criar sessão
    const token = await createSession(userData);

    const cookieStore = await cookies();
    cookieStore.set("furia-auth", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json(
      {
        msg: "Login realizado com sucesso!",
        usuario: userData,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      {
        erro: "Erro ao processar o login.",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
