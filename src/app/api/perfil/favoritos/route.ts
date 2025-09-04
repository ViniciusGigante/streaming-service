import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

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

    if (!payload.profileId) {
      return NextResponse.json({ message: "Nenhum perfil ativo" }, { status: 400 });
    }


    const db = await getDatabase();
    const listsCollection = db.collection("Lists");
    const moviesCollection = db.collection("Movies");

    const favoritosList = await listsCollection.findOne({
      profileId: new ObjectId(payload.profileId),
      name: "Favoritos"
    });

    if (!favoritosList || favoritosList.movieIds.length === 0) {
      return NextResponse.json({ filmes: [] });
    }

    const filmes = await moviesCollection
      .find({ _id: { $in: favoritosList.movieIds } })
      .project({ title: 1 }) 
      .toArray();

    return NextResponse.json({ filmes: filmes.map(f => f.title) });
  } catch (error) {
    console.error("GET /api/perfil/favoritos error:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
