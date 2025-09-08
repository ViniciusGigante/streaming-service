'use client'

import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Banner from "./components/banner";

interface Movie {
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

export default function HomePage() {
  const [moviesByCategory, setMoviesByCategory] = useState<MoviesByCategory>({});
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null); 

  useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("/api/filmes", { credentials: "include" });
        const data = await res.json();
        if (data.success) {
          setMoviesByCategory(data.data);
        } else {
          console.error("Erro ao buscar filmes:", data.message);
        }
      } catch (err) {
        console.error("Erro ao buscar filmes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
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
        <Banner movie={selectedMovie}/>

        <div className="py-8 px-4 space-y-12">
          {Object.entries(moviesByCategory).map(([category, movies]) => (
            <div key={category}>
              <h2 className="text-xl md:text-2xl font-bold mb-4">{category}</h2>
              <div className="flex overflow-x-auto gap-4 pb-2">
                {movies.map((movie) => (
                  <div
                    key={movie._id}
                    className="min-w-[180px] flex-shrink-0 bg-[#2A2A2A] rounded-lg overflow-hidden"
                    onClick={() => setSelectedMovie(movie)}
                 >
                    <img
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      className="h-28 w-full object-cover"
                    />
                    <div className="p-2">
                      <h3 className="text-sm font-semibold truncate">{movie.title}</h3>
                      <p className="text-xs text-gray-400">Ano: {movie.releaseYear}</p>
                      {movie.isNewRelease && (
                        <p className="text-xs text-green-400 font-bold">Novo</p>
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
