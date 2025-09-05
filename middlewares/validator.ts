import jwt, { JwtPayload } from "jsonwebtoken";

interface Payload extends JwtPayload {
  userId: string;
  username: string;
  email: string;
}

export function validateToken(token: string): Payload | null {
  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as Payload;
    return payload;
  } catch (error) {
    return null;
  }
}
