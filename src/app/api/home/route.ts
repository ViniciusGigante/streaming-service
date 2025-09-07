import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
  profileId?: string;
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
    // 1️⃣ Verifica token
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token não encontrado" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as SessionPayload;

    if (!payload || !payload.userId || !payload.email) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    // 2️⃣ Conecta ao DB
    const db = await getDatabase();
    const moviesCollection = db.collection("Movies");

    // 3️⃣ Busca todos os filmes e popula a primeira categoria
    const movies = await moviesCollection
      .aggregate([
        {
          $lookup: {
            from: "Categories",
            localField: "categories",
            foreignField: "_id",
            as: "categoryData"
          }
        }
      ])
      .toArray();

    // 4️⃣ Organiza filmes por primeira categoria
    const grouped: Record<string, MovieSummary[]> = {};

    movies.forEach(movie => {
      const firstCategory = movie.categoryData?.[0]?.name || "Sem Categoria";

      if (!grouped[firstCategory]) grouped[firstCategory] = [];

      grouped[firstCategory].push({
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
