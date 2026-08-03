import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getOrCreateSettings } from "@/lib/data/getOrCreateSettings";
import { settingsSchema } from "@/lib/validations/schemas";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("GET /api/admin/settings failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = settingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid settings data." },
      { status: 400 }
    );
  }

  try {
    const current = await getOrCreateSettings();
    Object.assign(current, parsed.data);
    await current.save();
    return NextResponse.json({ success: true, settings: current });
  } catch (err) {
    console.error("PUT /api/admin/settings failed:", err);
    return NextResponse.json({ success: false, error: "Failed to update settings." }, { status: 500 });
  }
}
