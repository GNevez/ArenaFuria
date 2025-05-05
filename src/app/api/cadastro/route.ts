import { NextRequest, NextResponse } from "next/server";
import { UserFormData } from "../../../types";
import vision from "@google-cloud/vision";
import pool from "./lib/db";
import bcrypt from "bcrypt";

// Initialize Google Vision client using env vars
const client = new vision.ImageAnnotatorClient({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    universe_domain: "googleapis.com",
  },
});

async function detectarTextoNaImagem(file: File, cpfUsuario: string) {
  console.log("Iniciando processamento do arquivo");
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log("Buffer criado com sucesso");

  console.log("Iniciando detecção de texto com Google Cloud Vision");
  const [result] = await client.textDetection({ image: { content: buffer } });
  console.log("Detecção concluída");

  const detections = result.textAnnotations;
  if (!detections || detections.length === 0) {
    console.log("Nenhum texto detectado na imagem");
    return false;
  }

  const cpfFormatado = cpfUsuario.replace(/\D/g, "");
  console.log("CPF do usuário formatado:", cpfFormatado);

  const numerosEncontrados = new Set<string>();
  detections.forEach((text) => {
    const numeros = text.description?.match(/\d+/g) || [];
    numeros.forEach((numero) => numerosEncontrados.add(numero));
  });
  console.log(
    "Números encontrados no documento:",
    Array.from(numerosEncontrados)
  );

  const cpfEncontrado = Array.from(numerosEncontrados).some((numero) =>
    numero.includes(cpfFormatado)
  );

  if (cpfEncontrado) {
    console.log("✅ CPF encontrado no documento!");
    return true;
  } else {
    console.log("❌ CPF não encontrado no documento");
    return false;
  }
}

function isFormData(formData: globalThis.FormData): formData is FormData {
  const requiredFields = [
    "name",
    "email",
    "senha",
    "address",
    "cpf",
    "gamesPlayed",
    "favoritePlayer",
    "attendedEvents",
  ];
  console.log("Dados recebidos:", Object.fromEntries(formData.entries()));
  for (const field of requiredFields) {
    if (!formData.has(field)) {
      console.log(`Campo ${field} não encontrado`);
      return false;
    }
  }
  const idDocument = formData.get("idDocument");
  if (!idDocument) {
    console.log("Documento de identificação não encontrado");
    return false;
  }
  return true;
}

export async function POST(req: NextRequest) {
  const connection = await pool.getConnection();
  try {
    console.log("Iniciando processamento do POST");
    const formData = await req.formData();

    if (!isFormData(formData)) {
      console.log("FormData inválido");
      return NextResponse.json(
        { erro: "Campos obrigatórios faltando ou inválidos." },
        { status: 400 }
      );
    }

    const dados = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      senha: formData.get("senha") as string,
      address: formData.get("address") as string,
      cpf: formData.get("cpf") as string,
      gamesPlayed: formData.get("gamesPlayed") as string,
      favoritePlayer: formData.get("favoritePlayer") as string,
      attendedEvents: formData.get("attendedEvents") === "true",
    };

    console.log("Dados processados:", dados);

    const idDocument = formData.get("idDocument");
    if (!(idDocument instanceof File)) {
      console.log("Documento inválido");
      return NextResponse.json(
        { erro: "Documento de identificação inválido." },
        { status: 400 }
      );
    }

    try {
      console.log("Iniciando validação do documento");
      const cpfValido = await detectarTextoNaImagem(idDocument, dados.cpf);

      if (!cpfValido) {
        return NextResponse.json(
          { erro: "CPF não encontrado no documento enviado." },
          { status: 400 }
        );
      }

      console.log("Validação do documento concluída com sucesso");

      const saltRounds = 10;
      const senhaCriptografada = await bcrypt.hash(dados.senha, saltRounds);

      // Iniciar transação
      await connection.beginTransaction();
      try {
        // Inserir na tabela users
        const [result] = await connection.execute(
          `INSERT INTO users (name, email, senha, address, cpf) VALUES (?, ?, ?, ?, ?)`,
          [
            dados.name,
            dados.email,
            senhaCriptografada,
            dados.address,
            dados.cpf,
          ]
        );
        const userId = (result as any).insertId;

        // Inserir na tabela gamerInfo
        await connection.execute(
          `INSERT INTO gamerInfo (user_id, gamesPlayed, favoritePlayer, attendedEvents) VALUES (?, ?, ?, ?)`,
          [
            userId,
            dados.gamesPlayed,
            dados.favoritePlayer,
            dados.attendedEvents,
          ]
        );

        // Commit da transação
        await connection.commit();

        return NextResponse.json(
          {
            msg: "Usuário criado com sucesso!",
            dados: { ...dados, senha: undefined },
          },
          { status: 201 }
        );
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    } catch (error) {
      console.error("Erro na validação do documento:", error);
      return NextResponse.json(
        { erro: "Erro ao processar o documento." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Erro geral no processamento:", error);
    return NextResponse.json(
      {
        erro: "Erro ao processar o POST.",
        detalhes: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
