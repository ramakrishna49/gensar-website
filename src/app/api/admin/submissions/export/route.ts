import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { submissions } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allSubmissions = await db.select().from(submissions).orderBy(desc(submissions.createdAt));

  const allKeys = Array.from(
    new Set(allSubmissions.flatMap((s) => Object.keys(s.formData as Record<string, unknown>)))
  ).sort();

  const headers = ["ID", "Form Type", "Submitted At", "Read", ...allKeys];

  const rows = allSubmissions.map((s) => {
    const data = s.formData as Record<string, unknown>;
    return [String(s.id), s.formType, String(s.createdAt), s.read ? "Yes" : "No", ...allKeys.map((k) => String(data[k] ?? ""))];
  });

  const csv = [
    headers.map(escapeCsv).join(","),
    ...rows.map((r) => r.map(escapeCsv).join(",")),
  ].join("\n");

  return new NextResponse("\uFEFF" + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="submissions.csv"',
    },
  });
}

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
