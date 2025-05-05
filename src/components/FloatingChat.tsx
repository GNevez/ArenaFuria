"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, ChevronUp, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

import furia from "../assets/Furia_Esports_logo.png";
import Image from "next/image";

interface Message {
  text: string;
  sender: "user" | "bot";
  options?: string[];
}

const initialBotMessage: Message = {
  text: "Olá! Como posso ajudar você hoje?",
  sender: "bot",
  options: [
    "Ver próximos jogos da FURIA",
    "Ver streamers da FURIA",
    "Receber notificações no Telegram",
  ],
};

const botResponses: Record<string, Message> = {
  "Ver próximos jogos da FURIA": {
    text: "Carregando próximos jogos...",
    sender: "bot",
  },
  "Ver streamers da FURIA": {
    text: "Carregando streamers...",
    sender: "bot",
  },
  "Receber notificações no Telegram": {
    text: "Para receber notificações no Telegram, use o comando /notificar no nosso bot oficial: @Nevez_furiaBot ou acesse o link: https://t.me/Nevez_furiaBot",
    sender: "bot",
    options: initialBotMessage.options,
  },
};

const FloatingChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchJogos = async () => {
    try {
      const response = await fetch("/api/admin/jogos");
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Erro ao buscar jogos:", error);
      return "Erro ao carregar os jogos. Tente novamente mais tarde.";
    }
  };

  const fetchStreamers = async () => {
    try {
      const response = await fetch("/api/admin/streamers");
      const data = await response.text();
      return data;
    } catch (error) {
      console.error("Erro ao buscar streamers:", error);
      return "Erro ao carregar os streamers. Tente novamente mais tarde.";
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: Message = { text: message, sender: "user" };
      setMessages([...messages, newMessage]);
      setMessage("");

      setTimeout(() => {
        const botResponse = botResponses[message] || {
          text: "Desculpe, não entendi. Por favor, selecione uma das opções disponíveis.",
          sender: "bot",
          options: initialBotMessage.options,
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleOptionClick = async (option: string) => {
    const newMessage: Message = { text: option, sender: "user" };
    setMessages([...messages, newMessage]);

    if (option === "Ver próximos jogos da FURIA") {
      const jogos = await fetchJogos();
      setMessages((prev) => [
        ...prev,
        { text: jogos, sender: "bot" },
        {
          text: "🔥 Posso ajudar com mais alguma coisa? 🔥",
          sender: "bot",
          options: initialBotMessage.options,
        },
      ]);
    } else if (option === "Ver streamers da FURIA") {
      const streamers = await fetchStreamers();
      setMessages((prev) => [
        ...prev,
        { text: streamers, sender: "bot" },
        {
          text: "⚡ Precisa de mais alguma informação? ⚡",
          sender: "bot",
          options: initialBotMessage.options,
        },
      ]);
    } else {
      setTimeout(() => {
        const botResponse = botResponses[option] || {
          text: "Desculpe, ocorreu um erro. Por favor, tente novamente.",
          sender: "bot",
          options: initialBotMessage.options,
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="hover:bg-black cursor-pointer text-white p-3 rounded-full shadow-lg transition-colors items-center flex flex-col gap-2 bg-white"
        >
          <Image src={furia} alt="Furia" className="w-12 !fill-black"></Image>
        </button>
      ) : (
        <div
          className={`bg-black text-white rounded-lg shadow-xl ${
            isMinimized ? "w-64" : "w-80"
          }`}
        >
          <div className="flex items-center justify-between p-3 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Chat Furioso</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                {isMinimized ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-800 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[83%] p-3 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-white text-black"
                            : "bg-gray-800"
                        }`}
                      >
                        {msg.text.split("\n").map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                    {msg.options && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {msg.options.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleOptionClick(option)}
                            className="bg-gray-800 text-white px-3 py-1 rounded-lg text-sm hover:bg-gray-700 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-gray-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-white text-black p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default FloatingChat;
