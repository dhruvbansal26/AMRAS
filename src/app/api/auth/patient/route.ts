"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { NewPatientSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = NewPatientSchema.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json({ error: validatedFields.error }, { status: 400 });
  }

  const { name, age, specialCare, hospitalId, ecmoType } = validatedFields.data;

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
  await db.patient.create({
    data: {
      name,
      age,
      score: 0,
      specialCare,
      hospitalId,
      ecmoType,
      coordinates,
    },
  });

  return NextResponse.json(
    { success: "Patient successfully registered!" },
    { status: 200 }
  );
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const patientId = body.id;

  const existingPatient = await db.patient.findUnique({
    where: {
      id: patientId,
    },
  });

  if (!existingPatient) {
    return NextResponse.json(
      { error: "Patient does not exist!" },
      { status: 404 }
    );
  }
  await db.patient.delete({
    where: {
      id: patientId,
    },
  });
  return NextResponse.json({ success: "Patient removed!" }, { status: 200 });
}
