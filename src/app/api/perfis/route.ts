import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
  username: string;
  email: string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token não encontrado" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET!;
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, secret) as JwtPayload;
    } catch (err) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const { email } = payload;

    const db = await getDatabase();
    const profilesCollection = db.collection("Profiles");

    const profiles = await profilesCollection
      .find({ accountEmail: email })
      .project({ _id: 1, name: 1, avatarColor: 1 })
      .toArray();

    return NextResponse.json({ profiles });
  } catch (error) {
    console.error("GET /api/perfis error:", error);
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
