import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { testimonialSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [t] = await db.select().from(testimonials).where(eq(testimonials.id, Number(id))).limit(1);
  if (!t) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
  return NextResponse.json(t);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = testimonialSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

    const [existing] = await db.select().from(testimonials).where(eq(testimonials.id, Number(id))).limit(1);
    if (!existing) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });

    const [result] = await db.update(testimonials).set(parsed.data).where(eq(testimonials.id, Number(id))).returning();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [existing] = await db.select().from(testimonials).where(eq(testimonials.id, Number(id))).limit(1);
  if (!existing) return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });

  await db.delete(testimonials).where(eq(testimonials.id, Number(id)));
  return NextResponse.json({ message: "Testimonial deleted successfully" });
}
