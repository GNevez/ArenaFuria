"use client";

import React, { useState, useEffect } from "react";
import { LoginData } from "../../types";
import {
  initialLoginData,
} from "../../utils/formHelpers";
import Login from "../../components/Entrar/Login"

import furia from "../../assets/logo-furia.svg";
import logo from "../../assets/Furia_Esports_logo.png";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "../../hooks/useAuth";

import axios from "axios";
import Button from "@/UI/button";
import { LogIn } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";

const Entrar: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>(initialLoginData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user, loading, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  // Rotate between background images
  useEffect(() => {
    const images = [
      "https://images.pexels.com/photos/2007647/pexels-photo-2007647.jpeg",
      "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
    ];

    const interval = setInterval(() => {
      setBackgroundImage((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const getBackgroundImage = () => {
    const images = [
      "https://img-cdn.hltv.org/gallerypicture/MxHkMlj7n5aZCct0KUPdCy.jpg?ixlib=java-2.1.0&m=%2Fm.png&mw=160&mx=30&my=710&w=1200&s=7f299571019d4e09868f145add96c25e",
      "https://cdn.ome.lt/DjkGINDnvJDyDbRHGySwyJtO7mI=/1200x630/smart/extras/conteudos/furia-eliminada-iem-rio-2023-csgo.jpg",
      "https://conteudo.imguol.com.br/c/esporte/f9/2022/11/06/brasileiros-lotam-riocentro-para-apoiar-furia-no-major-2022-de-cs-1667771992113_v2_900x506.jpg",
    ];
    return images[backgroundImage];
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/login", {
        email: formData.email,
        senha: formData.senha,
      });

      if (response.data.usuario) {
        console.log("Login realizado com sucesso:", response.data);
        // Armazenar dados do usuário no localStorage
        localStorage.setItem("userData", JSON.stringify(response.data.usuario));
        // Redirecionar para a página inicial
        window.location.href = "/";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.erro || "Erro ao fazer login");
        console.error("Erro no login:", error.response?.data);
      } else {
        setError("Erro desconhecido ao fazer login");
        console.error("Erro desconhecido:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col items-center justify-start p-4 md:p-0"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 2s ease-in-out",
      }}
    >
      <nav className="container mx-auto px-6 py-6 z-30">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Image src={logo} alt="Logo" className="w-8 h-8 mr-2" />
              <Image src={furia} alt="Furia" />
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
      <Link href="/">
        <div className="flex items-center mb-12 gap-3">
          <Image src={logo} alt="Logo" className="w-18 h-18 " />
          <Image src={furia} alt="Furia" className="w-36" />
        </div>
      </Link>
      <div className="w-full max-w-md md:max-w-lg">
        <div className="bg-white p-8 shadow-2xl">
          <h1 className="text-3xl font-mono font-bold tracking-tight mb-2 text-center">
            LOGIN FURIOSO!
          </h1>
          <p className="text-center font-mono text-sm mb-8">
            Entre como um FURIOSO!
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <Login
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />

          {isLoading && (
            <div className="mt-4 text-center">
              <p className="text-gray-600">Carregando...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Entrar;
