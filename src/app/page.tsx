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
          backgroundImage: "url('/background/pexels-audio-visual-art-10697887.jpg')",
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
        </div>

        {/* Gradient Shadow na parte inferior */}
        <div className="absolute bottom-0 left-0 w-full h-[110%] bg-gradient-to-t from-black/100 via-black/60 to-transparent z-0" />
      </section>

      {/* Catálogo: Filmes + Séries */}
      <section className="py-16 px-4 flex flex-col space-y-12">
        {/* Filmes */}
        <div>
          <h2 className="text-3xl font-bold mb-6 mx-10 md:mx-20">Lançamentos Imperdíveis</h2>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide mx-10 md:mx-20">
            {filmes.map(movie => (
              <div 
                key={movie._id} 
                className="min-w-[120px] sm:min-w-[160px] md:min-w-[200px] relative group transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Image
                  src={movie.thumbnailUrl}
                  alt={movie.title}
                  width={200}
                  height={300}
                  className="rounded-lg w-full h-auto"
                />
                {movie.isNewRelease && (
                  <span className="absolute top-2 left-2 bg-red-600 px-2 py-1 text-[10px] sm:text-xs rounded font-bold">
                    INÉDITO
                  </span>
                )}
                <div className="mt-2">
                  <h3 className="font-semibold text-sm sm:text-base">{movie.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300">{movie.releaseYear}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Séries */}
        <div>
          <h2 className="text-3xl font-bold mb-6 mx-10 md:mx-20">Séries em Alta</h2>
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide mx-10 md:mx-20">
            {series.map(serie => (
              <div 
                key={serie._id} 
                className="min-w-[120px] sm:min-w-[160px] md:min-w-[200px] relative group transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
              >
                <Image
                  src={serie.thumbnailUrl}
                  alt={serie.title}
                  width={200}
                  height={300}
                  className="rounded-lg w-full h-auto"
                />
                {serie.isNewRelease && (
                  <span className="absolute top-2 left-2 bg-red-600 px-2 py-1 text-[10px] sm:text-xs rounded font-bold">
                    INÉDITO
                  </span>
                )}
                <div className="mt-2">
                  <h3 className="font-semibold text-sm sm:text-base">{serie.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300">{serie.releaseYear}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black text-center">
        <h2 className="text-3xl font-bold mb-12">Por que escolher o Cineverse?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">+1000 Filmes</h3>
            <p className="text-gray-400 text-sm">Um catálogo sempre atualizado para você não ficar sem opções.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Acesse no Celular</h3>
            <p className="text-gray-400 text-sm">Compatível com smartphones, tablets e Smart TVs.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Sem Anúncios</h3>
            <p className="text-gray-400 text-sm">Assista seus conteúdos sem interrupções chatas.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <h3 className="text-xl font-semibold mb-2">Qualidade HD/4K</h3>
            <p className="text-gray-400 text-sm">Experiência de cinema direto na sua tela.</p>
          </div>
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
