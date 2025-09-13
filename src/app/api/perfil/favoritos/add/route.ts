import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
  profileId?: string;
}

export async function POST(req: NextRequest) {
  console.log("Recebido POST /api/perfil/favoritos/add");

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
    const body = await req.json();
    const { profileId, contentId, contentType, category } = body;

    console.log("Dados recebidos:", { profileId, contentId, contentType });

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

    // Validação do contentType - CORRIGIDO para minúsculo
    if (contentType !== 'movie' && contentType !== 'series') {
      return NextResponse.json(
        { message: "Tipo de conteúdo inválido. Use 'movie' ou 'series'" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const favoritesCollection = db.collection("favorites");

    // Verificar se o perfil pertence ao usuário autenticado - CORRIGIDO
    const profilesCollection = db.collection("Profiles");
    const profile = await profilesCollection.findOne({
      _id: new ObjectId(profileId),
      accountId: new ObjectId(payload.userId) // ← CORREÇÃO AQUI: accountId em vez de accountEmail
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Perfil não encontrado ou não pertence ao usuário" },
        { status: 404 }
      );
    }

    // Verificar se o conteúdo existe na coleção apropriada - CORRIGIDO
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
    console.error("POST /api/perfil/favoritos/add error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erro interno do servidor" 
      },
      { status: 500 }
    );
  }
}