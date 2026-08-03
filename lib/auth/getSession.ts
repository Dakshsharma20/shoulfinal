import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { verifySessionToken, type AdminSessionPayload } from "@/lib/auth/jwt";

/**
 * Reads and verifies the admin session cookie in a Server Component,
 * Route Handler, or Server Action. Returns null if not logged in or the
 * session is invalid/expired.
 */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
