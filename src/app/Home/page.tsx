'use client'

import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Banner from "./components/banner";
import CardMovie from "./components/cardFilme";


export default function HomePage() {
  // Mock de lançamentos em destaque
  const featuredMovies = Array.from({ length: 5 }).map((_, i) => ({
    title: `Inédito ${i + 1}`,
    year: 2023,
    duration: 120,
  }));

  // Outras categorias
  const categories = [
    { name: "Filmes", count: 10 },
    { name: "Séries", count: 8 },
    { name: "Animes", count: 6 },
  ];

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
        <Banner />

        {/* Fila de destaques */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Destaques</h2>
          <div className="flex overflow-x-auto gap-6 pb-2">
            {featuredMovies.map((movie, index) => (
              <div
                key={index}
                className="min-w-[250px] flex-shrink-0 bg-[#2A2A2A] rounded-lg overflow-hidden"
              >
                <div className="h-40 bg-gray-700"></div> {/* Poster fictício */}
                <div className="p-3">
                  <h3 className="text-base font-semibold truncate">{movie.title}</h3>
                  <p className="text-sm text-gray-400">Ano: {movie.year}</p>
                  <p className="text-sm text-gray-400">Duração: {movie.duration} min</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outras categorias */}
        <div className="py-8 px-4 space-y-12">
          {categories.map((category, catIndex) => (
            <div key={catIndex}>
              <h2 className="text-xl md:text-2xl font-bold mb-4">{category.name}</h2>
              <div className="flex overflow-x-auto gap-4 pb-2">
                {Array.from({ length: category.count }).map((_, index) => (
                  <div
                    key={index}
                    className="min-w-[180px] flex-shrink-0 bg-[#2A2A2A] rounded-lg overflow-hidden"
                  >
                    <div className="h-28 bg-gray-700"></div> {/* Poster fictício */}
                    <div className="p-2">
                      <h3 className="text-sm font-semibold truncate">Título {index + 1}</h3>
                      <p className="text-xs text-gray-400">Ano: 2023</p>
                      <p className="text-xs text-gray-400">Duração: 120 min</p>
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
