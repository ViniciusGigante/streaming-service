import Image from "next/image";


import React from "react";

export default function Home() {
  return (
    <div>
     
     <section
  id="inicio"
  className="h-screen flex flex-col justify-center items-center text-center text-white px-4
  
  "
  style={{
    backgroundImage: "url('/bg-landing.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>

<div className="absolute bottom-0 left-0 w-full h-[180%] bg-gradient-to-t from-[#090a0c] via-black/10 to-transparent z-10" />




  <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-black/70 to-transparent flex justify-center md:justify-start px-4">
    <Image
      src="/cineverse-logo.svg"
      width={300}
      height={110}
      alt="Cineverse Logo"
    />
  </div>


  <h1 className="text-2xl sm:text-3xl md:text-4xl m mb-5 font-bold z-20">Descubra um Universo de Entretenimento</h1>
  <p className="text-2x1 sm:text1x1 md:text-xl max-w-xl">
    O Cineverse traz para você milhares de filmes, séries e documentários em uma plataforma intuitiva e personalizada. Assista onde e quando quiser, com qualidade excepcional e conteúdo exclusivo.
  </p>
  <div className="flex space-x-4 z-20">
    <button
      className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 z-20"
    >
      Entrar
    </button>    
    <button
      className="mt-6 ml-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 z-20"
    >
      Saiba Mais
    </button>
  </div>
</section>

 
  
      <section
        id="sobre"
        className="min-h-screen flex flex-col justify-center items-center text-center bg-[#090a0c] text-gray-800 px-4 py-20"
      >
        <h2 className="text-3xl md:text-4xl mb-5 font-bold">Título da Segunda Seção</h2>
        <p className="max-w-2xl leading-relaxed text-lg">
          Texto de descrição da segunda seção da landing page.
        </p>
      </section>
    </div>
  );
}

