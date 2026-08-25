import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const formType = searchParams.get("form_type");
  const read = searchParams.get("read");

  let query = db.select().from(submissions).orderBy(desc(submissions.createdAt));

  const filters: ReturnType<typeof eq>[] = [];
  if (formType) filters.push(eq(submissions.formType, formType));
  if (read === "true") filters.push(eq(submissions.read, true));
  else if (read === "false") filters.push(eq(submissions.read, false));

  const result = filters.length > 0
    ? await db.select().from(submissions).where(and(...filters)).orderBy(desc(submissions.createdAt))
    : await query;

  return NextResponse.json(result);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Submission ID required" }, { status: 400 });

    const [existing] = await db.select().from(submissions).where(eq(submissions.id, Number(id))).limit(1);
    if (!existing) return NextResponse.json({ error: "Submission not found" }, { status: 404 });

    await db.delete(submissions).where(eq(submissions.id, Number(id)));
    return NextResponse.json({ message: "Submission deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
