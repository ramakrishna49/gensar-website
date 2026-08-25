import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existingAdmins = await db.select().from(users).limit(1);
    const adminExists = existingAdmins.length > 0;
    const isFirstRegistration = !adminExists;

    if (adminExists) {
      return NextResponse.json(
        { error: "Registration unavailable." },
        { status: 403 }
      );
    }

    const { name, email, password } = parsed.data;
    const passwordHash = await hash(password, 10);

    const [result] = await db
      .insert(users)
      .values({ name, email, passwordHash })
      .returning();

    return NextResponse.json(
      { message: "Admin created successfully", id: result.id },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
