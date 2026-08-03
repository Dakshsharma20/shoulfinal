import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validations/schemas";
import { signSessionToken } from "@/lib/auth/jwt";
import { SESSION_COOKIE_NAME, sessionCookieOptions, SESSION_MAX_AGE_SECONDS } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }
  const { email, password } = parsed.data;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    console.error("ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not configured in .env.local");
    return NextResponse.json(
      { success: false, error: "Admin login is not configured on the server." },
      { status: 500 }
    );
  }

  // Constant-shape comparison: always run bcrypt.compare even if the email
  // doesn't match, so failed-login timing doesn't reveal whether the email
  // exists.
  const emailMatches = email.toLowerCase() === adminEmail.toLowerCase();
  const passwordMatches = await bcrypt.compare(password, adminPasswordHash).catch(() => false);

//   console.log("========== LOGIN DEBUG ==========");
// console.log("Entered Email:", JSON.stringify(email));
// console.log("ENV Email:", JSON.stringify(adminEmail));
// console.log("Entered Password:", JSON.stringify(password));
// console.log("Email Match:", emailMatches);
// console.log("Password Match:", passwordMatches);
// console.log("=================================");

const hardcodedTest = await bcrypt.compare(
  "Daksh123",
  "$2a$10$rG08nkOBiJ/1otQvIGjgzu4T99bqwRprWoxQi9j8iXD/EB6IRCMp6"
);

console.log("ENV HASH:", adminPasswordHash);
console.log("Hardcoded Test:", hardcodedTest);

  if (!emailMatches || !passwordMatches) {
    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  const token = await signSessionToken({ email: adminEmail, role: "admin" });

  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions(SESSION_MAX_AGE_SECONDS));
  return res;
}
