"use server";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const token = body.token;
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return NextResponse.json(
      { error: "Token does not exist!" },
      { status: 404 }
    );
  }
  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return NextResponse.json({ error: "Token has expired!" }, { status: 404 });
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return NextResponse.json(
      { error: "Email does not exist!" },
      { status: 404 }
    );
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },

    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return NextResponse.json({ success: "Email verified!" }, { status: 200 });
}
