import { PlayIcon, ClockIcon, StarIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

interface Movie {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
}

interface BannerProps {
  movie: Movie | null;
}

export default function Banner({ movie }: BannerProps) {
  if (!movie) {
    return null; 
  }

  return (
    <div
       style={{
    minHeight: '400px',
    marginTop: '50px',
    padding: '20px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundImage: `url(${movie.thumbnailUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'sticky',
    top: '0',
    zIndex: 50
  }}
    >
      {/* Nome do filme */}
      <h1 className="text-5xl font-bold" style={{ margin: '10px' }}>
        {movie.title}
      </h1>

      {/* Ano */}
      <p className="text-lg" style={{ margin: '15px' }}>
        {movie.releaseYear}
      </p>

      {/* Sinopse */}
      <p className="text-sm" style={{ margin: '10px' }}>
        {movie.description}
      </p>

      {/* Botões */}
      <div className="flex flex-wrap gap-4 mt-4" style={{ margin: '10px' }}>
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
  );
}
