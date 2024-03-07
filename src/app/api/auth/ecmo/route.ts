"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { NewEcmoSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";
import { handleECMOUpdate } from "@/lib/pusher";
import { auth } from "@/auth";
import { handleQueueUpdate } from "@/lib/pusher";

export async function GET(req: Request) {
  const session = await auth();

  const data = await db.user.findUnique({
    where: {
      id: session?.user.id || "",
    },
    include: {
      ecmoMachines: true,
    },
  });

  if (!data || !data.ecmoMachines || data.ecmoMachines.length === 0)
    return new NextResponse(JSON.stringify({ error: "No ECMOs found!" }), {
      status: 404,
    });

  // Return the ECMO data directly
  return new NextResponse(JSON.stringify(data.ecmoMachines), { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = NewEcmoSchema.safeParse(body);
  if (!validatedFields.success) {
    return NextResponse.json({ error: validatedFields.error }, { status: 400 });
  }

  const { model, serial, type, hospitalId, inUse, isMatched } =
    validatedFields.data;

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

  const newMachine = await db.eCMOMachine.create({
    data: {
      model,
      serial,
      type,
      hospitalId,
      inUse,
      isMatched,
      coordinates,
    },
  });

  await handleECMOUpdate("add", newMachine);
  await handleQueueUpdate();

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
  const removedMachine = await db.eCMOMachine.delete({
    where: {
      id: ecmoId,
    },
  });

  await handleECMOUpdate("remove", removedMachine);
  await handleQueueUpdate();

  return NextResponse.json({ success: "ECMO removed!" }, { status: 200 });
}

export async function PUT(req: Request) {
  const body = await req.json();
  const ecmoId = body.id;

  const existingMachine = await db.eCMOMachine.findUnique({
    where: {
      id: ecmoId,
    },
  });

  if (!existingMachine) {
    return NextResponse.json(
      { error: "ECMO does not exist!" },
      { status: 404 }
    );
  }

  const { model, serial, type, hospitalId, inUse, isMatched } = body;

  const updatedMachine = await db.eCMOMachine.update({
    where: {
      id: ecmoId,
    },
    data: {
      model,
      serial,
      type,
      hospitalId,
      inUse,
      isMatched,
    },
  });

  await handleECMOUpdate("update", updatedMachine);
  await handleQueueUpdate();

  return NextResponse.json({ success: "ECMO updated!" }, { status: 200 });
}
