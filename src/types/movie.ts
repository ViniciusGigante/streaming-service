// src/types/movie.ts
export interface Movie {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
  isSeries?: boolean;
}

// Se quiser, pode adicionar outras interfaces relacionadas:
export interface MovieResponse {
  movies: Movie[];
  total: number;
  page: number;
}

export interface MovieFilters {
  search?: string;
  year?: number;
  isNewRelease?: boolean;
  isSeries?: boolean;
}