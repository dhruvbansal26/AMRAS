"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <>
      <nav className="bg-secondary flex flex-col h-full w-[300px] items-center justify-between p-10">
        <div className="">
          <h3 className="text-4xl font-semibold text-black">CareConnect</h3>
        </div>
        <div className="flex flex-col space-y-4 w-[80%]">
          <Button
            asChild
            variant={pathname === "/dashboard" ? "default" : "outline"}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button asChild variant={pathname === "/" ? "default" : "outline"}>
            <Link href="/dashboard">Add Patient</Link>
          </Button>
          <Button asChild variant={pathname === "/" ? "default" : "outline"}>
            <Link href="/dashboard">New ECMO</Link>
          </Button>

          <Button
            asChild
            variant={pathname === "/profile" ? "default" : "outline"}
          >
            <Link href="/profile">Profile</Link>
          </Button>
        </div>
        <div className="justify-end">
          <LogoutButton>Logout</LogoutButton>
        </div>
      </nav>
    </>
  );
};
