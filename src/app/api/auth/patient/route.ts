"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { NewPatientSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { auth } from "@/auth";
import { handlePatientUpdate } from "@/lib/pusher";
import { PatientData } from "@/types";

export async function GET(req: Request) {
  const session = await auth();

  const data = await db.user.findUnique({
    where: {
      id: session?.user.id || "",
    },
    include: {
      patients: true,
    },
  });

  if (!data || !data.patients || data.patients.length === 0)
    return new NextResponse(JSON.stringify({ error: "No patients found!" }), {
      status: 404,
    });

  // Return the patients data directly
  return new NextResponse(JSON.stringify(data.patients), { status: 200 });
}

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

  const newPatient: PatientData = await db.patient.create({
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

  await handlePatientUpdate("add", newPatient);

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
  const removedPatient = await db.patient.delete({
    where: {
      id: patientId,
    },
  });
  await handlePatientUpdate("remove", removedPatient);

  return NextResponse.json({ success: "Patient removed!" }, { status: 200 });
}

export async function PUT(req: Request) {
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

  const { name, age, specialCare, ecmoType } = body;

  const updatedPatient = await db.patient.update({
    where: {
      id: patientId,
    },
    data: {
      name,
      age,
      specialCare,
      ecmoType,
    },
  });

  await handlePatientUpdate("update", updatedPatient);

  return NextResponse.json({ success: "Patient updated!" }, { status: 200 });
}
