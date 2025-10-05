// lib/moviePosterCacheSimplified.ts

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

class MoviePosterCacheSimplified {
  private imageCache: Map<string, string> = new Map();
  
  // 🎯 GAMBIARRA CONFIGURÁVEL - AGORA SEM READonly
  private TOTAL_SIZE_MB: number = 7;        // Tamanho total dos seus posters
  private LIMITE_SEGURO_MB: number = 30;    // Seu limite seguro de RAM
  private isCacheEnabled: boolean = true;

  constructor() {
    this.verificarLimiteSeguro();
    this.setupCleanupEvents();
  }

  /**
   * 🛡️ VERIFICA SE PODE USAR CACHE SEM CULPA NA CONSCIÊNCIA
   */
  private verificarLimiteSeguro(): void {
    if (this.TOTAL_SIZE_MB > this.LIMITE_SEGURO_MB) {
      this.isCacheEnabled = false;
      console.warn(`🚫 Cache DESATIVADO - Posters (${this.TOTAL_SIZE_MB}MB) ultrapassam limite (${this.LIMITE_SEGURO_MB}MB)`);
    } else {
      console.log(`✅ Cache ATIVADO - Posters: ${this.TOTAL_SIZE_MB}MB / Limite: ${this.LIMITE_SEGURO_MB}MB`);
    }
  }

  public async cachePosterImage(thumbnailUrl: string): Promise<string> {
    if (!this.isCacheEnabled || !thumbnailUrl) {
      return thumbnailUrl;
    }

    if (this.imageCache.has(thumbnailUrl)) {
      return this.imageCache.get(thumbnailUrl)!;
    }

    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      
      this.imageCache.set(thumbnailUrl, objectUrl);
      console.log(`💾 Cacheado: ${this.getFileName(thumbnailUrl)} (${this.imageCache.size} imagens)`);
      
      return objectUrl;

    } catch (error) {
      console.error('❌ Erro ao cachear:', error);
      return thumbnailUrl;
    }
  }

  public async cacheAllMoviePosters(moviesData: Movie[]): Promise<Movie[]> {
    if (!this.isCacheEnabled || !moviesData) return moviesData;

    console.log(`🚀 Cacheando ${moviesData.length} posters...`);

    const updatedMovies = await Promise.all(
      moviesData.map(async (movie): Promise<Movie> => {
        if (movie.thumbnailUrl) {
          const cachedUrl = await this.cachePosterImage(movie.thumbnailUrl);
          return { ...movie, thumbnailUrl: cachedUrl };
        }
        return movie;
      })
    );

    console.log(`✅ Cache concluído: ${this.imageCache.size} posters`);
    return updatedMovies;
  }

  public killCache(): void {
    for (const objectUrl of this.imageCache.values()) {
      URL.revokeObjectURL(objectUrl);
    }
    this.imageCache.clear();
    console.log('🗑️ Cache limpo!');
  }

  private setupCleanupEvents(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.killCache());
    }
  }

  private getFileName(url: string): string {
    return url.split('/').pop() || url;
  }

  /**
   * 📊 RETORNA STATUS DO CACHE + INFO DA GAMBIARRA
   */
  public getStatus() {
    return {
      cacheAtivo: this.isCacheEnabled,
      postersCacheados: this.imageCache.size,
      configuracao: `${this.TOTAL_SIZE_MB}MB / ${this.LIMITE_SEGURO_MB}MB`,
      situacao: this.TOTAL_SIZE_MB > this.LIMITE_SEGURO_MB ? '❌ ACIMA DO LIMITE' : '✅ DENTRO DO LIMITE'
    };
  }

  /**
   * 🔧 MÉTODO PARA ATUALIZAR OS VALORES DA GAMBIARRA
   */
  public atualizarConfiguracao(novoTotalMB: number, novoLimiteMB: number): void {
    this.TOTAL_SIZE_MB = novoTotalMB;
    this.LIMITE_SEGURO_MB = novoLimiteMB;
    this.verificarLimiteSeguro(); // Re-verifica com novos valores
  }
}

export const moviePosterCache = new MoviePosterCacheSimplified();