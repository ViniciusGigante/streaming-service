// src/app/api/perfis/configPerfis/renamePerfil/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/middlewares/connectDb";
import { validateToken } from "@/middlewares/token";
import { validateProfile } from "@/middlewares/validateProfile";
import { ObjectId } from "mongodb";

export async function PATCH(req: NextRequest) {
  try {

    const { payload, error, status } = await validateToken(req);
    if (!payload) {
      return NextResponse.json(
        { error: error || "Token inválido" },
        { status: status || 401 }
      );
    }

    const body = await req.json();
    const { profileId, newName } = body;

    if (!profileId || !newName || typeof newName !== "string") {
      return NextResponse.json(
        { error: "Parâmetros inválidos" },
        { status: 400 }
      );
    }

    const isValid = await validateProfile(payload.userId, profileId);
    if (!isValid) {
      return NextResponse.json(
        { error: "Perfil não pertence a você" },
        { status: 403 }
      );
    }


    const { db } = await connectToDatabase();
    const profilesCollection = db.collection("Profiles");

    const result = await profilesCollection.updateOne(
      { _id: new ObjectId(profileId), accountId: new ObjectId(payload.userId) },
      { $set: { name: newName } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Não foi possível encontrar o perfil para renomear." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, updatedName: newName });
  } catch (err) {
    console.error("Erro ao renomear perfil:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
