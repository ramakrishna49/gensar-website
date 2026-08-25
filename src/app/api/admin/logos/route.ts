import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientLogos } from "@/lib/db/schema";
import { logoSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allLogos = await db.select().from(clientLogos).orderBy(desc(clientLogos.displayOrder), desc(clientLogos.createdAt));
  return NextResponse.json(allLogos);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = logoSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

    const [result] = await db.insert(clientLogos).values(parsed.data).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create logo";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
