import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface SessionPayload extends JwtPayload{
    userId: string;
    email: string;
}
export async function validateToken(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
        return { error: "Token não encontrado", status: 401 };
    }
    
    const secret = process.env.JWT_SECRET!;
    try {
        const payload = jwt.verify(token, secret) as SessionPayload;
        return { payload };
    } catch {
        return { error: "Token inválido", status: 401 };
    }
}