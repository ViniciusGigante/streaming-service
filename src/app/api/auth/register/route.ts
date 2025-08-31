import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    try{

        const body = await req.json();
        const { username, email, password } = body;

        if(!username || !email || !password){
            return NextResponse.json({message: "All fields are required"}, {status: 400});
        }

        //Código Mongo

        return NextResponse.json({message: "User registered successfully"}, {status: 201});

    }catch(error){
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}