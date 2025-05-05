"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { redirect } from "next/navigation";
import Image from "next/image";
import furiaLogo from "../../assets/Furia_Esports_logo.png";
import furiaLogo2 from "../../assets/logo-furia.svg";
import { FaTwitch, FaSteam } from "react-icons/fa";
import UserDropdown from "@/components/UserDropdown";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Button from "@/UI/button";
import logo from "../../assets/Furia_Esports_logo.png";

const Perfil: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [twitchData, setTwitchData] = useState<any>(null);
  const [steamData, setSteamData] = useState<any>(null);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [isattendedEvents, setAttendedEvents] = useState<boolean>(false);
  const [gamesPlayed, setGamesPlayed] = useState<number>(0);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await fetch("/api/user/preferences");
        if (!response.ok) throw new Error("Erro ao buscar preferências");
        const data = await response.json();

        setTwitchData(data.twitch);
        setSteamData(data.steam);
        setGamesPlayed(data.gamesPlayed);
        setAttendedEvents(data.attendedEvents);
      } catch (error) {
        console.error("Erro ao carregar preferências:", error);
      } finally {
        setLoadingPreferences(false);
      }
    };

    if (user) {
      fetchUserPreferences();
    }
  }, [user]);

  if (!loading && !user) {
    redirect("/Entrar");
  }

  return (
    <div className="relative min-h-screen bg-[#181A21] flex flex-col items-center overflow-hidden">
      {/* Background com fade */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            'url("https://img-cdn.hltv.org/gallerypicture/MxHkMlj7n5aZCct0KUPdCy.jpg?ixlib=java-2.1.0&m=%2Fm.png&mw=160&mx=30&my=710&w=1200&s=7f299571019d4e09868f145add96c25e")',
          backgroundPositionY: "-15rem",
          opacity: 0.25,
          transition: "opacity 0.5s",
        }}
      />
      <nav className="container mx-auto px-6 py-6 z-30">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Image src={logo} alt="Logo" className="w-8 h-8 mr-2" />
              <Image src={furiaLogo2} alt="Furia" />
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {!loading && user ? (
              <UserDropdown userName={user.name} onLogout={handleLogout} />
            ) : (
              <>
                <Link href={"/Entrar"}>
                  <Button variant="primary" size="md" className="font-medium">
                    Entrar
                    <LogIn className="ml-2" />
                  </Button>
                </Link>
                <Link href={"/Cadastro"}>
                  <Button variant="primary" size="md" className="font-medium">
                    Cadastrar-se
                    <LogIn className="ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Conteúdo principal */}
      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Topo com logo */}
        <div className="flex flex-col items-center mb-8">
          <Image
            src={furiaLogo2}
            alt="Logo FURIA"
            width={200}
            className="mb-2"
          />
        </div>

        {/* Card principal */}
        <p className="text-white text-2xl font-bold text-left mb-4">
          Seu Perfil FURIA!
        </p>
        <div className="w-full max-w-4xl bg-[#23262E] rounded-2xl shadow-2xl border border-[#222] flex flex-col md:flex-row p-8 gap-8">
          {/* Avatar e dados básicos */}
          <div className="flex flex-col items-center md:w-1/3">
            <Image
              src={
                twitchData?.twitch_avatar ||
                steamData?.steam_avatar ||
                furiaLogo
              }
              alt="Avatar"
              width={120}
              height={120}
              className="rounded-full border-4 border-[#222] shadow-lg bg-[#111]"
            />
            <div className="mt-4 text-center">
              <p className="text-xl font-bold text-white">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Informações e estatísticas */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4 border-b border-[#333] pb-2">
                Estatísticas
              </h2>
              <div className="flex gap-6 mb-6">
                <div className="bg-[#181A21] rounded-lg p-4 flex-1 text-center border border-[#222]">
                  <span className="text-gray-400 text-xs uppercase">
                    Jogos Jogados
                  </span>
                  <p className="text-2xl font-bold text-white mt-2">
                    {gamesPlayed}
                  </p>
                </div>
                <div className="bg-[#181A21] rounded-lg p-4 flex-1 text-center border border-[#222]">
                  <span className="text-gray-400 text-xs uppercase">
                    Participou de eventos?
                  </span>
                  <p className="text-2xl font-bold text-white mt-2">
                    {isattendedEvents ? "Sim" : "Não"}
                  </p>
                </div>
              </div>
            </div>

            {/* Vincular plataformas */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Vincular Plataformas
              </h2>
              <div className="flex gap-4">
                {twitchData ? (
                  <div className="flex items-center gap-2 bg-[#181A21] border border-[#444] rounded-lg px-5 py-3 text-white font-bold">
                    <img
                      src={twitchData.twitch_avatar}
                      alt={twitchData.twitch_login}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-[#9147ff]">
                      @{twitchData.twitch_login}
                    </span>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-2 bg-[#181A21] border border-[#444] rounded-lg px-5 py-3 text-white font-bold hover:bg-[#0e1014] transition"
                    onClick={() => (window.location.href = "/api/auth/twitch")}
                  >
                    <FaTwitch className="w-6 h-6 text-[#9147ff]" /> Vincular
                    Twitch
                  </button>
                )}
                {steamData ? (
                  <div className="flex items-center gap-2 bg-[#181A21] border border-[#444] rounded-lg px-5 py-3 text-white font-bold">
                    <img
                      src={steamData.steam_avatar}
                      alt={steamData.steam_persona}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-[#66c0f4]">
                      {steamData.steam_persona}
                    </span>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-2 bg-[#181A21] border border-[#444] rounded-lg px-5 py-3 text-white font-bold hover:bg-[#0e1014] transition"
                    onClick={() => (window.location.href = "/api/auth/steam")}
                  >
                    <FaSteam className="w-6 h-6 text-[#66c0f4]" /> Vincular
                    Steam
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <footer className="mt-16 text-gray-500 text-xs tracking-widest uppercase text-center">
          FURIA Esports © {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default Perfil;
 