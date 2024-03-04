"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { LocationSchema } from "@/schemas";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
  }
  const hospitalId = session.user.id;
  const body = await req.json();
  const validatedFields = LocationSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid Fields!" }, { status: 404 });
  }

  await db.user.update({
    where: { id: hospitalId },
    data: {
      location: validatedFields.data.location,
      coordinates: validatedFields.data.coordinates,
    },
  });

  await db.user.updateMany({
    where: { id: hospitalId },
    data: {
      coordinates: validatedFields.data.coordinates,
    },
  });

  return NextResponse.json({ success: "Location added!" }, { status: 200 });
}
