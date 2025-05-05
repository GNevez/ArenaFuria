import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { jogos } = await request.json();

    if (!jogos) {
      return NextResponse.json(
        { erro: "O conteúdo dos jogos é obrigatório" },
        { status: 400 }
      );
    }

    // Salvar os jogos em um arquivo
    const jogosFile = path.join(process.cwd(), "data", "jogos.txt");
    fs.writeFileSync(jogosFile, jogos);

    return NextResponse.json({ msg: "Jogos atualizados com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar jogos:", error);
    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
