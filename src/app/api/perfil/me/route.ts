import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
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

    // pegar profileId da query
    const url = new URL(req.url);
    const profileId = url.searchParams.get("profileId");

    if (!profileId) {
      return NextResponse.json({ message: "Nenhum profileId enviado" }, { status: 400 });
    }

    if (!ObjectId.isValid(profileId)) {
      return NextResponse.json({ message: "profileId inválido" }, { status: 400 });
    }

    const db = await getDatabase();
    const profilesCollection = db.collection("Profiles");

    const profile = await profilesCollection.findOne({
      _id: new ObjectId(profileId),
      accountId: new ObjectId(payload.userId),
    });

    if (!profile) {
      return NextResponse.json({ message: "Perfil não encontrado" }, { status: 404 });
    }

    return NextResponse.json({
      _id: profile._id.toString(),
      name: profile.name,
      avatarColor: profile.avatarColor,
      createdAt: profile.createdAt,
      email: payload.email,
    });
  } catch (error) {
    console.error("GET /api/perfil/me error:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
