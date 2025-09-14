// src/app/api/movies/ineditos/route.ts
import { NextResponse } from "next/server";
import connectToDatabase from "@/middlewares/connectDb"; // ajuste sem alias

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const moviesCol = db.collection("Movies");

    // Buscar apenas filmes inéditos com as colunas solicitadas
    const ineditos = await moviesCol
      .find(
        { isNewRelease: true },
        { projection: { _id: 1, title: 1, releaseYear: 1, isNewRelease: 1, thumbnailUrl: 1 } }
      )
      .toArray();

    return NextResponse.json({ success: true, data: ineditos });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Erro interno", error },
      { status: 500 }
    );
  }
}
