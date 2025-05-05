"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { FaTwitch, FaSteam } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import furiaLogo from "../../assets/Furia_Esports_logo.png";
import furiaLogo2 from "../../assets/logo-furia.svg";

import UserDropdown from "@/components/UserDropdown";
import { LogIn } from "lucide-react";
import Link from "next/link";
import Button from "@/UI/button";
import logo from "../../assets/Furia_Esports_logo.png";

const steamIcon =
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/ee/eea1e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2e2_full.jpg"; // Ícone padrão Steam

const jogadores = {
  Fallen: {
    nome: "Fallen",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/e8b0563d-a036-4bd6-bf3e-5d6b2e9300cf-profile_image-70x70.png",
    steam: steamIcon,
  },
  KSCERATO: {
    nome: "KSCERATO",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/01247541-a2d8-435d-b764-12ce595f2f42-profile_image-70x70.png",
    steam: steamIcon,
  },
  yuurih: {
    nome: "yuurih",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/1a241547-9bf9-4de4-86da-9686341e7263-profile_image-150x150.png",
    steam: steamIcon,
  },
  Yekindar: {
    nome: "Yekindar",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/cecdc93a-b642-4c55-9e49-37d6be5bbb8d-profile_image-150x150.png",
    steam: steamIcon,
  },
  Molodoy: {
    nome: "Molodoy",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/molodoy-profile_image.png",
    steam: steamIcon,
  },
  raafa: {
    nome: "raafa",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/2389e031-e2f6-40bc-8a72-ccfccc277f28-profile_image-150x150.png",
    steam: steamIcon,
  },
  mwzera: {
    nome: "mwzera",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/4d7ab066-c988-482c-90db-fa3e0eb40b29-profile_image-70x70.png",
    steam: steamIcon,
  },
  heat: {
    nome: "heat",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/heat-profile_image.png",
    steam: steamIcon,
  },
  havoc: {
    nome: "havoc",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/havoc-profile_image.png",
    steam: steamIcon,
  },
  Khalil: {
    nome: "Khalil",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/42daffb3-0ad5-439c-b8fa-b69412824ab4-profile_image-150x150.png",
    steam: steamIcon,
  },
  Pryze: {
    nome: "Pryze",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/pryze-profile_image.png",
    steam: steamIcon,
  },
  Urango: {
    nome: "Urango",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/urango-profile_image.png",
    steam: steamIcon,
  },
  yANXNZ: {
    nome: "yANXNZ",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/yanxnz-profile_image.png",
    steam: steamIcon,
  },
  Lostt: {
    nome: "Lostt",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/lostt-profile_image.png",
    steam: steamIcon,
  },
  DRUFINHO: {
    nome: "DRUFINHO",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/drufinho-profile_image.png",
    steam: steamIcon,
  },
  STL: {
    nome: "STL",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/stl-profile_image.png",
    steam: steamIcon,
  },
  guizeraa: {
    nome: "guizeraa",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/guizeraa-profile_image.png",
    steam: steamIcon,
  },
  Haven: {
    nome: "Haven",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/haven-profile_image.png",
    steam: steamIcon,
  },
  zKrakeN: {
    nome: "zKrakeN",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/zkraken-profile_image.png",
    steam: steamIcon,
  },
  possa: {
    nome: "possa",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/possa-profile_image.png",
    steam: steamIcon,
  },
  Tatu: {
    nome: "Tatu",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/tatu-profile_image.png",
    steam: steamIcon,
  },
  Guigo: {
    nome: "Guigo",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/guigo-profile_image.png",
    steam: steamIcon,
  },
  Jojo: {
    nome: "Jojo",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/jojo-profile_image.png",
    steam: steamIcon,
  },
  Ayu: {
    nome: "Ayu",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/ayu-profile_image.png",
    steam: steamIcon,
  },
  Tutsz: {
    nome: "Tutsz",
    avatar:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/tutsz-profile_image.png",
    steam: steamIcon,
  },
};

const jogosIcons: Record<string, string> = {
  CS2: "https://cdn2.steamgriddb.com/icon/e1bd06c3f8089e7552aa0552cb387c92/32/512x512.png",
  Valorant: "https://img.icons8.com/color/512/valorant.png",
  "League of Legends":
    "https://cdn2.steamgriddb.com/icon/882137f311c5728f8e257e56820af92c.png",
  "Apex Legends":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPtPZWUTu-_RJ50JjBlYyzPzBpJtYzVj9LYQ&s",
  "Rainbow Six": "https://img.icons8.com/?size=192&id=iExfEgcZKka2&format=png",
  PUBG: "https://cdn6.aptoide.com/imgs/3/d/6/3d6e973dbc5062b97facc26016f1b5ba_icon.png",
};

const dicasFuria = [
  "Participe de eventos da FURIA",
  "Vincule sua conta Steam",
  "Vincule sua conta Twitch",
  "Responda quizzes sobre a FURIA",
  "Assista as lives dos jogadores",
];

const perguntas = [
  {
    pergunta: "Você já participou de algum evento presencial da FURIA?",
    type: "boolean",
    pontos: 20,
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
  steamVinculado?: boolean;
  twitchVinculado?: boolean;
};

const FuriaQuizForm: React.FC<Props> = ({
  onChangeNivel,
  steamVinculado = false,
  twitchVinculado = false,
}) => {
  const [respostas, setRespostas] = useState<{ [key: number]: any }>({});
  const [perguntaAtual, setPerguntaAtual] = useState(0);

  // Pontos extras por contas vinculadas
  const pontosVinculo = (steamVinculado ? 15 : 0) + (twitchVinculado ? 15 : 0);

  // Calcula o nível de fúria
  const nivelFuria =
    perguntas.reduce((acc, p, idx) => {
      const r = respostas[idx];
      if (p.type === "boolean" && r === true) return acc + p.pontos;
      if (p.type === "alternativa" && r === p.resposta) return acc + p.pontos;
      return acc;
    }, 0) + pontosVinculo;

  useEffect(() => {
    onChangeNivel(Math.round((nivelFuria / (maxPontos + 30)) * 100));
    // 30 = 15 (Steam) + 15 (Twitch)
  }, [nivelFuria, onChangeNivel]);

  const handleResposta = (valor: any) => {
    setRespostas((prev) => ({ ...prev, [perguntaAtual]: valor }));
    setTimeout(() => {
      setPerguntaAtual((prev) => prev + 1);
    }, 300);
  };

  return (
    <div className="bg-white/5 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Perguntas FURIOSAS</h2>
      {perguntaAtual < perguntas.length ? (
        <div className="mb-4">
          <p className="font-bold mb-2">{perguntas[perguntaAtual].pergunta}</p>
          {perguntas[perguntaAtual].type === "boolean" ? (
            <div className="flex gap-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-bold border ${
                  respostas[perguntaAtual] === true
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
                onClick={() => handleResposta(true)}
              >
                Sim
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-lg font-bold border ${
                  respostas[perguntaAtual] === false
                    ? "bg-black text-white border-white"
                    : "bg-white text-black border-black"
                }`}
                onClick={() => handleResposta(false)}
              >
                Não
              </button>
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              {perguntas[perguntaAtual].opcoes?.map((op) => (
                <button
                  key={op}
                  type="button"
                  className={`px-4 py-2 rounded-lg font-bold border ${
                    respostas[perguntaAtual] === op
                      ? "bg-black text-white border-white"
                      : "bg-white text-black border-black"
                  }`}
                  onClick={() => handleResposta(op)}
                >
                  {op}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="font-bold text-lg mb-2">
            Você completou o Quiz FURIOSO!
          </p>
          <p className="text-gray-400">
            Seu nível de fúria foi atualizado com base nas respostas.
          </p>
        </div>
      )}
    </div>
  );
};

const streamersFuria = [
  {
    nome: "Fallen",
    avatar: jogadores.Fallen.avatar,
    canal: "https://twitch.tv/gafallen",
  },
  {
    nome: "KSCERATO",
    avatar: jogadores.KSCERATO.avatar,
    canal: "https://twitch.tv/kscerato",
  },
  {
    nome: "yuurih",
    avatar: jogadores.yuurih.avatar,
    canal: "https://twitch.tv/yuurih",
  },
  {
    nome: "Yekindar",
    avatar: jogadores.Yekindar.avatar,
    canal: "https://twitch.tv/yekindar",
  },
  {
    nome: "Molodoy",
    avatar: jogadores.Molodoy.avatar,
    canal: "", // Não tem canal
  },
  {
    nome: "raafa",
    avatar: jogadores.raafa.avatar,
    canal: "https://twitch.tv/1raafa",
  },
  {
    nome: "mwzera",
    avatar: jogadores.mwzera.avatar,
    canal: "https://twitch.tv/mwzera",
  },
  {
    nome: "heat",
    avatar: jogadores.heat.avatar,
    canal: "https://twitch.tv/heatfps1",
  },
  {
    nome: "havoc",
    avatar: jogadores.havoc.avatar,
    canal: "", // Não tem canal
  },
  {
    nome: "Khalil",
    avatar: jogadores.Khalil.avatar,
    canal: "https://twitch.tv/khalil_fps",
  },
  {
    nome: "Pryze",
    avatar: jogadores.Pryze.avatar,
    canal: "https://twitch.tv/luispryzee",
  },
  {
    nome: "Urango",
    avatar: jogadores.Urango.avatar,
    canal: "https://twitch.tv/urangovlr",
  },
  {
    nome: "yANXNZ",
    avatar: jogadores.yANXNZ.avatar,
    canal: "https://twitch.tv/yanxnz_",
  },
  {
    nome: "Lostt",
    avatar: jogadores.Lostt.avatar,
    canal: "https://twitch.tv/losttrl",
  },
  {
    nome: "DRUFINHO",
    avatar: jogadores.DRUFINHO.avatar,
    canal: "https://twitch.tv/drufinhorl",
  },
  {
    nome: "STL",
    avatar: jogadores.STL.avatar,
    canal: "", // Não tem canal
  },
  {
    nome: "guizeraa",
    avatar: jogadores.guizeraa.avatar,
    canal: "https://twitch.tv/guizeraafps",
  },
  {
    nome: "Haven",
    avatar: jogadores.Haven.avatar,
    canal: "https://twitch.tv/haven1fps",
  },
  {
    nome: "zKrakeN",
    avatar: jogadores.zKrakeN.avatar,
    canal: "https://twitch.tv/zkrakenfps",
  },
  {
    nome: "possa",
    avatar: jogadores.possa.avatar,
    canal: "https://twitch.tv/possamai",
  },
  {
    nome: "Tatu",
    avatar: jogadores.Tatu.avatar,
    canal: "https://twitch.tv/tatulol1",
  },
  {
    nome: "Guigo",
    avatar: jogadores.Guigo.avatar,
    canal: "https://twitch.tv/guigolol_",
  },
  {
    nome: "Jojo",
    avatar: jogadores.Jojo.avatar,
    canal: "https://twitch.tv/jojolol11",
  },
  {
    nome: "Ayu",
    avatar: jogadores.Ayu.avatar,
    canal: "", // Não tem canal
  },
  {
    nome: "Tutsz",
    avatar: jogadores.Tutsz.avatar,
    canal: "https://twitch.tv/tutszlol",
  },
];

// Mapeamento de jogadores para seus IDs da Twitch
const twitchIds: Record<string, string> = {
  Fallen: "gafallen",
  KSCERATO: "kscerato",
  yuurih: "yuurih",
  Yekindar: "yekindar",
  Molodoy: "",
  raafa: "1raafa",
  mwzera: "mwzera",
  heat: "heatfps1",
  havoc: "",
  Khalil: "khalil_fps",
  Pryze: "luispryzee",
  Urango: "urangovlr",
  yANXNZ: "yanxnz_",
  Lostt: "losttrl",
  DRUFINHO: "drufinhorl",
  STL: "",
  guizeraa: "guizeraafps",
  Haven: "haven1fps",
  zKrakeN: "zkrakenfps",
  possa: "possamai",
  Tatu: "tatulol1",
  Guigo: "guigolol_",
  Jojo: "jojolol11",
  Ayu: "",
  Tutsz: "tutszlol",
};

const Perfil: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [favoritePlayer, setFavoritePlayer] = useState<string | null>(null);
  const [favoriteGames, setFavoriteGames] = useState<string[]>([]);
  const [furiaLevel, setFuriaLevel] = useState(0);
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [twitchData, setTwitchData] = useState<any>(null);
  const [steamData, setSteamData] = useState<any>(null);
  const [twitchVinculado, setTwitchVinculado] = useState(false);
  const [steamVinculado, setSteamVinculado] = useState(false);

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

        setFavoritePlayer(data.favoritePlayer);
        setFavoriteGames(data.gamesPlayed || []);
        setTwitchData(data.twitch);
        setSteamData(data.steam);
        setTwitchVinculado(!!data.twitch);
        setSteamVinculado(!!data.steam);
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

  if (loadingPreferences) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-10"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,1)),
              url("https://img-cdn.hltv.org/gallerypicture/MxHkMlj7n5aZCct0KUPdCy.jpg?ixlib=java-2.1.0&m=%2Fm.png&mw=160&mx=30&my=710&w=1200&s=7f299571019d4e09868f145add96c25e")
            `,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Header */}
        <div className="relative z-20">
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
                      <Button
                        variant="primary"
                        size="md"
                        className="font-medium"
                      >
                        Entrar
                        <LogIn className="ml-2" />
                      </Button>
                    </Link>
                    <Link href={"/Cadastro"}>
                      <Button
                        variant="primary"
                        size="md"
                        className="font-medium"
                      >
                        Cadastrar-se
                        <LogIn className="ml-2" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </nav>
          <main className="max-w-5xl mx-auto py-10 px-4 space-y-10">
            {/* Topo: Live + Nível de Fúria */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Live do jogador favorito */}
              <section className="bg-white/5 rounded-2xl p-6 flex flex-col items-center shadow-lg">
                {favoritePlayer ? (
                  <>
                    <Image
                      src={
                        jogadores[favoritePlayer as keyof typeof jogadores]
                          ?.avatar || furiaLogo
                      }
                      alt={favoritePlayer}
                      width={80}
                      height={80}
                      className="rounded-full border-4 border-white shadow mb-2"
                    />
                    <p className="mb-2 text-lg font-bold">{favoritePlayer}</p>
                    <h2 className="text-base font-semibold mb-2">
                      Live do seu jogador favorito
                    </h2>
                    <div className="w-full aspect-video rounded-lg overflow-hidden border border-white/10 bg-black max-w-lg mx-auto">
                      <iframe
                        src={
                          twitchIds[favoritePlayer || ""]
                            ? `https://player.twitch.tv/?channel=${twitchIds[favoritePlayer]}&parent=localhost`
                            : ""
                        }
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">
                      Você ainda não selecionou um jogador favorito
                    </p>
                    <button className="bg-black border border-white rounded-lg px-5 py-3 text-white font-bold hover:bg-white hover:text-black transition">
                      Selecionar Jogador
                    </button>
                  </div>
                )}
              </section>

              {/* Nível de Fúria */}
              <section className="bg-white/5 rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                <h2 className="text-base font-semibold mb-4">Nível de Fúria</h2>
                <div className="w-full bg-white/10 rounded-full h-6 mb-2">
                  <div
                    className="bg-gradient-to-r from-white to-black h-6 rounded-full"
                    style={{ width: `${furiaLevel}%` }}
                  ></div>
                </div>
                <p className="text-2xl font-bold">{furiaLevel}%</p>
                <p className="text-gray-400 mt-2">
                  Dicas para aumentar seu nível:
                </p>
                <ul className="list-disc ml-6 text-gray-300 mb-4">
                  {dicasFuria.map((dica) => (
                    <li key={dica}>{dica}</li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2">
                  {twitchData ? (
                    <div className="flex items-center gap-2 bg-black border border-white rounded-lg px-5 py-3 text-white font-bold">
                      <img
                        src={twitchData.twitch_avatar}
                        alt={twitchData.twitch_login}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-bold text-[#9147ff]">
                        @{twitchData.twitch_login}
                      </span>
                    </div>
                  ) : (
                    <button
                      className="flex items-center gap-2 bg-black border border-white rounded-lg px-5 py-3 text-white font-bold hover:bg-white hover:text-black transition"
                      onClick={() =>
                        (window.location.href = "/api/auth/twitch")
                      }
                    >
                      <FaTwitch className="w-6 h-6 text-[#9147ff]" /> Vincular
                      Twitch
                    </button>
                  )}
                  {steamData ? (
                    <div className="flex items-center gap-2 bg-black border border-white rounded-lg px-5 py-3 text-white font-bold">
                      <img
                        src={steamData.steam_avatar}
                        alt={steamData.steam_persona}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-bold text-[#66c0f4]">
                        {steamData.steam_persona}
                      </span>
                    </div>
                  ) : (
                    <button
                      className="flex items-center gap-2 bg-black border border-white rounded-lg px-5 py-3 text-white font-bold hover:bg-white hover:text-black transition"
                      onClick={() => (window.location.href = "/api/auth/steam")}
                    >
                      <FaSteam className="w-6 h-6 text-[#66c0f4]" /> Vincular
                      Steam
                    </button>
                  )}
                </div>
              </section>
            </div>

            {/* Jogos Favoritos */}
            <section>
              <h2 className="text-xl font-semibold mb-4">
                Seus Jogos Favoritos
              </h2>
              {favoriteGames.length > 0 ? (
                <div className="flex flex-wrap gap-6">
                  {favoriteGames.map((jogo: string) => (
                    <div
                      key={jogo}
                      className="flex flex-col items-center bg-white/5 rounded-xl p-4 shadow border border-white/10"
                    >
                      <img
                        src={jogosIcons[jogo] || furiaLogo.src}
                        alt={jogo}
                        className="w-16 h-16 object-contain mb-2"
                      />
                      <span className="font-bold">{jogo}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-400 mb-4">
                    Você ainda não selecionou jogos favoritos
                  </p>
                  <button className="bg-black border border-white rounded-lg px-5 py-3 text-white font-bold hover:bg-white hover:text-black transition">
                    Selecionar Jogos
                  </button>
                </div>
              )}
            </section>

            {/* Streamers da FURIA */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Streamers da FURIA</h2>
              <div className="swiper-container">
                <Swiper
                  spaceBetween={24}
                  slidesPerView={2}
                  breakpoints={{
                    640: { slidesPerView: 3 },
                    1024: { slidesPerView: 5 },
                  }}
                  className="py-2"
                >
                  {streamersFuria.map((streamer) => (
                    <SwiperSlide key={streamer.nome}>
                      <div className="flex flex-col items-center bg-white/5 rounded-xl p-4 shadow border border-white/10 w-40">
                        <img
                          src={streamer.avatar}
                          alt={streamer.nome}
                          className="w-16 h-16 object-cover rounded-full mb-2 border-2 border-white"
                        />
                        <span className="font-bold mb-2">{streamer.nome}</span>
                        <a
                          href={streamer.canal}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-black border border-white rounded-lg px-3 py-1 text-white font-bold hover:bg-white hover:text-black transition text-xs"
                        >
                          Ver Canal
                        </a>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </section>

            {/* Quiz FURIA */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Quiz FURIA</h2>
              <FuriaQuizForm
                onChangeNivel={setFuriaLevel}
                twitchVinculado={twitchVinculado}
                steamVinculado={steamVinculado}
              />
            </section>
          </main>

          {/* Rodapé */}
          <footer className="mt-16 text-gray-500 text-xs tracking-widest uppercase text-center">
            FURIA Esports © {new Date().getFullYear()}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
