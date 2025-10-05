// hooks/usePosterCache.ts
'use client';
import { useState, useEffect } from 'react';
import { Movie } from '../types/movie';
import { moviePosterCache } from '../lib/movieCachePoster';

/**
 * 🖼️ Hook para cachear posters de filmes na RAM
 * @param moviesData - Array de filmes (você controla a busca)
 * @returns Array de filmes com thumbnailUrl cacheadas na RAM
 */
export function usePosterCache(moviesData: Movie[] | undefined) {
  const [moviesWithCachedPosters, setMoviesWithCachedPosters] = useState<Movie[]>([]);

  useEffect(() => {
    const cachePosters = async () => {
      if (!moviesData) return;
      
      // 🎯 Apenas cacheia os posters - o cache inteligente já verifica se precisa buscar
      const cachedMovies = await moviePosterCache.cacheAllMoviePosters(moviesData);
      setMoviesWithCachedPosters(cachedMovies);
    };

    cachePosters();
  }, [moviesData]);

  return moviesWithCachedPosters;
}