import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { validateToken } from "@/middlewares/token";
import connectToDatabase from "@/middlewares/connectDb";
import { validateProfile } from "@/middlewares/validateProfile";

export async function PUT(req: NextRequest) {
    try {
        // 1. Validar token
        const tokenValidation = await validateToken(req);
        
        if (tokenValidation.error) {
            return NextResponse.json(
                { message: tokenValidation.error },
                { status: tokenValidation.status }
            );
        }

        // 2. Verificar se payload existe
        if (!tokenValidation.payload) {
            return NextResponse.json(
                { message: "Token inválido" },
                { status: 401 }
            );
        }

        const { payload } = tokenValidation;
    
        // 3. Obter profileId
        const url = new URL(req.url);
        const profileId = url.searchParams.get("profileId");

        if (!profileId) {
            return NextResponse.json(
                { message: "Nenhum profileId enviado" },
                { status: 400 }
            );
        }

        // 4. Validar se o perfil pertence ao usuário
        const isValidProfile = await validateProfile(payload.userId, profileId);
        
        if (!isValidProfile) {
            return NextResponse.json(
                { message: "Perfil não pertence a esta conta" },
                { status: 403 }
            );
        }

        // 5. Obter dados do body - APENAS name
        const body = await req.json();
        const { name } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json(
                { message: "Nome inválido ou não fornecido" },
                { status: 400 }
            );
        }

        // 6. Usar middleware de conexão
        const { db } = await connectToDatabase();

        // 7. Atualizar APENAS o nome do perfil
        const profilesCollection = db.collection("Profiles");
        const result = await profilesCollection.updateOne(
            { 
                _id: new ObjectId(profileId),
                accountId: new ObjectId(payload.userId)
            },
            { 
                $set: { 
                    name: name,
                    updatedAt: new Date()
                } 
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { message: "Perfil não encontrado" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Perfil atualizado com sucesso" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Erro interno:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}