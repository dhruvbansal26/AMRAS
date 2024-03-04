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

  const hospital = await db.user.findUnique({
    where: { id: hospitalId },
  });

  const coordinates = hospital?.coordinates || "";

  await db.eCMOMachine.create({
    data: {
      model,
      serial,
      type,
      hospitalId,
      inUse,
      coordinates,
    },
  });

  return NextResponse.json(
    { success: "ECMO successfully registered!" },
    { status: 200 }
  );
}
export async function DELETE(req: Request) {
  const body = await req.json();
  const ecmoId = body.id;

  const existingEcmo = await db.eCMOMachine.findUnique({
    where: {
      id: ecmoId,
    },
  });

  if (!existingEcmo) {
    return NextResponse.json(
      { error: "ECMO does not exist!" },
      { status: 404 }
    );
  }
  await db.patient.delete({
    where: {
      id: ecmoId,
    },
  });
  return NextResponse.json({ success: "ECMO removed!" }, { status: 200 });
}
