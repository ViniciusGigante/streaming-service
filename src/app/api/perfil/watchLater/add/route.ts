import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
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
    const body = await req.json();
    const { profileId, contentId, contentType, note } = body;

    console.log("Dados recebidos watchLater:", { profileId, contentId, contentType });

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

    // ✅ CORREÇÃO 1: Coleção correta "Profiles" com P maiúsculo
    const profilesCollection = db.collection("Profiles");
    
    // ✅ CORREÇÃO 2: Verificação correta com accountId
    const profile = await profilesCollection.findOne({
      _id: new ObjectId(profileId),
      accountId: new ObjectId(payload.userId) // ← accountId, não email
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
    // ✅ CORREÇÃO 3: Caminho do log correto
    console.error("POST /api/perfil/watchLater/add error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Erro interno do servidor" 
      },
      { status: 500 }
    );
  }
}