import React from "react";
import { UserInfoCard } from "@/components/user-info";
import { auth } from "@/auth";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <>
      <UserInfoCard label="User Profile" user={user}></UserInfoCard>
    </>
  );
};

export default ProfilePage;
