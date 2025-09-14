import { NextRequest, NextResponse } from "next/server";
import getDatabase from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { validateToken } from "@/middlewares/token";

export default async function PUT(req: NextRequest) {
    try {

        const tokenValidation = await validateToken(req);
        
        if (tokenValidation.error) {
            return NextResponse.json(
                { message: tokenValidation.error },
                { status: tokenValidation.status }
            );
        }

        const { payload } = tokenValidation;
    
        const url = new URL(req.url);
        const profileId = url.searchParams.get("profileId");

        if (!profileId) {
            return NextResponse.json(
                { message: "Nenhum profileId enviado" },
                { status: 400 }
            );
        }
        if (!ObjectId.isValid(profileId)) {
            return NextResponse.json(
                { message: "profileId inválido" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { name, } = body;


        // CONSULTA
        const db = await getDatabase();


    } catch (error) {
        console.error("Erro interno:", error);
        return NextResponse.json(
            { message: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}