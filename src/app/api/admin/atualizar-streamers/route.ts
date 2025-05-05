import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { streamers } = await request.json();

    if (!streamers) {
      return NextResponse.json(
        { erro: "O conteúdo dos streamers é obrigatório" },
        { status: 400 }
      );
    }

    // Salvar os streamers em um arquivo
    const streamersFile = path.join(process.cwd(), "data", "streamers.txt");
    fs.writeFileSync(streamersFile, streamers);

    return NextResponse.json({ msg: "Streamers atualizados com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar streamers:", error);
    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
