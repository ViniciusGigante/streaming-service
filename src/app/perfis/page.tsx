import Image from "next/image";

export default function SelecaoPerfilPage() {
  return (
    <div className="min-h-screen bg-[#1E1E1E] flex flex-col px-4">
      <div className="mt-4 mx-aut self-start">
        <Image
          src="/cineverse-logo-dark.svg"
          width={300}
          height={110}
          alt="Cineverse Logo"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-6">Quem está assistindo?</h1>
        
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          <div className="group cursor-pointer">
            <div className="w-32 h-32 bg-red-600 rounded-md group-hover:border-2 group-hover:border-white transition-all mb-3"></div>
            <p className="text-gray-400 group-hover:text-white transition-colors">João</p>
          </div>

          <div className="group cursor-pointer">
            <div className="w-32 h-32 bg-blue-600 rounded-md group-hover:border-2 group-hover:border-white transition-all mb-3"></div>
            <p className="text-gray-400 group-hover:text-white transition-colors">Maria</p>
          </div>

          <div className="group cursor-pointer">
            <div className="w-32 h-32 bg-green-600 rounded-md group-hover:border-2 group-hover:border-white transition-all mb-3"></div>
            <p className="text-gray-400 group-hover:text-white transition-colors">Pedro</p>
          </div>

          <div className="group cursor-pointer">
            <div className="w-32 h-32 bg-gray-800 rounded-md flex items-center justify-center group-hover:bg-gray-700 transition-all mb-3">
              <div className="text-4xl text-gray-400 group-hover:text-white">+</div>
            </div>
            <p className="text-gray-400 group-hover:text-white transition-colors">Adicionar</p>
          </div>
        </div>
      </div>

      <button className="border border-gray-600 text-gray-400 px-8 py-2 hover:border-white hover:text-white transition-colors">
        GERENCIAR PERFIS
      </button>
    </div>
  );
}
