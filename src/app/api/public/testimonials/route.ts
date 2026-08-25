import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc, eq, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageSection = searchParams.get("section");
  const limitParam = searchParams.get("limit");

  const conditions = [eq(testimonials.isActive, true)];
  if (pageSection) conditions.push(eq(testimonials.pageSection, pageSection));

  let query = db
    .select()
    .from(testimonials)
    .where(and(...conditions))
    .orderBy(desc(testimonials.sortOrder), desc(testimonials.createdAt));

  let result = await query;
  if (limitParam) result = result.slice(0, Number(limitParam));

  return NextResponse.json(result, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  } });
}
