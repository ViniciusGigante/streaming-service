// hooks/useMovieCache.ts
import { useState, useEffect } from 'react';
import { Movie } from '@/types/movie';
import { moviePosterCache } from '@/lib/movieCachePoster'; // ✅ IMPORTA O CACHE AQUI!

// Interface para a resposta da API
interface MoviesApiResponse {
  success: boolean;
  data: {
    [category: string]: Movie[];
  };
  message?: string;
}

export function useMovieCache() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. 🌐 Faz fetch dos dados JSON da API
        const response = await fetch('/api/filmes', { credentials: 'include' });
        const apiData: MoviesApiResponse = await response.json();
        
        if (apiData.success) {
          // 2. 📦 EXTRAI TODOS OS FILMES de todas as categorias
          const allMovies: Movie[] = [];
          Object.values(apiData.data).forEach((categoryMovies: Movie[]) => {
            allMovies.push(...categoryMovies);
          });
          
          // 3. 🖼️ Cacheia as imagens na RAM
          const moviesComCache = await moviePosterCache.cacheAllMoviePosters(allMovies); // ✅ USA A INSTÂNCIA IMPORTADA
          setMovies(moviesComCache);
        } else {
          console.error('Erro na API:', apiData.message);
        }
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { movies, loading };
}