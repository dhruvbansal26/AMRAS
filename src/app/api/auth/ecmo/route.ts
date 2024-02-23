"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { NewEcmoSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = NewEcmoSchema.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json({ error: validatedFields.error }, { status: 400 });
  }

  const { model, serial, type, hospitalId, inUse } = validatedFields.data;

  const existingUser = await getUserById(hospitalId);

  if (!existingUser) {
    return NextResponse.json(
      { error: "Hospital does not exist!" },
      { status: 404 }
    );
  }
  await db.eCMOMachine.create({
    data: {
      model,
      serial,
      type,
      hospitalId,
      inUse,
    },
  });

  return NextResponse.json(
    { success: "ECMO successfully registered!" },
    { status: 200 }
  );
}
