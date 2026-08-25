import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const submitSchema = z.object({
  form_type: z.enum(["contact", "careers", "consultation", "requirement", "home_consultation", "newsletter"]),
  form_data: z.record(z.string(), z.unknown()),
  resume_url: z.string().optional(),
});

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "anonymous";
  const { allowed, remaining } = rateLimit(`submit:${ip}`, 10, 60000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429, headers: corsHeaders() });
  }

  try {
    const body = await req.json();
    const parsed = submitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400, headers: corsHeaders() });
    }

    const [result] = await db
      .insert(submissions)
      .values({
        formType: parsed.data.form_type,
        formData: parsed.data.form_data as Record<string, unknown>,
        resumeUrl: parsed.data.resume_url || null,
        read: false,
      })
      .returning();

    return NextResponse.json({ message: "Submission received", id: result.id }, { status: 201, headers: corsHeaders() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500, headers: corsHeaders() });
  }
}

export async function OPTIONS() {
  return NextResponse.json(null, { headers: corsHeaders() });
}

function corsHeaders() {
  return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
}
