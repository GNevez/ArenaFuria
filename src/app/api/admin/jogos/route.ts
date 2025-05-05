import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const jogosFile = path.join(process.cwd(), "data", "jogos.txt");
    if (fs.existsSync(jogosFile)) {
      const conteudo = fs.readFileSync(jogosFile, "utf-8");
      if (conteudo.trim()) {
        return new NextResponse(conteudo);
      }
    }
    return new NextResponse("Nenhum jogo cadastrado no momento.");
  } catch (error) {
    console.error("Erro ao ler arquivo de jogos:", error);
    return new NextResponse("Erro ao carregar os jogos.", { status: 500 });
  }
}
