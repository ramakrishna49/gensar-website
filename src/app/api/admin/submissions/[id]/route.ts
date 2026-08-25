import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, Number(id))).limit(1);
  if (!submission) return NextResponse.json({ error: "Submission not found" }, { status: 404 });
  return NextResponse.json(submission);
}

export async function PUT(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [existing] = await db.select().from(submissions).where(eq(submissions.id, Number(id))).limit(1);
  if (!existing) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

  const [result] = await db
    .update(submissions)
    .set({ read: !existing.read })
    .where(eq(submissions.id, Number(id)))
    .returning();
  return NextResponse.json(result);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const [existing] = await db.select().from(submissions).where(eq(submissions.id, Number(id))).limit(1);
  if (!existing) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

  await db.delete(submissions).where(eq(submissions.id, Number(id)));
  return NextResponse.json({ message: "Submission deleted" });
}
