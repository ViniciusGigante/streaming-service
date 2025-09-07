import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
  profileId?: string;
}

interface Movie {
  _id: ObjectId;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
  categories?: string[];
}

interface MovieSummary {
  _id: string;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
}

export async function GET(req: NextRequest) {
  try {
    // 1️⃣ Verifica token JWT
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

    // 2️⃣ Conecta ao Mongo
    const db = await getDatabase();
    const moviesCol = db.collection<Movie>("Movies");
    const categoriesCol = db.collection<{ name: string }>("Categories");

    // 3️⃣ Busca categorias e filmes
    const categoriesDocs = await categoriesCol.find().toArray();
    const categoryNames = categoriesDocs.map(cat => cat.name);
    const movies = await moviesCol.find().toArray();

    // 4️⃣ Agrupa filmes por primeira categoria
    const grouped: Record<string, MovieSummary[]> = {};

    movies.forEach(movie => {
      const firstCat = movie.categories?.[0];
      const key = firstCat && categoryNames.includes(firstCat) ? firstCat : "Sem Categoria";

      if (!grouped[key]) grouped[key] = []; // cria somente se houver filme
      grouped[key].push({
        _id: movie._id.toString(),
        title: movie.title,
        description: movie.description,
        releaseYear: movie.releaseYear,
        thumbnailUrl: movie.thumbnailUrl,
        videoUrl: movie.videoUrl,
        isNewRelease: movie.isNewRelease
      });
    });

    return NextResponse.json({ success: true, data: grouped }, { status: 200 });
  } catch (error) {
    console.error("GET /api/movies error:", error);
    return NextResponse.json({ message: "Erro interno", error }, { status: 500 });
  }
}
