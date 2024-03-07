"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const session = await auth();

  const patients = await db.patient.findMany({
    orderBy: { score: "desc" },
  });

  // Return the patients data directly
  return new NextResponse(JSON.stringify(patients), { status: 200 });
}
