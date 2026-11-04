import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-key-change-in-production-min-32-chars"
);

export interface JwtPayload {
  sub: string;
  tenantId: string;
  email?: string;
  scope?: "user" | "platform";
  [key: string]: unknown;
}

export async function signJwtToken(
  payload: JwtPayload,
  expiresIn = "8h"
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function verifyJwtToken(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.sub) return null;
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
