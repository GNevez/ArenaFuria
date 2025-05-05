"use client";

import React, { useState, useEffect } from "react";
import { FormStep, UserFormData } from "../../types";
import { initialFormData, formatCPF } from "../../utils/formHelpers";
import FormProgress from "../../components/FormProgress";
import PersonalInfoForm from "../../components/PersonalInfoForm";
import InterestsForm from "../../components/InterestsForm";
import DocumentUploadForm from "../../components/DocumentUploadForm";
import ReviewForm from "../../components/ReviewForm";
import RegistrationSuccess from "../../components/RegistrationSuccess";
import AddressForm from "../../components/AddressForm";
import furiaLogo2 from "../../assets/logo-furia.svg";

import furia from "../../assets/logo-furia.svg";
import logo from "../../assets/Furia_Esports_logo.png";
import Image from "next/image";
import { useAuth } from "../../hooks/useAuth";

import axios from "axios";
import Link from "next/link";
import Button from "@/UI/button";
import { LogIn } from "lucide-react";
import UserDropdown from "@/components/UserDropdown";

const Cadastro: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>("personal");
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {
  const target = e.target;
  const { name, value, type } = target;

  if (target instanceof HTMLInputElement && type === "checkbox") {
    setFormData((prev) => ({ ...prev, [name]: target.checked }));
  } else if (target instanceof HTMLInputElement && type === "file") {
    const file = target.files ? target.files[0] : null;
    setFormData((prev) => ({ ...prev, [name]: file }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  const nextStep = () => {
    const steps: FormStep[] = [
      "personal",
      "address",
      "interests",
      "document",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: FormStep[] = [
      "personal",
      "address",
      "interests",
      "document",
      "review",
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Começa o carregamento
    setSubmitError(null); // Limpa erro anterior

    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("senha", formData.senha);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("cpf", formData.cpf);
    formDataToSend.append("gamesPlayed", formData.gamesPlayed);
    formDataToSend.append("favoritePlayer", formData.favoritePlayer);
    formDataToSend.append("attendedEvents", formData.attendedEvents.toString());

    if (formData.idDocument) {
      formDataToSend.append("idDocument", formData.idDocument);
    }

    try {
      const response = await axios.post("/api/cadastro", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Resposta do servidor:", response.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Erro ao enviar:", error);
      if (axios.isAxiosError(error)) {
        const mensagem =
          error.response?.data?.erro ||
          error.response?.data?.message ||
          "Erro ao enviar formulário.";
        setSubmitError(mensagem);
      } else {
        setSubmitError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsLoading(false); // Finaliza carregamento
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep("personal");
    setIsSubmitted(false);
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case "personal":
        return (
          <PersonalInfoForm
            formData={formData}
            onChange={handleChange}
            onNext={nextStep}
          />
        );
      case "address":
        return (
          <AddressForm
            formData={formData}
            onChange={handleChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "interests":
        return (
          <InterestsForm
            formData={formData}
            onChange={handleChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "document":
        return (
          <DocumentUploadForm
            formData={formData}
            onChange={handleChange}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case "review":
        return (
          <ReviewForm
            formData={formData}
            onSubmit={handleSubmit}
            onPrev={prevStep}
          />
        );
      default:
        return null;
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
      <div className="flex items-center mb-12 gap-3">
        <Image src={logo} alt="Logo" className="w-18 h-18 " />
        <Image src={furia} alt="Furia" className="w-36" />
      </div>
      <div className="w-full max-w-md md:max-w-lg pb-20">
        <div className="bg-white p-8 shadow-2xl">
          <h1 className="text-3xl font-mono font-bold tracking-tight mb-2 text-center">
            REGISTRO FURIOSO!
          </h1>
          <p className="text-center font-mono text-sm mb-8">
            Cadastre-se como um FURIOSO!
          </p>

          {!isSubmitted ? (
            <>
              <FormProgress currentStep={currentStep} />
              {renderFormStep()}
              {isLoading && (
                <p className="text-center text-sm text-gray-500 mt-4">
                  Enviando...
                </p>
              )}

              {submitError && (
                <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <p>{submitError}</p>
                </div>
              )}
            </>
          ) : (
            <RegistrationSuccess onReset={resetForm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Cadastro;
