import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const streamersFile = path.join(process.cwd(), "data", "streamers.txt");
    if (fs.existsSync(streamersFile)) {
      const conteudo = fs.readFileSync(streamersFile, "utf-8");
      if (conteudo.trim()) {
        return new NextResponse(conteudo);
      }
    }
    return new NextResponse("Nenhum streamer cadastrado no momento.");
  } catch (error) {
    console.error("Erro ao ler arquivo de streamers:", error);
    return new NextResponse("Erro ao carregar os streamers.", { status: 500 });
  }
}
