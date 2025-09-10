import { NextRequest, NextResponse } from "next/server";
import  getDatabase  from "@/lib/mongodb";
import bcrypt from "bcrypt";
import jwt, { SignOptions, Secret } from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const body: { email?: string; password?: string } = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const usersCollection = db.collection("User");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Expiração do JWT em segundos
    let expiresInSeconds = 24 * 60 * 60; // default 1 dia
    if (process.env.JWT_EXPIRES_IN) {
      const match = process.env.JWT_EXPIRES_IN.match(/^(\d+)([smhd])$/);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2];
        switch (unit) {
          case "s": expiresInSeconds = value; break;
          case "m": expiresInSeconds = value * 60; break;
          case "h": expiresInSeconds = value * 3600; break;
          case "d": expiresInSeconds = value * 86400; break;
        }
      }
    }

    const secret: Secret = process.env.JWT_SECRET!;
    const options: SignOptions = { expiresIn: expiresInSeconds };

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      secret,
      options
    );

    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: expiresInSeconds,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
