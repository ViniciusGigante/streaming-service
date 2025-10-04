'use client'

import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Banner, { Movie } from "./components/banner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Series {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
}

interface MoviesByCategory {
  [category: string]: Movie[];
}

interface SeriesByCategory {
  Anime: Series[];
  Desenho: Series[];
  Outras: Series[];
}

export default function HomePage() {
  const [moviesByCategory, setMoviesByCategory] = useState<MoviesByCategory>({});
  const [seriesByCategory, setSeriesByCategory] = useState<SeriesByCategory>({
    Anime: [],
    Desenho: [],
    Outras: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | Series | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const router = useRouter();

  const handleExpandCategory = (category: string, type: 'movie' | 'series') => {
    const encodedCategory = encodeURIComponent(category);
    router.push(`/Home/categoria/${encodedCategory}?type=${type}`);
  }

  const handleCloseBanner = () => {
    setSelectedMovie(null);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const resMovies = await fetch("/api/filmes", { credentials: "include" });
        const dataMovies = await resMovies.json();
        if (dataMovies.success) {
          setMoviesByCategory(dataMovies.data);
        } else {
          console.error("Erro ao buscar filmes:", dataMovies.message);
        }

        const resSeries = await fetch("/api/series", { credentials: "include" });
        const dataSeries = await resSeries.json();
        if (dataSeries.success) {
          setSeriesByCategory(dataSeries.data);
        } else {
          console.error("Erro ao buscar séries:", dataSeries.message);
        }

      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <p className="text-white p-4">Loading...</p>;
  }

  return (
    <main className="w-full min-h-screen bg-[#b8b8b8]">
      <Sidebar />
      <section
        className="min-h-screen relative flex-1 bg-[#1E1E1E] text-white md:ml-20 md:pt-0"
        style={{
          padding: "20px",
          backgroundImage: "url('/background-home.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Header />
        <Banner
          movie={selectedMovie}
          onClose={() => handleCloseBanner()}
        />

        {/* Filmes */}
        <div className="scroll-default py-8 px-4 space-y-12 mt-10">
          {Object.entries(moviesByCategory).map(([category, movies]: [string, Movie[]]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold">{category}</h2>
                <button
                  onClick={() => handleExpandCategory(category, 'movie')}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Expandir
                </button>
              </div>

              <div className="flex overflow-x-auto gap-4 pb-2">
                {movies.map((movie: Movie) => (
                  <div
                    key={movie._id}
                    className="min-w-[180px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedMovie(movie)}
                  >
                    <Image
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="w-full h-60 object-cover"
                      width={200}
                      height={300}
                    />
                    <div
                      className="p-3"
                      style={{
                        background: "linear-gradient(to top, #0b1a3f, rgba(11,26,63,0))"
                      }}
                    >
                      <h3 className="font-semibold text-sm truncate text-white">{movie.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Séries */}
          {Object.entries(seriesByCategory).map(([category, seriesList]: [string, Series[]]) => (
            <div key={category}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-bold">{category}</h2>
                <button
                  onClick={() => handleExpandCategory(category, 'series')}
                  className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors"
                >
                  Expandir
                </button>
              </div>

              <div className="scroll-default flex overflow-x-auto gap-4 pb-2">
                {seriesList.map((series: Series) => (
                  <div
                    key={series._id}
                    className="min-w-[180px] flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedMovie(series)}
                  >
                    <Image
                      src={series.thumbnailUrl}
                      alt={series.title}
                      className="w-full h-60 object-cover"
                      width={200}
                      height={300}
                    />
                    <div
                      className="p-3"
                      style={{
                        background: "linear-gradient(to top, #0b1a3f, rgba(11,26,63,0))"
                      }}
                    >
                      <h3 className="font-semibold text-sm truncate text-white">{series.title}</h3>
                      {series.isNewRelease && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                          Novo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>
    </main>
  );
}
