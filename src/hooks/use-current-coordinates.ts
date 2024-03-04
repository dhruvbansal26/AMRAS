import { useSession } from "next-auth/react";
import { db } from "@/lib/db";
export const useCurrentCoordinates = async () => {
  const session = useSession();

  const hospitalId = session.data?.user.id;

  const hospital = await db.user.findUnique({
    where: { id: hospitalId },
  });

  const coordinates = hospital?.coordinates;

  return coordinates;
};
