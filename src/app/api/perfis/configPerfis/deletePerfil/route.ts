// app/api/perfis/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/middlewares/connectDb";
import { validateToken } from "@/middlewares/token";
import { validateProfile } from "@/middlewares/validateProfile";
import { ObjectId } from "mongodb";

export async function DELETE(req: NextRequest) {
  try {
    // 1️⃣ validar token
    const { payload, error, status } = await validateToken(req);

    if (!payload) {
      return NextResponse.json(
        { error: error || "Token inválido" },
        { status: status || 401 }
      );
    }

    const userId = payload.userId;

    // 2️⃣ pegar id do perfil do body
    const { profileId } = await req.json();

    if (!profileId) {
      return NextResponse.json(
        { error: "ID do perfil é obrigatório" },
        { status: 400 }
      );
    }

    // 3️⃣ validar se o perfil pertence ao usuário
    const isValid = await validateProfile(userId, profileId);
    if (!isValid) {
      return NextResponse.json(
        { error: "Perfil não pertence a você" },
        { status: 403 }
      );
    }

    // 4️⃣ conectar ao banco
    const { db } = await connectToDatabase();
    const perfilsCollection = db.collection("Profiles");

    // 5️⃣ verificar se este é o último perfil da conta
    const totalPerfis = await perfilsCollection.countDocuments({
      accountId: new ObjectId(userId),
    });

    if (totalPerfis <= 1) {
      return NextResponse.json(
        { error: "Você não pode excluir o último perfil da conta." },
        { status: 400 }
      );
    }

    // 6️⃣ deletar o perfil
    const result = await perfilsCollection.deleteOne({
      _id: new ObjectId(profileId),
      accountId: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Não foi possível excluir o perfil." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, deletedId: profileId });
  } catch (err) {
    console.error("Erro ao deletar perfil:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
