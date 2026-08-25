import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const socialKeys = ["linkedin", "instagram"];
  const results = [];

  for (const key of socialKeys) {
    const [setting] = await db
      .select()
      .from(siteSettings)
      .where(and(eq(siteSettings.section, "social"), eq(siteSettings.key, key)))
      .limit(1);
    if (setting) {
      results.push({ key: setting.key, value: setting.value });
    }
  }

  return NextResponse.json(results, {
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
