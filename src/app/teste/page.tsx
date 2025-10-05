// components/TestPosters.tsx
'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { useMovieCache } from "@/hooks/usePosterCache";
interface Series {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
}

// Interface para a resposta da API de séries
interface SeriesApiResponse {
  success: boolean;
  data: {
    [category: string]: Series[];
  };
}

export default function TestPosters() {
  const { movies, loading } = useMovieCache();
  const [series, setSeries] = useState<Series[]>([]);
  const [seriesLoading, setSeriesLoading] = useState(true);

  useEffect(() => {
    const fetchSeries = async () => {
      try {
        const res = await fetch("/api/series", { credentials: "include" });
        const data: SeriesApiResponse = await res.json();
        
        if (data.success) {
          // Pega todas as séries de todas as categorias
          const allSeries: Series[] = [];
          Object.values(data.data).forEach((categorySeries: Series[]) => {
            allSeries.push(...categorySeries);
          });
          setSeries(allSeries);
        }
      } catch (err) {
        console.error("Erro ao buscar séries:", err);
      } finally {
        setSeriesLoading(false);
      }
    };

    fetchSeries();
  }, []);

  if (loading || seriesLoading) {
    return (
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white text-xl">Carregando posters...</p>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-white text-center mb-8">
        🧪 TESTE VISUAL - POSTERS
      </h1>

      {/* Status do Cache */}
      <div className="bg-blue-900 text-white p-4 rounded-lg mb-8">
        <h2 className="text-lg font-bold mb-2">Status do Cache:</h2>
        <pre>{JSON.stringify(window.moviePosterCache?.getStatus(), null, 2)}</pre>
      </div>

      {/* Filmes */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Filmes ({movies.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie: Movie) => (
            <div
              key={movie._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={movie.thumbnailUrl}
                alt={movie.title}
                width={200}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-white text-sm truncate">
                  {movie.title}
                </h3>
                <p className="text-gray-400 text-xs">{movie.releaseYear}</p>
                <p className="text-green-400 text-xs mt-1">
                  {movie.isNewRelease ? "⭐ NOVO" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Séries */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Séries ({series.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {series.map((serie: Series) => (
            <div
              key={serie._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={serie.thumbnailUrl}
                alt={serie.title}
                width={200}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-3">
                <h3 className="font-semibold text-white text-sm truncate">
                  {serie.title}
                </h3>
                <p className="text-gray-400 text-xs">{serie.releaseYear}</p>
                <p className="text-green-400 text-xs mt-1">
                  {serie.isNewRelease ? "⭐ NOVO" : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Botão para testar cache */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <button 
          onClick={() => window.moviePosterCache?.killCache()}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          🗑️ Limpar Cache
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          🔄 Recarregar
        </button>
      </div>
    </main>
  );
}