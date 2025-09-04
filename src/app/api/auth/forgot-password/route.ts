// import { NextRequest, NextResponse } from "next/server";
// import { getDatabase } from "@/lib/mongodb";
// import jwt, { Secret } from "jsonwebtoken";
// import nodemailer from "nodemailer";

// export async function POST(req: NextRequest) {
//   try {
//     console.log("Received forgot-password request");

//     const { email }: { email?: string } = await req.json();
//     if (!email) {
//       console.log("No email provided in request body");
//       return NextResponse.json({ message: "Email is required" }, { status: 400 });
//     }
//     console.log("Email received:", email);

//     const db = await getDatabase();
//     const usersCollection = db.collection("User");

//     const user = await usersCollection.findOne({ email });
//     if (!user) {
//       console.log("No user found for email:", email);
//       return NextResponse.json({
//         message: "If an account exists with this email, a reset link has been sent."
//       }, { status: 200 });
//     }
//     console.log("User found:", user._id.toString());

//     const secret: Secret = process.env.JWT_SECRET!;
//     const resetToken = jwt.sign({ userId: user._id.toString() }, secret, { expiresIn: '1h' });
//     const resetLink = `${process.env.NEXT_PUBLIC_URL}/auth/reset-password?token=${resetToken}`;
//     console.log("Generated reset link:", resetLink);

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: Number(process.env.SMTP_PORT),
//       auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
//     });
//     console.log("Transporter created");

//     await transporter.sendMail({
//       from: process.env.SMTP_FROM,
//       to: email,
//       subject: "Password Reset Request",
//       html: `
//         <p>Hello ${user.username},</p>
//         <p>You requested a password reset. Click the link below to reset your password:</p>
//         <a href="${resetLink}" target="_blank">${resetLink}</a>
//         <p>This link will expire in 1 hour.</p>
//         <p>If you did not request this, please ignore this email.</p>
//       `
//     });
//     console.log("Reset email sent to:", email);

//     return NextResponse.json({
//       message: "If an account exists with this email, a reset link has been sent."
//     }, { status: 200 });

//   } catch (error) {
//     console.error("POST /api/auth/forgot-password error:", error);
//     return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//   }
// }
