import { SignJWT, jwtVerify } from "jose";

const SESSION_DURATION = "7d";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET is not set. Copy .env.local.example to .env.local and set a long random value."
    );
  }
  return new TextEncoder().encode(secret);
}

export interface AdminSessionPayload {
  email: string;
  role: "admin";
}

export async function signSessionToken(payload: AdminSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

/**
 * Verifies a session token. Returns null instead of throwing on any
 * failure (expired, tampered, malformed) so callers can treat "not
 * logged in" and "invalid session" the same way.
 */
export async function verifySessionToken(
  token: string | undefined
): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "admin" || typeof payload.email !== "string") {
      return null;
    }
    return { email: payload.email, role: "admin" };
  } catch {
    return null;
  }
}
