"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@/components/auth/user-button";
export const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px]">
      <div className="flex gap-x-2">
        <Button
          asChild
          variant={pathname === "/settings" ? "default" : "outline"}
        >
          <Link href="/settings">Settings</Link>
        </Button>

        <Button
          asChild
          variant={pathname === "/profile" ? "default" : "outline"}
        >
          <Link href="/profile">Profile</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};
