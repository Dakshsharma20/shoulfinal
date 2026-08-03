export const SESSION_COOKIE_NAME = "soulhues_admin_session";

/**
 * Options for setting the session cookie on login.
 * - httpOnly: never readable from client-side JS (XSS protection)
 * - secure: only sent over HTTPS in production
 * - sameSite=lax: sent on top-level navigation, blocks most CSRF vectors
 *   while still working for normal admin-panel usage
 */
export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days, matches JWT expiry
