import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { verifySessionToken } from "@/lib/auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");
  const isLoginPage = pathname === "/admin/login";

  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await verifySessionToken(token);

  // Logged-in admins hitting the login page go straight to the dashboard.
  if (isLoginPage) {
    if (session) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json(
        { success: false, error: "Not authenticated." },
        { status: 401 }
      );
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
