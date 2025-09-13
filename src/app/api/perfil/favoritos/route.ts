import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
  profileId?: string;
}

export async function GET(req: NextRequest) {
  try {

    const token = req.cookies.get("token")?.value;
        if (!token) {
          return NextResponse.json({ message: "Token não encontrado" }, { status: 401 });
        }
    
        const secret = process.env.JWT_SECRET!;
        let payload: SessionPayload;
        try {
          payload = jwt.verify(token, secret) as SessionPayload;
        } catch {
          return NextResponse.json({ message: "Token inválido" }, { status: 401 });
        }
    
        if (!payload.userId || !payload.email) {
          return NextResponse.json({ message: "Token inválido" }, { status: 401 });
        }

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

// POST - Adicionar filme/série aos favoritos
export async function POST(req: NextRequest) {
  try {
    // Validação do token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token não encontrado" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET!;
    let payload: SessionPayload;
    try {
      payload = jwt.verify(token, secret) as SessionPayload;
    } catch {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    if (!payload.userId || !payload.email) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // Extrair dados do corpo da requisição
    const { profileId, contentId, contentType, category } = await req.json();

    // Validações dos dados obrigatórios
    if (!profileId || !contentId || !contentType) {
      return NextResponse.json(
        { message: "Dados incompletos. Forneça profileId, contentId e contentType" },
        { status: 400 }
      );
    }

    // Validação dos ObjectIds
    if (!ObjectId.isValid(profileId) || !ObjectId.isValid(contentId)) {
      return NextResponse.json(
        { message: "IDs inválidos" },
        { status: 400 }
      );
    }

    // Validação do contentType
    if (contentType !== 'movie' && contentType !== 'series') {
      return NextResponse.json(
        { message: "Tipo de conteúdo inválido. Use 'movie' ou 'series'" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const favoritesCollection = db.collection("favorites");

    // Verificar se o perfil pertence ao usuário autenticado
    const profilesCollection = db.collection("profiles");
    const profile = await profilesCollection.findOne({
      _id: new ObjectId(profileId),
      accountEmail: payload.email
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Perfil não encontrado ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Verificar se o conteúdo existe na coleção apropriada
    const contentCollection = contentType === 'movie' 
      ? db.collection("Movies") 
      : db.collection("Series");

    const contentExists = await contentCollection.findOne({
      _id: new ObjectId(contentId)
    });

    if (!contentExists) {
      return NextResponse.json(
        { message: "Conteúdo não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já está nos favoritos
    const existingFavorite = await favoritesCollection.findOne({
      profileId: new ObjectId(profileId),
      contentId: new ObjectId(contentId),
      contentType
    });

    if (existingFavorite) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Conteúdo já está nos favoritos",
          favoriteId: existingFavorite._id
        },
        { status: 409 }
      );
    }

    // Encontrar a ordem máxima atual para definir a próxima
    const maxOrderFavorite = await favoritesCollection
      .find({ profileId: new ObjectId(profileId) })
      .sort({ favoriteOrder: -1 })
      .limit(1)
      .toArray();

    const nextOrder = maxOrderFavorite.length > 0 
      ? maxOrderFavorite[0].favoriteOrder + 1 
      : 1;

    // Adicionar aos favoritos
    const result = await favoritesCollection.insertOne({
      profileId: new ObjectId(profileId),
      contentId: new ObjectId(contentId),
      contentType,
      addedAt: new Date(),
      favoriteOrder: nextOrder,
      category: category || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Adicionado aos favoritos com sucesso",
      favoriteId: result.insertedId,
      favoriteOrder: nextOrder
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/perfil/favoritos error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erro interno do servidor" 
      },
      { status: 500 }
    );
  }
}