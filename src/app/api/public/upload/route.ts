import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTS = [".pdf", ".doc", ".docx"];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
  };
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
  const { allowed } = rateLimit(`upload:${ip}`, 5, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: corsHeaders() });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400, headers: corsHeaders() });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB." }, { status: 400, headers: corsHeaders() });
    }

    const ext = path.extname(file.name) || ".pdf";
    if (!ALLOWED_EXTS.includes(ext.toLowerCase())) {
      return NextResponse.json({ error: "Invalid file type. Only PDF, DOC, DOCX allowed." }, { status: 400, headers: corsHeaders() });
    }

    if (!file.type.startsWith("application/")) {
      return NextResponse.json({ error: "Invalid file type. Only documents are allowed." }, { status: 400, headers: corsHeaders() });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

    try {
      const { put } = await import("@vercel/blob");
      const blob = await put(filename, buffer, {
        contentType: file.type,
        access: "public",
      });
      return NextResponse.json({ url: blob.url, filename }, { status: 200, headers: corsHeaders() });
    } catch {}

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadDir, filename);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(filepath, buffer);
    const url = `/uploads/${filename}`;

    return NextResponse.json({ url, filename }, { status: 200, headers: corsHeaders() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { headers: corsHeaders() });
}
