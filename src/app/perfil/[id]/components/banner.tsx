'use client'

import { PlayIcon, ClockIcon, StarIcon, ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Image from "next/image";

export interface Movie {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl?: string;
  isNewRelease: boolean;
  isSeries?: boolean;
}

export interface BannerProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function Banner({ movie, onClose }: BannerProps) {
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingWatchLater, setLoadingWatchLater] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!movie) return null;

  const handleAddToFavorites = async () => {
    const storedProfile = localStorage.getItem("activeProfile");
    if (!storedProfile) return setMessage("Nenhum perfil selecionado");
    const profile = JSON.parse(storedProfile);
    const contentType = movie.isSeries ? "series" : "movie";
    setLoadingFavorites(true);
    setMessage(null);

    try {
      const res = await fetch("/api/perfil/favoritos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profileId: profile._id, contentId: movie._id, contentType }),
      });
      const data = await res.json();
      setMessage(res.ok ? "✅ Adicionado aos favoritos!" : `❌ ${data.message || "Erro"}`);
    } catch {
      setMessage("❌ Erro de conexão");
    } finally {
      setLoadingFavorites(false);
    }
  };

  const handleAddToWatchLater = async () => {
    const storedProfile = localStorage.getItem("activeProfile");
    if (!storedProfile) return setMessage("Nenhum perfil selecionado");
    const profile = JSON.parse(storedProfile);
    const contentType = movie.isSeries ? "series" : "movie";
    setLoadingWatchLater(true);
    setMessage(null);

    try {
      const res = await fetch("/api/perfil/watchLater/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ profileId: profile._id, contentId: movie._id, contentType }),
      });
      const data = await res.json();
      setMessage(res.ok ? "⏰ Adicionado à lista!" : `❌ ${data.message || "Erro"}`);
    } catch {
      setMessage("❌ Erro de conexão");
    } finally {
      setLoadingWatchLater(false);
    }
  };

  return (
    <div
      className="fixed top-0 z-50 w-full p-4 md:p-6 lg:p-8 flex items-center gap-4 md:gap-6 lg:gap-8 shadow-lg rounded-b-lg"
      style={{
        backgroundImage: 'linear-gradient(to right, rgba(30,30,30,0.85), rgba(30,30,30,0.2))',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Botão de fechar */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white hover:text-gray-300"
      >
        <XMarkIcon className="w-full h-full" />
      </button>

      {/* Poster responsivo */}
      <div className="w-20 md:w-24 lg:w-28 flex-shrink-0">
        <Image
          src={movie.thumbnailUrl}
          alt={movie.title}
          width={80}
          height={120}
          className="rounded-md shadow"
        />
      </div>

      {/* Conteúdo textual */}
      <div className="flex-1 text-white flex flex-col justify-between">
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold truncate">{movie.title}</h2>
        <p className="text-gray-300 text-xs md:text-sm lg:text-base mt-1 md:mt-2">{`Ano: ${movie.releaseYear}`}</p>

        <div className="flex items-center gap-2 md:gap-3 lg:gap-4 mt-2 md:mt-3">
          <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-blue-600 hover:bg-blue-700 rounded transition">
            <PlayIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>

          <button
            onClick={handleAddToFavorites}
            disabled={loadingFavorites}
            className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full transition ${
              loadingFavorites ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {loadingFavorites ? (
              <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <StarIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            )}
          </button>

          <button
            onClick={handleAddToWatchLater}
            disabled={loadingWatchLater}
            className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-full transition ${
              loadingWatchLater ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {loadingWatchLater ? (
              <div className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ClockIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
            )}
          </button>

          <button className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
            <ArrowDownTrayIcon className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
          </button>
        </div>

        {message && (
          <div className="mt-1 md:mt-2 p-1 md:p-2 bg-gray-800 text-white rounded text-xs md:text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
