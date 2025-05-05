import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../../lib/auth";
import axios from "axios";

const BOT_API_URL = process.env.BOT_API_URL || "http://localhost:3002";

export async function POST(req: NextRequest) {
  const session = await getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { erro: "Acesso não autorizado." },
      { status: 403 }
    );
  }

  try {
    const { mensagem } = await req.json();

    if (!mensagem) {
      return NextResponse.json(
        { erro: "A mensagem é obrigatória." },
        { status: 400 }
      );
    }


    // Enviar a mensagem para o bot
    try {
      const response = await axios.post(`${BOT_API_URL}/api/enviar-mensagem`, {
        mensagem,
      });

      return NextResponse.json({
        msg: "Mensagem enviada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem para o bot:", error);
      return NextResponse.json(
        { erro: "Erro ao enviar mensagem para o bot." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    return NextResponse.json(
      { erro: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
