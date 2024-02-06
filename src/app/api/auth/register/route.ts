"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = RegisterSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid Fields!" }, { status: 404 });
  }

  const { email, password, name } = validatedFields.data;

  // hashing the user password to store in the database
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already exists!" },
      { status: 404 }
    );
  }

  const newUser = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      location: "",
    },
  });

  //TODO: Send verification email token!

  return NextResponse.json({ success: "Email sent!" }, { status: 200 });
}
