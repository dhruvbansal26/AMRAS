import { NextResponse } from "next/server";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokebByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
export async function POST(req: Request) {
  const body = await req.json();
  const token = body.token;

  if (!token) {
    return NextResponse.json({ error: "Missing token!" }, { status: 404 });
  }

  const validatedFields = NewPasswordSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid password!" }, { status: 404 });
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokebByToken(token);
  if (!existingToken) {
    return NextResponse.json({ error: "Invalid token!" }, { status: 404 });
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

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return NextResponse.json({ success: "Password updated!" }, { status: 200 });
}
