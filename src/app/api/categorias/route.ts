import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
  profileId?: string;
}

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Verifica token
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

    // 2️⃣ Conecta ao banco
    const db = await getDatabase();
    const categoriesCollection = db.collection("Categories");

    // 3️⃣ Busca todas as categorias
    const categories = await categoriesCollection.find().toArray();

    // 4️⃣ Organiza como objeto { nomeCategoria: { description } }
    const response: Record<string, { description?: string }> = {};
    categories.forEach(cat => {
      response[cat.name] = { description: cat.description || "" };
    });

    return NextResponse.json({ success: true, data: response }, { status: 200 });

  } catch (error) {
    console.error("GET /api/categorias error:", error);
    return NextResponse.json({ success: false, message: "Erro interno", error }, { status: 500 });
  }
}
