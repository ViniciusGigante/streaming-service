import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import fs from 'fs';
import path from "path";

const postersDir = path.join(process.cwd(), 'public', 'posters');

interface SessionPayload extends JwtPayload {
  userId: string;
  email: string;
  profileId?: string;
}
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Token não encontrado" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as SessionPayload;

    if (!payload || !payload.userId || !payload.email) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const arquivos = fs.readdirSync(postersDir);

    return NextResponse.json({
      message: "Token válido",
      session: {
        userId: payload.userId,
        email: payload.email,
        profileId: payload.profileId ?? null,
      },
      arquivos
    });

  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return NextResponse.json({ message: "Token inválido ou expirado", error}, { status: 401 });
  }
}
