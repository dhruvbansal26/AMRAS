import React from "react";
import { UserInfoCard } from "@/components/user-info";
import { auth } from "@/auth";

import { getUserById } from "@/data/user";
const ProfilePage = async () => {
  const session = await auth();
  const userId = session?.user.id;
  const user = await getUserById(userId || "");

  return (
    <>
      <UserInfoCard label="User Profile" user={user}></UserInfoCard>
    </>
  );
};

export default ProfilePage;
