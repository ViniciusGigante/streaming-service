'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import EditarPerfilModal from "./components/updatePerfil";
import Banner from './components/banner';


interface ProfileData {
  _id: string;
  name: string;
  avatarColor: string;
  createdAt: string;
  email: string;
}
interface Movie {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl?: string; 
  isNewRelease: boolean;
  isSeries?: boolean;
}

interface FavoriteItem {
  _id: string;
  title: string;
  thumbnailUrl: string;
  releaseYear: number;
  isNewRelease: boolean;
  tipo: string;
  favoritoId: string;
}

interface WatchLaterItem {
  _id: string;
  title: string;
  thumbnailUrl: string;
  releaseYear: number;
  isNewRelease: boolean;
  description: string;
  tipo: string;
  watchLaterId: string;
  addedAt: string;
  note?: string;
  watched: boolean;
}

export default function Perfil() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [watchLater, setWatchLater] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


async function fetchProfileData() {
  try {
    const storedProfile = localStorage.getItem("activeProfile");
    if (!storedProfile) {
      console.error("Nenhum perfil ativo encontrado.");
      setLoading(false);
      return;
    }

    const profileObj = JSON.parse(storedProfile);
    const profileId = profileObj._id;

  
    const profileRes = await fetch(`/api/perfil/me?profileId=${profileId}`, { 
      credentials: "include" 
    });
    
    if (profileRes.ok) {
      const profileData = await profileRes.json();
      setProfile(profileData);
    }


    const favoritesRes = await fetch(`/api/perfil/favoritos?profileId=${profileId}`, {
      credentials: "include"
    });
    
    if (favoritesRes.ok) {
      const favoritesData = await favoritesRes.json();
      if (favoritesData.success) {
        setFavorites(favoritesData.favoritos || []);
      }
    }


    const watchLaterRes = await fetch(`/api/perfil/watchLater?profileId=${profileId}`, {
      credentials: "include"
    });
    
    if (watchLaterRes.ok) {
      const watchLaterData = await watchLaterRes.json();
      if (watchLaterData.success) {
        setWatchLater(watchLaterData.watchLater || []);
      }
    }

  } catch (err) {
    console.error("Erro ao buscar dados:", err);
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  fetchProfileData();
}, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">
        <p>Carregando perfil...</p>
      </div>
    );
  }

  return (
    <>
    {console.log("SelectedMovie atual:", selectedMovie)}
{selectedMovie && (
  <Banner
    movie={selectedMovie}
    onClose={() => setSelectedMovie(null)} 
  />
)}
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Banner de capa */}
      <div className="w-full h-48 bg-gradient-to-r from-gray-800 to-gray-700"></div>

      <div className="p-6 -mt-16">
        {/* Header Perfil */}
        <div className="flex items-center gap-6 mb-10">
          <div
            className="w-32 h-32 rounded-full border-4 border-[#0f0f0f]"
            style={{ backgroundColor: profile?.avatarColor || "#777" }}
          ></div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold ">
              {profile?.name || "Carregando..."}
            </h1>
            <p className="text-gray-400">{profile?.email || "Carregando email..."}</p>

            <button
  onClick={() => setIsEditModalOpen(true)}
  className="mt-3 px-4 py-2 bg-blue-600 rounded-xl hover:bg-blue-700 text-sm"
>
  Editar Perfil
</button>

          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">120</p>
            <p className="text-gray-400 text-sm">Filmes assistidos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">8</p>
            <p className="text-gray-400 text-sm">Listas criadas</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{favorites.length}</p>
            <p className="text-gray-400 text-sm">Favoritos</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold">{profile?.createdAt?.split("T")[0]}</p>
            <p className="text-gray-400 text-sm">Perfil criado em</p>
          </div>
        </div>

        {/* Listas Reais */}
        <div className="space-y-10">
          {/* Watch Later */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Assistir mais tarde ({watchLater.length})</h2>
            {watchLater.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {watchLater.map((item) => (
  <div
    key={item.watchLaterId}
    className="bg-[#2A2A2A] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
    onClick={() => {
  console.log("Filme clicado:", item.title); // <-- verifica se está clicando
  setSelectedMovie({
    _id: item._id,
    title: item.title,
    description: item.description || "",
    releaseYear: item.releaseYear,
    thumbnailUrl: item.thumbnailUrl,
    videoUrl: "",
    isNewRelease: item.isNewRelease,
    isSeries: item.tipo === "series"
  });
}}

  >
    <Image
      src={item.thumbnailUrl}
      alt={item.title}
      width={200}
      height={300}
      className="w-full h-48 object-cover"
    />
    <div className="p-3">
      <h3 className="font-semibold text-sm truncate">{item.title}</h3>
      <p className="text-xs text-gray-400 mt-1">Ano: {item.releaseYear}</p>
      {item.isNewRelease && (
        <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
          Novo
        </span>
      )}
    </div>
  </div>
))}

              </div>
            ) : (
              <p className="text-gray-400">Nenhum item para assistir mais tarde.</p>
            )}
          </section>

          {/* Favoritos */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Favoritos ({favorites.length})</h2>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {favorites.map((item) => (
                  <div
                    key={item.favoritoId}
                    className="bg-[#2A2A2A] rounded-lg overflow-hidden hover:scale-105 transition-transform cursor-pointer"
                    onClick={() => {
  console.log("Filme favorito clicado:", item.title);
  setSelectedMovie({
    _id: item._id,
    title: item.title,
    description: "", 
    releaseYear: item.releaseYear,
    thumbnailUrl: item.thumbnailUrl,
    videoUrl: "",
    isNewRelease: item.isNewRelease,
    isSeries: item.tipo === "series"
  });
}}

                  >
                    <Image
                      src={item.thumbnailUrl}
                      alt={item.title}
                      width={200}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">Ano: {item.releaseYear}</p>
                      {item.isNewRelease && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                          Novo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Nenhum item favoritado.</p>
            )}
          </section>

          {/* Atividade recente (mock) */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Atividade recente</h2>
            <div className="space-y-3">
              <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-300">
                Você adicionou <span className="font-semibold">Filme X</span> aos favoritos.
              </div>
              <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-300">
                Você assistiu 70% de <span className="font-semibold">Filme Y</span>.
              </div>
              <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-300">
                Você criou a lista <span className="font-semibold">Assistir em família</span>.
              </div>
            </div>
          </section>
        </div>
      </div>
      
    </div>
    

    {profile && (
  <EditarPerfilModal
    isOpen={isEditModalOpen}
    onClose={() => setIsEditModalOpen(false)}
    onProfileUpdated={fetchProfileData}
    profileId={profile._id}
    currentName={profile.name}
  />
)}

    </>
  );
}