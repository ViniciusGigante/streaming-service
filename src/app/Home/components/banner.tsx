import { PlayIcon, ClockIcon, StarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Image from "next/image";

interface Movie {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
  isSeries?: boolean;
}

interface BannerProps {
  movie: Movie | null;
}

export default function Banner({ movie }: BannerProps) {
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
    <div className="sticky top-0 z-50 w-full bg-gradient-to-b from-gray-900/95 to-gray-900 p-6 flex flex-col md:flex-row items-center md:items-start gap-6 rounded-b-xl shadow-xl">
      {/* Poster lateral */}
      <div className="w-36 md:w-48 flex-shrink-0">
        <Image
          src={movie.thumbnailUrl}
          alt={movie.title}
          width={192}
          height={288}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Conteúdo textual */}
      <div className="flex-1 text-white flex flex-col justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>
          <p className="text-gray-300 mt-1">Ano: {movie.releaseYear}</p>
          <p className="text-gray-300 mt-3 text-sm line-clamp-3">{movie.description}</p>
        </div>

        {/* Botões */}
        <div className="flex flex-wrap gap-3 mt-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition">
            <PlayIcon className="w-5 h-5" />
            Assistir
          </button>

          <button
            onClick={handleAddToFavorites}
            disabled={loadingFavorites}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
              loadingFavorites ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {loadingFavorites ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <StarIcon className="w-6 h-6" />
            )}
          </button>

          <button
            onClick={handleAddToWatchLater}
            disabled={loadingWatchLater}
            className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
              loadingWatchLater ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {loadingWatchLater ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <ClockIcon className="w-6 h-6" />
            )}
          </button>

          <button className="flex items-center justify-center w-12 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
            <ArrowDownTrayIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div className="mt-2 p-2 bg-gray-800 text-white rounded text-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
