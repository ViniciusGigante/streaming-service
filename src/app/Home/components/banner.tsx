import { PlayIcon, ClockIcon, StarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface Movie {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
  isSeries?: boolean; // Adicione esta propriedade
}

interface BannerProps {
  movie: Movie | null;
}

export default function Banner({ movie }: BannerProps) {
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [loadingWatchLater, setLoadingWatchLater] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!movie) {
    return null; 
  }

  // Função para adicionar aos favoritos
  const handleAddToFavorites = async () => {
    const storedProfile = localStorage.getItem("activeProfile");

    if (!storedProfile) {
      setMessage("Nenhum perfil selecionado");
      return;
    }

    const profile = JSON.parse(storedProfile);
    const profileId = profile._id;
    // ✅ CORRIJA ESTA LINHA - use minúsculo:
    const contentType = movie.isSeries ? 'series' : 'movie'; // ← 'series' e 'movie' em minúsculo

    console.log(profileId, movie._id, contentType);

    setLoadingFavorites(true);
    setMessage(null);

    try {
      const response = await fetch('/api/perfil/favoritos/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          profileId: profileId,
          contentId: movie._id,
          contentType: contentType // ← Agora vai enviar 'movie' ou 'series' em minúsculo
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("✅ Adicionado aos favoritos!");
      } else {
        setMessage(`❌ ${data.message || "Erro ao adicionar"}`);
      }
    } catch (error) {
      setMessage("❌ Erro de conexão");
    } finally {
      setLoadingFavorites(false);
    }
  };

  // Função para adicionar à lista "Assistir mais tarde"
  const handleAddToWatchLater = async () => {
    const storedProfile = localStorage.getItem("activeProfile");
    if (!storedProfile) {
      setMessage("Nenhum perfil selecionado");
      return;
    }

    const profile = JSON.parse(storedProfile);
    const profileId = profile._id;
    // ✅ CORRIJA ESTA LINHA - use minúsculo:
    const contentType = movie.isSeries ? 'series' : 'movie'; // ← 'series' e 'movie' em minúsculo

    setLoadingWatchLater(true);
    setMessage(null);

    try {
      const response = await fetch('/api/perfil/watchLater/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          profileId: profileId,
          contentId: movie._id,
          contentType: contentType // ← Agora vai enviar 'movie' ou 'series' em minúsculo
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage("⏰ Adicionado à lista!");
      } else {
        setMessage(`❌ ${data.message || "Erro ao adicionar"}`);
      }
    } catch (error) {
      setMessage("❌ Erro de conexão");
    } finally {
      setLoadingWatchLater(false);
    }
  };
  return (
    <div style={{
      minHeight: '400px',
      marginTop: '50px',
      padding: '20px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      backgroundImage: `url(${movie.thumbnailUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'sticky',
      top: '0',
      zIndex: 50
    }}>
      {/* Nome do filme */}
      <h1 className="text-5xl font-bold" style={{ margin: '10px' }}>
        {movie.title}
      </h1>

      {/* Ano */}
      <p className="text-lg" style={{ margin: '15px' }}>
        {movie.releaseYear}
      </p>

      {/* Sinopse */}
      <p className="text-sm" style={{ margin: '10px' }}>
        {movie.description}
      </p>

      {/* Botões */}
      <div className="flex flex-wrap gap-4 mt-4" style={{ margin: '10px' }}>
        <button className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-full hover:bg-gray-200 transition">
          <PlayIcon className="w-6 h-6" />
        </button>
        
        {/* Botão Assistir mais tarde */}
        <button 
          onClick={handleAddToWatchLater}
          disabled={loadingWatchLater}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
            loadingWatchLater 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {loadingWatchLater ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ClockIcon className="w-6 h-6" />
          )}
        </button>

        {/* Botão Favoritos */}
        <button 
          onClick={handleAddToFavorites}
          disabled={loadingFavorites}
          className={`flex items-center justify-center w-12 h-12 rounded-full transition ${
            loadingFavorites 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-gray-700 text-white hover:bg-gray-600'
          }`}
        >
          {loadingFavorites ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <StarIcon className="w-6 h-6" />
          )}
        </button>

        <button className="flex items-center justify-center w-12 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
          <ArrowDownTrayIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Mensagem de feedback */}
      {message && (
        <div className="mt-3 p-2 bg-gray-800 text-white rounded text-sm">
          {message}
        </div>
      )}
    </div>
  );
}