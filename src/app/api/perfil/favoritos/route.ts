import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    // Pegar profileId DA URL
    const url = new URL(req.url);
    const profileId = url.searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json({ message: "Nenhum profileId enviado" }, { status: 400 });
    }

    if (!ObjectId.isValid(profileId)) {
      return NextResponse.json({ message: "profileId inválido" }, { status: 400 });
    }

    const db = await getDatabase();
    const favoritesCollection = db.collection("favorites");
    const moviesCollection = db.collection("Movies");
    const seriesCollection = db.collection("Series");

    // Buscar todos os favoritos do perfil
    const favoritos = await favoritesCollection
      .find({ 
        profileId: new ObjectId(profileId) 
      })
      .toArray();

    if (favoritos.length === 0) {
      return NextResponse.json({ 
        success: true, 
        favoritos: [],
        totalFavoritos: 0,
        totalFilmes: 0,
        totalSeries: 0
      });
    }

    // CONTAGEM por tipo
    const totalFilmes = favoritos.filter(f => f.contentType === 'movie').length;
    const totalSeries = favoritos.filter(f => f.contentType === 'series').length;
    const totalFavoritos = favoritos.length;

    // Separar filmes e séries
    const movieIds = favoritos
      .filter(f => f.contentType === 'movie')
      .map(f => new ObjectId(f.contentId));

    const seriesIds = favoritos
      .filter(f => f.contentType === 'series')
      .map(f => new ObjectId(f.contentId));

    // Buscar detalhes dos filmes e séries
    const [filmes, series] = await Promise.all([
      movieIds.length > 0 ? moviesCollection
        .find({ _id: { $in: movieIds } })
        .project({ 
          _id: 1, 
          title: 1, 
          thumbnailUrl: 1, 
          releaseYear: 1,
          isNewRelease: 1 
        })
        .toArray() : [],
      
      seriesIds.length > 0 ? seriesCollection
        .find({ _id: { $in: seriesIds } })
        .project({ 
          _id: 1, 
          title: 1, 
          thumbnailUrl: 1, 
          releaseYear: 1,
          isNewRelease: 1 
        })
        .toArray() : []
    ]);

    // Combinar resultados
    const resultados = [
      ...filmes.map(filme => ({
        ...filme,
        tipo: 'movie',
        favoritoId: favoritos.find(f => 
          f.contentId.toString() === filme._id.toString() && 
          f.contentType === 'movie'
        )?._id
      })),
      ...series.map(serie => ({
        ...serie,
        tipo: 'series',
        favoritoId: favoritos.find(f => 
          f.contentId.toString() === serie._id.toString() && 
          f.contentType === 'series'
        )?._id
      }))
    ];

    return NextResponse.json({ 
      success: true, 
      favoritos: resultados,
      totalFavoritos,
      totalFilmes,
      totalSeries
    });

  } catch (error) {
    console.error("GET /api/perfil/favoritos error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erro interno" 
    }, { status: 500 });
  }
}