"use server";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: Request) {
  const ecmoMachines = await db.eCMOMachine.findMany({
    where: { inUse: false },
  });

  // Return the patients data directly
  return new NextResponse(JSON.stringify(ecmoMachines), { status: 200 });
}
