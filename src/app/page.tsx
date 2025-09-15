'use client'

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface MediaItem {
  _id: string;
  title: string;
  releaseYear: number;
  thumbnailUrl: string;
  isNewRelease: boolean;
}

export default function LandingPage() {
  const router = useRouter();
  const handleLogin = () => router.push("/auth/login");

  const [filmes, setFilmes] = useState<MediaItem[]>([]);
  const [series, setSeries] = useState<MediaItem[]>([]);

  useEffect(() => {
    fetch("/api/filmes/ineditos")
      .then(res => res.json())
      .then(data => {
        if (data.success) setFilmes(data.data);
      });

    fetch("/api/series/ineditos")
      .then(res => res.json())
      .then(data => {
        if (data.success) setSeries(data.data);
      });
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section
        className="relative h-screen flex flex-col justify-center items-center text-center px-4"
        style={{
          backgroundImage: "url('/bg-landing.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center px-4">
          <Image src="/cineverse-logo.svg" width={200} height={80} alt="Cineverse Logo" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold z-10">Descubra um Universo de Entretenimento</h1>
        <p className="text-lg md:text-xl max-w-2xl mt-4 z-10">
          Assista onde e quando quiser, com qualidade excepcional e conteúdo exclusivo.
        </p>

        <div className="flex space-x-4 mt-6 z-10">
          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
          >
            Entrar
          </button>
          <button className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition">
            Saiba Mais
          </button>
        </div>

        {/* Gradient Shadow na parte inferior */}
        <div className="absolute bottom-0 left-0 w-full h-[110%] bg-gradient-to-t from-black/100 via-black/60 to-transparent z-0" />
      </section>

      {/* Filmes Inéditos */}
      <section className="py-16 px-4">
        <h2 className="text-3xl font-bold mb-6">Lançamentos Imperdíveis</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {filmes.map(movie => (
            <div 
              key={movie._id} 
              className="min-w-[200px] relative group transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
            >
              <Image
                src={movie.thumbnailUrl}
                alt={movie.title}
                width={200}
                height={300}
                className="rounded-lg"
              />
              {movie.isNewRelease && (
                <span className="absolute top-2 left-2 bg-red-600 px-2 py-1 text-xs rounded font-bold">
                  INÉDITO
                </span>
              )}
              <div className="mt-2">
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-300">{movie.releaseYear}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Séries Inéditas */}
      <section className="py-16 px-4 bg-gray-900">
        <h2 className="text-3xl font-bold mb-6">Séries em Alta</h2>
        <div className="flex space-x-4 overflow-x-auto">
          {series.map(serie => (
            <div 
              key={serie._id} 
              className="min-w-[200px] relative group transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
            >
              <Image
                src={serie.thumbnailUrl}
                alt={serie.title}
                width={200}
                height={300}
                className="rounded-lg"
              />
              {serie.isNewRelease && (
                <span className="absolute top-2 left-2 bg-red-600 px-2 py-1 text-xs rounded font-bold">
                  INÉDITO
                </span>
              )}
              <div className="mt-2">
                <h3 className="font-semibold">{serie.title}</h3>
                <p className="text-sm text-gray-300">{serie.releaseYear}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-12 px-4 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Cineverse. Todos os direitos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#">Sobre</a>
            <a href="#">Ajuda</a>
            <a href="#">Termos</a>
            <a href="#">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
