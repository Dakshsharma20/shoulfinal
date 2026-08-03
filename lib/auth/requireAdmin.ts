import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/getSession";

/**
 * Belt-and-suspenders check used inside every /api/admin/* route handler,
 * in addition to middleware.ts. Returns the session if valid, or a 401
 * NextResponse to return immediately.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      ),
    };
  }
  return { session, response: null };
}
