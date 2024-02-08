"use client";
import React from "react";
interface LogoutButtonProps {
  children: React.ReactNode;
}
import { useRouter } from "next/navigation";

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const router = useRouter();
  const onClick = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
