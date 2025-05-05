"use client";

import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Send, Gamepad2, Users } from "lucide-react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const [mensagem, setMensagem] = useState("");
  const [jogos, setJogos] = useState("");
  const [streamers, setStreamers] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  if (!loading && !user) {
    redirect("/Entrar");
  }

  const handleEnviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    setSucesso(null);

    try {
      const response = await axios.post("/api/admin/enviar-mensagem", {
        mensagem,
      });

      setSucesso("Mensagem enviada com sucesso!");
      setMensagem("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErro(error.response?.data?.erro || "Erro ao enviar mensagem");
      } else {
        setErro("Erro desconhecido ao enviar mensagem");
      }
    } finally {
      setEnviando(false);
    }
  };

  const handleAtualizarJogos = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    setSucesso(null);

    try {
      const response = await axios.post("/api/admin/atualizar-jogos", {
        jogos,
      });

      setSucesso("Jogos atualizados com sucesso!");
      setJogos("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErro(error.response?.data?.erro || "Erro ao atualizar jogos");
      } else {
        setErro("Erro desconhecido ao atualizar jogos");
      }
    } finally {
      setEnviando(false);
    }
  };

  const handleAtualizarStreamers = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    setSucesso(null);

    try {
      const response = await axios.post("/api/admin/atualizar-streamers", {
        streamers,
      });

      setSucesso("Streamers atualizados com sucesso!");
      setStreamers("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErro(error.response?.data?.erro || "Erro ao atualizar streamers");
      } else {
        setErro("Erro desconhecido ao atualizar streamers");
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard className="w-8 h-8 text-white" />
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Notifique os fãns!</h2>
              <div className="space-y-4">
                <form
                  onSubmit={handleEnviarMensagem}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <textarea
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    placeholder="Digite sua mensagem para os fãns..."
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white mb-4 min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      disabled={enviando || !mensagem.trim()}
                      className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {enviando ? "Enviando..." : "Enviar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Atualizar Jogos</h2>
              <div className="space-y-4">
                <form
                  onSubmit={handleAtualizarJogos}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <textarea
                    value={jogos}
                    onChange={(e) => setJogos(e.target.value)}
                    placeholder="Digite os próximos jogos no formato markdown..."
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white mb-4 min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      disabled={enviando || !jogos.trim()}
                      className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      {enviando ? "Atualizando..." : "Atualizar Jogos"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">
                Atualizar Streamers
              </h2>
              <div className="space-y-4">
                <form
                  onSubmit={handleAtualizarStreamers}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <textarea
                    value={streamers}
                    onChange={(e) => setStreamers(e.target.value)}
                    placeholder="Digite a lista de streamers no formato markdown..."
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white mb-4 min-h-[100px]"
                  />
                  <div className="flex justify-between items-center">
                    <button
                      type="submit"
                      disabled={enviando || !streamers.trim()}
                      className="bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      {enviando ? "Atualizando..." : "Atualizar Streamers"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {erro && <p className="text-red-500 text-sm mt-4">{erro}</p>}
          {sucesso && <p className="text-green-500 text-sm mt-4">{sucesso}</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
