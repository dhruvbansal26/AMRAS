// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { LoginSchema } from "@/schemas";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { signIn } from "@/auth";
import { redirect } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { generateTwoFactorToken } from "@/lib/tokens";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = LoginSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid Fields!" }, { status: 404 });
  }
  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return NextResponse.json(
      { error: "Email does not exist!" },
      { status: 404 }
    );
  }

  if (!existingUser.emailVerified) {
    const verification = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(verification.email, verification.token);

    return NextResponse.json(
      { success: "Confirmation Email sent!" },
      { status: 200 }
    );
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return NextResponse.json({ error: "Invalid code!" }, { status: 404 });
      }
      if (twoFactorToken.token !== code) {
        return NextResponse.json({ error: "Invalid code!" }, { status: 404 });
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return NextResponse.json({ error: "Code expired!" }, { status: 404 });
      }
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return NextResponse.json({ twoFactor: true });
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
    });
    redirect(DEFAULT_LOGIN_REDIRECT);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json(
            { error: "Invalid Credentials!" },
            { status: 404 }
          );
        default:
          return NextResponse.json(
            { error: "Something went wrong!" },
            { status: 404 }
          );
      }
    }
    throw error;
  }
}
