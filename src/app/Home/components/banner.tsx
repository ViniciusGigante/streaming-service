import Header from './header';
import { PlayIcon, ClockIcon, StarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function Banner() {
  return (
    <section className="h-[600px] min-h-[40vh] relative w-full bg-[#1E1E1E] text-white flex flex-col justify-center m-10"
    style={{padding: '20px'}}
    >
  {/* Header */}
  <Header />

  {/* Container do conteúdo do filme */}
  <div className="w-full max-w-5xl mx-auto px-8 py-8 flex flex-col gap-4">
    {/* Nome do filme */}
    <h1 className="text-5xl font-bold mb-2">The Batman</h1>

    {/* Ano */}
    <p className="text-lg">2022</p>

    {/* Sinopse */}
    <p className="text-sm">
      Em Gotham City, o vigilante Batman enfrenta criminosos e luta contra a corrupção, enquanto investiga um misterioso serial killer que ameaça a cidade.
    </p>

    {/* Botões */}
    <div className="flex flex-wrap gap-4 mt-4">
      <button className="flex items-center justify-center w-12 h-12 bg-white text-black rounded-full hover:bg-gray-200 transition">
        <PlayIcon className="w-6 h-6" />
      </button>
      <button className="flex items-center justify-center w-12 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
        <ClockIcon className="w-6 h-6" />
      </button>
      <button className="flex items-center justify-center w-12 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
        <StarIcon className="w-6 h-6" />
      </button>
      <button className="flex items-center justify-center w-12 h-12 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
        <ArrowDownTrayIcon className="w-6 h-6" />
      </button>
    </div>
  </div>
</section>

  );
}
