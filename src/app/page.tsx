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
  {/* Header com logo */}
  <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between px-6">
    <Image 
      src="/cineverse-logo.svg" 
      width={215} 
      height={95} 
      alt="Cineverse Logo" 
    />
  </div>

  {/* Texto principal */}
  <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold z-10 drop-shadow-lg leading-tight">
    🎬 Descubra um Universo de Entretenimento
  </h1>
  <p className="text-[1rem] md:text-[1.25rem] lg:text-[1.5rem] max-w-2xl mt-4 z-10 text-gray-200 drop-shadow-md">
    Assista onde e quando quiser, com qualidade excepcional e conteúdo exclusivo.
  </p>

  {/* Recursos / Destaques */}
  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 mt-8 z-10 text-left max-w-4xl">
    <div className="flex items-start space-x-3">
      <span className="text-[1.5rem] md:text-[2rem]">📺</span>
      <p className="text-gray-200 text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]">
        Streaming ilimitado de filmes e séries em alta qualidade.
      </p>
    </div>
    <div className="flex items-start space-x-3">
      <span className="text-[1.5rem] md:text-[2rem]">🎯</span>
      <p className="text-gray-200 text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]">
        Recomendações personalizadas com base nos seus gostos.
      </p>
    </div>
    <div className="flex items-start space-x-3">
      <span className="text-[1.5rem] md:text-[2rem]">💾</span>
      <p className="text-gray-200 text-[0.9rem] md:text-[1rem] lg:text-[1.1rem]">
        Salve seus favoritos e continue de onde parou.
      </p>
    </div>
  </div>

  {/* Call-to-action principal */}
  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mt-8 z-10">
    <button className="bg-[#3B0764] hover:bg-[#4B0C8C]
     px-6 md:px-8 py-2 md:py-3 rounded-lg
      font-bold text-lg md:text-xl transition shadow-lg
      cursor-pointer
      "
      onClick={() => router.push('/auth/register')}
      >
      Comece Agora
    </button>
    <button className="bg-[#0F172A] hover:bg-[#1E293B] 
    px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold text-lg md:text-xl transition shadow-lg
     cursor-pointer
    "
      onClick={handleLogin}
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
    <h2 className="text-3xl font-bold mb-6 mx-10 md:mx-20 text-white">Lançamentos Imperdíveis</h2>
    <div 
      className="flex space-x-3 overflow-x-auto scroll-custom mx-10 md:mx-20 snap-x scroll-smooth"
      style={{ height: '220px' }} // altura fixa igual aos cards para evitar scroll vertical
    >
      {filmes.map(movie => (
        <div 
          key={movie._id} 
          className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] h-full relative flex-shrink-0 snap-start rounded-lg overflow-hidden shadow-lg group cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${movie.thumbnailUrl})` }}
          ></div>

          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
            {movie.releaseYear}
          </div>

          {movie.isNewRelease && (
            <span className="absolute top-2 left-2 bg-red-600 px-1 py-0.5 text-[8px] sm:text-[10px] rounded-full font-bold shadow-sm">
              INÉDITO
            </span>
          )}
        </div>
      ))}
    </div>
  </div>

  {/* Séries */}
  <div>
    <h2 className="text-3xl font-bold mb-6 mx-10 md:mx-20 text-white">Séries em Alta</h2>
    <div 
      className="flex space-x-3 overflow-x-auto scroll-custom mx-10 md:mx-20 snap-x scroll-smooth"
      style={{ height: '220px' }} // mesma altura dos cards
    >
      {series.map(serie => (
        <div 
          key={serie._id} 
          className="min-w-[140px] sm:min-w-[160px] md:min-w-[180px] h-full relative flex-shrink-0 snap-start rounded-lg overflow-hidden shadow-lg group cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: `url(${serie.thumbnailUrl})` }}
          ></div>

          <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">
            {serie.releaseYear}
          </div>

          {serie.isNewRelease && (
            <span className="absolute top-2 left-2 bg-red-600 px-1 py-0.5 text-[8px] sm:text-[10px] rounded-full font-bold shadow-sm">
              INÉDITO
            </span>
          )}
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
