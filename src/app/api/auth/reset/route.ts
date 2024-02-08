import { NextResponse } from "next/server";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export async function POST(req: Request) {
  const body = await req.json();

  const validatedFields = ResetSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid email!" }, { status: 404 });
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return NextResponse.json({ error: "Email not found!" }, { status: 404 });
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return NextResponse.json({ success: "Reset email sent!" }, { status: 200 });
}
