import React, { useEffect } from "react";
import { UserFormData } from "../types";

const jogadoresFuria = [
  "Fallen",
  "KSCERATO",
  "yuurih",
  "Yekindar",
  "Molodoy", // CS2
  "raafa",
  "mwzera",
  "heat",
  "havoc",
  "Khalil", // Valorant
  "Pryze",
  "Urango",
  "yANXNZ",
  "Lostt",
  "DRUFINHO",
  "STL",
  "guizeraa	",
  "Haven",
  "zKrakeN",
  "possa",
  "Tatu",
  "Guigo",
  "Jojo",
  "Ayu",
  "Tutsz",
  // Adicione outros jogadores de outros jogos aqui
];

const jogosFuria = [
  "CS2",
  "Valorant",
  "League of Legends",
  "Rocket League",
  "Rainbow Six",
  "Fortnite",
  "PUBG",
  "Dota 2",
  "Apex Legends",
  "Free Fire",
];

interface InterestsFormProps {
  formData: UserFormData;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({
  formData,
  onChange,
  onNext,
  onPrev,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const isFormValid = () => {
    return (
      formData.gamesPlayed.length > 0 && formData.favoritePlayer.trim() !== ""
    );
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let newGamesPlayed = [...formData.gamesPlayed];

    if (checked) {
      newGamesPlayed.push(value);
    } else {
      newGamesPlayed = newGamesPlayed.filter((jogo) => jogo !== value);
    }

    onChange({
      target: {
        name: "gamesPlayed",
        value: newGamesPlayed,
      },
    } as any);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
      <h2 className="text-2xl font-mono font-bold tracking-tight mb-6">
        PERFIL GAMER
      </h2>

      <div className="space-y-4">
        {/* Jogos que joga */}
        <div>
          <label className="block text-sm font-mono uppercase tracking-wider mb-1">
            Quais jogos você joga?
          </label>
          <div className="flex flex-wrap gap-3">
            {jogosFuria.map((jogo) => (
              <label key={jogo} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="gamesPlayed"
                  value={jogo}
                  checked={formData.gamesPlayed.includes(jogo)}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 border-2 border-gray-800 focus:ring-0"
                />
                <span className="font-mono">{jogo}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Jogador favorito */}
        <div>
          <label className="block text-sm font-mono uppercase tracking-wider mb-1">
            Quem é seu jogador favorito?
          </label>
          <select
            name="favoritePlayer"
            value={formData.favoritePlayer}
            onChange={onChange}
            className="w-full px-4 py-3 bg-transparent border-2 border-gray-800 focus:border-black focus:ring-0 font-mono transition-all duration-300"
            required
          >
            <option value="">Selecione um jogador</option>
            {jogadoresFuria.map((jogador) => (
              <option key={jogador} value={jogador}>
                {jogador}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox de eventos */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="attendedEvents"
            name="attendedEvents"
            checked={formData.attendedEvents}
            onChange={onChange}
            className="h-5 w-5 border-2 border-gray-800 focus:ring-0"
          />
          <label
            htmlFor="attendedEvents"
            className="ml-2 block text-sm font-mono"
          >
            Eu já participei de eventos de e-sports.
          </label>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onPrev}
          className="w-1/2 py-3 px-6 bg-white border-2 border-black text-black font-mono uppercase tracking-wider hover:bg-gray-100 transition-all duration-300"
        >
          Voltar
        </button>

        <button
          type="submit"
          disabled={!isFormValid()}
          className="w-1/2 py-3 px-6 bg-black text-white font-mono uppercase tracking-wider hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform"
        >
          Próximo
        </button>
      </div>
    </form>
  );
};

export default InterestsForm;
