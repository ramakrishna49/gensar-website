import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientLogos } from "@/lib/db/schema";
import { logoSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [logo] = await db.select().from(clientLogos).where(eq(clientLogos.id, Number(id))).limit(1);
  if (!logo) return NextResponse.json({ error: "Logo not found" }, { status: 404 });
  return NextResponse.json(logo);
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = logoSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

    const [existing] = await db.select().from(clientLogos).where(eq(clientLogos.id, Number(id))).limit(1);
    if (!existing) return NextResponse.json({ error: "Logo not found" }, { status: 404 });

    const [result] = await db.update(clientLogos).set(parsed.data).where(eq(clientLogos.id, Number(id))).returning();
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update logo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [existing] = await db.select().from(clientLogos).where(eq(clientLogos.id, Number(id))).limit(1);
  if (!existing) return NextResponse.json({ error: "Logo not found" }, { status: 404 });

  await db.delete(clientLogos).where(eq(clientLogos.id, Number(id)));
  return NextResponse.json({ message: "Logo deleted successfully" });
}
