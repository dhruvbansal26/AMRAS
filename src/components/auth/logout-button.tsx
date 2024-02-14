"use client";
import React from "react";
import { Button } from "../ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
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
    <Button variant="outline" onClick={onClick} className="cursor-pointer">
      <ExitIcon className="mr-2" />
      {children}
    </Button>
  );
};
