import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextAuthOptions } from "next-auth";

const COOKIE_NAME = "furia-auth";

export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

export async function createSession(user: UserSession) {
  const payload = {
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
  };

  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtSecret)
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
  if (!jwtExpiresIn) throw new Error("JWT_EXPIRES_IN não definido");

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: parseInt(jwtExpiresIn) * 24 * 60 * 60, // Converte dias para segundos
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });

  return token;
}

export async function getSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

  if (!jwtSecret)
    throw new Error("JWT_SECRET não definido nas variáveis de ambiente");
  if (!jwtExpiresIn) throw new Error("JWT_EXPIRES_IN não definido");

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as unknown as {
      sub: number;
      name: string;
      email: string;
      role: "user" | "admin";
    };

    return {
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const authOptions: NextAuthOptions = {
  // Suas configurações de autenticação aqui
  // Exemplo:
  providers: [],
  session: { strategy: "jwt" },
};
 