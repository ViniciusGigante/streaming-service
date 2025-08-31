import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    if (email === "teste@exemplo.com" && password === "123456") {
      return NextResponse.json({ message: "Login successful" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
