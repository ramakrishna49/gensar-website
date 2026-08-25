import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, GIF, WebP, SVG allowed." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(`admin/uploads/${filename}`, buffer, {
        contentType: file.type,
        access: "public",
      });
      return NextResponse.json({ url: blob.url, filename }, { status: 200 });
    } catch {}

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url, filename }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
