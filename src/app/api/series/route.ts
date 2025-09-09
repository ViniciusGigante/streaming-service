import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
  profileId?: string;
}

interface Series {
  _id: ObjectId;
  title: string;
  description: string;
  releaseYear: number;
  thumbnailUrl: string;
  videoUrl: string;
  isNewRelease: boolean;
  categories?: string[];
}

interface SeriesSummary {
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

    const db = await getDatabase();
    const seriesCol = db.collection<Series>("Series");

    const seriesList = await seriesCol.find().toArray();
    
    const seriesSummary = (series: Series): SeriesSummary => ({
      _id: series._id.toString(),
      title: series.title,
      description: series.description,
      releaseYear: series.releaseYear,
      thumbnailUrl: series.thumbnailUrl,
      videoUrl: series.videoUrl,
      isNewRelease: series.isNewRelease
    });

    // Agrupa séries por categoria
    const grouped: Record<string, SeriesSummary[]> = {
      Anime: [],
      Desenho: [],
      Outras: []
    };

    seriesList.forEach(series => {
      if (series.categories?.includes("Anime")) {
        grouped.Anime.push(seriesSummary(series));
      } else if (series.categories?.includes("Desenho")) {
        grouped.Desenho.push(seriesSummary(series));
      } else {
        grouped.Outras.push(seriesSummary(series));
      }
    });

    // Filtra categorias vazias
    const filteredGrouped = Object.fromEntries(
      Object.entries(grouped).filter(([_, list]) => list.length > 0)
    );

    return NextResponse.json({ success: true, data: filteredGrouped }, { status: 200 });

  } catch (error) {
    console.error("GET /api/series error:", error);
    return NextResponse.json({ message: "Erro interno", error }, { status: 500 });
  }
}
