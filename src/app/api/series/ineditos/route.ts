
import { NextResponse } from "next/server";
import connectToDatabase from "@/middlewares/connectDb"; // caminho relativo sem alias

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const seriesCol = db.collection("Series");

    // Buscar apenas séries inéditas com as colunas solicitadas
    const ineditas = await seriesCol
      .find(
        { isNewRelease: true },
        { projection: { _id: 1, title: 1, releaseYear: 1, isNewRelease: 1, thumbnailUrl: 1 } }
      )
      .toArray();

    return NextResponse.json({ success: true, data: ineditas });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Erro interno", error },
      { status: 500 }
    );
  }
}