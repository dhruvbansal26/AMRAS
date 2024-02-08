"use client";
import { LogoutButton } from "@/components/auth/logout-button";
import { useCurrentUser } from "@/hooks/use-current-user";
const SettingsPage = () => {
  const onClick = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
  };
  const user = useCurrentUser();

  return (
    <div className="bg-black text-white text-sm p-2 rounded-md">
      {/* <div>{JSON.stringify(user)}</div> */}
      <button onClick={onClick} type="submit">
        Logout
      </button>
    </div>
  );
};

export default SettingsPage;
