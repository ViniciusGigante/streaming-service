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
    const watchLaterCollection = db.collection("watchLater");
    const moviesCollection = db.collection("Movies");
    const seriesCollection = db.collection("Series");

    // Buscar itens do watchLater usando o profileId da URL
    const watchLaterItems = await watchLaterCollection
      .find({ 
        profileId: new ObjectId(profileId) 
      })
      .sort({ addedAt: -1 })
      .toArray();

    if (watchLaterItems.length === 0) {
      return NextResponse.json({ 
        success: true, 
        watchLater: [] 
      });
    }

    // Separar filmes e séries
    const movieIds = watchLaterItems
      .filter(item => item.contentType === 'movie')
      .map(item => new ObjectId(item.contentId));

    const seriesIds = watchLaterItems
      .filter(item => item.contentType === 'series')
      .map(item => new ObjectId(item.contentId));

    // Buscar detalhes
    const [filmes, series] = await Promise.all([
      movieIds.length > 0 ? moviesCollection
        .find({ _id: { $in: movieIds } })
        .project({ 
          _id: 1, 
          title: 1, 
          thumbnailUrl: 1, 
          releaseYear: 1,
          isNewRelease: 1,
          description: 1
        })
        .toArray() : [],
      
      seriesIds.length > 0 ? seriesCollection
        .find({ _id: { $in: seriesIds } })
        .project({ 
          _id: 1, 
          title: 1, 
          thumbnailUrl: 1, 
          releaseYear: 1,
          isNewRelease: 1,
          description: 1
        })
        .toArray() : []
    ]);

    // Combinar resultados
    const resultados = [
      ...filmes.map(filme => {
        const watchLaterItem = watchLaterItems.find(item => 
          item.contentId.toString() === filme._id.toString()
        );
        return {
          ...filme,
          tipo: 'movie',
          watchLaterId: watchLaterItem?._id,
          addedAt: watchLaterItem?.addedAt,
          note: watchLaterItem?.note,
          watched: watchLaterItem?.watched
        };
      }),
      ...series.map(serie => {
        const watchLaterItem = watchLaterItems.find(item => 
          item.contentId.toString() === serie._id.toString()
        );
        return {
          ...serie,
          tipo: 'series', 
          watchLaterId: watchLaterItem?._id,
          addedAt: watchLaterItem?.addedAt,
          note: watchLaterItem?.note,
          watched: watchLaterItem?.watched
        };
      })
    ];

    // Ordenar por data
    resultados.sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());

    return NextResponse.json({ 
      success: true, 
      watchLater: resultados 
    });

  } catch (error) {
    console.error("GET /api/perfil/watch-later error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Erro interno" 
    }, { status: 500 });
  }
}

// POST - Adicionar filme/série à lista "Assistir mais tarde"
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
    const { profileId, contentId, contentType, note } = await req.json();

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
    const watchLaterCollection = db.collection("watchLater");

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

    // Verificar se já está na lista "Assistir mais tarde"
    const existingItem = await watchLaterCollection.findOne({
      profileId: new ObjectId(profileId),
      contentId: new ObjectId(contentId),
      contentType
    });

    if (existingItem) {
      return NextResponse.json(
        { 
          success: false, 
          message: "Conteúdo já está na lista Assistir mais tarde",
          watchLaterId: existingItem._id
        },
        { status: 409 }
      );
    }

    // Adicionar à lista "Assistir mais tarde"
    const result = await watchLaterCollection.insertOne({
      profileId: new ObjectId(profileId),
      contentId: new ObjectId(contentId),
      contentType,
      addedAt: new Date(),
      note: note || null,
      watched: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: "Adicionado à lista Assistir mais tarde com sucesso",
      watchLaterId: result.insertedId,
      addedAt: new Date()
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/perfil/watch-later error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erro interno do servidor" 
      },
      { status: 500 }
    );
  }
}