// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextResponse } from "next/server";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/data/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedFields = LoginSchema.safeParse(body);

  if (!validatedFields.success) {
    return NextResponse.json({ error: "Invalid Fields!" }, { status: 404 });
  }
  const { email, password } = validatedFields.data;

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

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
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
