import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

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
    } catch {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const db = await getDatabase();
    const profilesCollection = db.collection("Profiles");

    const profiles = await profilesCollection
      .find({ accountId: new ObjectId(payload.userId) })
      .project({ _id: 1, name: 1, avatarColor: 1 })
      .toArray();

    return NextResponse.json({ profiles });
  } catch {
    return NextResponse.json({ message: "Erro interno" }, { status: 500 });
  }
}
