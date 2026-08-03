import { NextRequest, NextResponse } from "next/server";
import cloudinary, { assertCloudinaryConfigured } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth/requireAdmin";

export const runtime = "nodejs";

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

function uploadBuffer(buffer: Buffer): Promise<{ secure_url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "soulhues/products", resource_type: "image" },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Cloudinary upload failed."));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

export async function POST(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    assertCloudinaryConfigured();
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: "Expected multipart/form-data." },
      { status: 400 }
    );
  }

  // Supports uploading multiple files in one request under the "files" key.
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ success: false, error: "No files provided." }, { status: 400 });
  }

  const uploaded: { url: string; publicId: string }[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: unsupported file type (${file.type || "unknown"}).`);
      continue;
    }
    if (file.size > MAX_FILE_BYTES) {
      errors.push(`${file.name}: file is too large (max 8MB).`);
      continue;
    }
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await uploadBuffer(Buffer.from(arrayBuffer));
      uploaded.push({ url: result.secure_url, publicId: result.public_id });
    } catch (err) {
      errors.push(`${file.name}: upload failed (${(err as Error).message}).`);
    }
  }

  if (uploaded.length === 0) {
    return NextResponse.json({ success: false, error: errors.join(" ") || "Upload failed." }, { status: 500 });
  }

  return NextResponse.json({ success: true, images: uploaded, errors });
}

export async function DELETE(req: NextRequest) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    assertCloudinaryConfigured();
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }

  const { publicId } = await req.json().catch(() => ({ publicId: null }));
  if (!publicId || typeof publicId !== "string") {
    return NextResponse.json({ success: false, error: "publicId is required." }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
