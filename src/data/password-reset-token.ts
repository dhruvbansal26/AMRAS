import { db } from "@/lib/db";

export const getPasswordResetTokebByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};

export const getPasswordResetTokebByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: { email: email },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
};
