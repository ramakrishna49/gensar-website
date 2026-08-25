import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const all = await db.select().from(siteSettings);
  return NextResponse.json(all);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { section, key, value } = body;
    if (!section || !key) return NextResponse.json({ error: "section and key are required" }, { status: 400 });

    const existing = await db
      .select()
      .from(siteSettings)
      .where(and(eq(siteSettings.section, section), eq(siteSettings.key, key)))
      .limit(1);

    if (existing[0]) {
      const [result] = await db
        .update(siteSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing[0].id))
        .returning();
      return NextResponse.json(result);
    }

    const [result] = await db.insert(siteSettings).values({ section, key, value }).returning();
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update setting";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
