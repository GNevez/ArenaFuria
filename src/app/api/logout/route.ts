import { NextResponse } from "next/server";
import { destroySession } from "../../../lib/auth";

export async function POST() {
  destroySession();

  return NextResponse.json(
    { msg: "Logout realizado com sucesso" },
    {
      status: 200,
      headers: {
        "Set-Cookie":
          "furia-auth=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
      },
    }
  );
}
