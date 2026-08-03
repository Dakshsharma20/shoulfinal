import { NextResponse } from "next/server";
import { getOrCreateSettings } from "@/lib/data/getOrCreateSettings";

export async function GET() {
  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err) {
    console.error("GET /api/settings failed:", err);
    return NextResponse.json({ success: false, error: "Failed to load settings." }, { status: 500 });
  }
}
