import React from "react";
import { UserInfoCard } from "@/components/user-info";
import { auth } from "@/auth";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user;
  return (
    <div>
      <UserInfoCard label="User Profile" user={user}></UserInfoCard>
    </div>
  );
};

export default ProfilePage;
