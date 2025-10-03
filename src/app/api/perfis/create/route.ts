import { NextRequest, NextResponse } from "next/server";
import  getDatabase  from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

interface JwtPayload {
  userId: string;
  username: string;
  email: string;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Token não encontrado" }, { status: 401 });

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const body = await req.json();
    const { name } = body;
    if (!name || name.trim() === "") {
      return NextResponse.json({ message: "O nome do perfil é obrigatório" }, { status: 400 });
    }

    const db = await getDatabase();
    const profilesCollection = db.collection("Profiles");

    const existingProfile = await profilesCollection.findOne({ name: name.trim(), accountId: new ObjectId(payload.userId) });
    if (existingProfile) {
      return NextResponse.json({ message: "Já existe um perfil com esse nome" }, { status: 400 });
    }

    const newProfile = {
      name: name.trim(),
      accountId: new ObjectId(payload.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await profilesCollection.insertOne(newProfile);

    return NextResponse.json({ message: "Perfil criado com sucesso", profileId: result.insertedId });
  } catch (error) {
    console.error("POST /api/perfis/create error:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
