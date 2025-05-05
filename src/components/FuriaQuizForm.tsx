import React, { useState, useEffect } from "react";

const perguntas = [
  {
    pergunta: "Você já participou de algum evento presencial da FURIA?",
    type: "boolean",
    pontos: 20,
  },
  {
    pergunta: "Você já vinculou sua conta Steam?",
    type: "boolean",
    pontos: 15,
  },
  {
    pergunta: "Você já vinculou sua conta Twitch?",
    type: "boolean",
    pontos: 15,
  },
  {
    pergunta: "Qual o ano de fundação da FURIA?",
    type: "alternativa",
    opcoes: ["2015", "2017", "2019"],
    resposta: "2017",
    pontos: 10,
  },
  {
    pergunta: "Quem é o IGL do time de CS2?",
    type: "alternativa",
    opcoes: ["Fallen", "KSCERATO", "yuurih"],
    resposta: "Fallen",
    pontos: 10,
  },
  {
    pergunta: "Você já assistiu uma live oficial da FURIA?",
    type: "boolean",
    pontos: 10,
  },
  {
    pergunta: "Você segue a FURIA nas redes sociais?",
    type: "boolean",
    pontos: 10,
  },
  {
    pergunta: "Você já comprou produtos oficiais da FURIA?",
    type: "boolean",
    pontos: 10,
  },
];

const maxPontos = perguntas.reduce((acc, p) => acc + p.pontos, 0);

type Props = {
  onChangeNivel: (nivel: number) => void;
};

const FuriaQuizForm: React.FC<Props> = ({ onChangeNivel }) => {
  const [respostas, setRespostas] = useState<{ [key: number]: any }>({});

  // Calcula o nível de fúria
  const nivelFuria = perguntas.reduce((acc, p, idx) => {
    const r = respostas[idx];
    if (p.type === "boolean" && r === true) return acc + p.pontos;
    if (p.type === "alternativa" && r === p.resposta) return acc + p.pontos;
    return acc;
  }, 0);

  useEffect(() => {
    onChangeNivel(Math.round((nivelFuria / maxPontos) * 100));
  }, [nivelFuria, onChangeNivel]);

  return (
    <div className="bg-white/5 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Perguntas FURIOSAS</h2>
      <form className="space-y-6">
        {perguntas.map((p, idx) => (
          <div key={idx} className="mb-4">
            <p className="font-bold mb-2">{p.pergunta}</p>
            {p.type === "boolean" ? (
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg font-bold border ${
                    respostas[idx] === true
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                  onClick={() => setRespostas({ ...respostas, [idx]: true })}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg font-bold border ${
                    respostas[idx] === false
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                  onClick={() => setRespostas({ ...respostas, [idx]: false })}
                >
                  Não
                </button>
              </div>
            ) : (
              <div className="flex gap-4 flex-wrap">
                {p.opcoes?.map((op) => (
                  <button
                    key={op}
                    type="button"
                    className={`px-4 py-2 rounded-lg font-bold border ${
                      respostas[idx] === op
                        ? "bg-black text-white border-white"
                        : "bg-white text-black border-black"
                    }`}
                    onClick={() => setRespostas({ ...respostas, [idx]: op })}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </form>
      <div className="mt-8">
        <div className="w-full bg-white/10 rounded-full h-6 mb-2">
          <div
            className="bg-gradient-to-r from-white to-black h-6 rounded-full"
            style={{ width: `${Math.round((nivelFuria / maxPontos) * 100)}%` }}
          ></div>
        </div>
        <p className="text-2xl font-bold">
          {Math.round((nivelFuria / maxPontos) * 100)}% Nível de Fúria
        </p>
      </div>
    </div>
  );
};

export default FuriaQuizForm;
