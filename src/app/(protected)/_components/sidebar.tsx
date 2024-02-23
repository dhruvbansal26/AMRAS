"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import { useState, useEffect } from "react";
import {
  DoubleArrowRightIcon,
  DoubleArrowLeftIcon,
} from "@radix-ui/react-icons";
export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false); // State to manage sidebar collapse
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const pathname = usePathname();
  return (
    <>
      <nav
        className={`bg-secondary flex flex-col h-full ${
          isCollapsed ? "w-[75px]" : "w-[300px]"
        } items-center justify-between p-10`}
      >
        <div className="w-full flex flex-col items-center">
          <h3
            className={`text-4xl font-semibold text-black ${
              isCollapsed ? "hidden" : "block"
            }`}
          >
            CareConnect
          </h3>
          <Button
            variant="outline"
            onClick={toggleSidebar}
            className="bg-secondary text-black shadow-lg hover:bg-primary hover:text-white"
          >
            {isCollapsed ? (
              <DoubleArrowRightIcon></DoubleArrowRightIcon>
            ) : (
              <DoubleArrowLeftIcon></DoubleArrowLeftIcon>
            )}
          </Button>
        </div>
        <div
          className={`flex flex-col space-y-4 w-[80%] ${
            isCollapsed ? "hidden" : ""
          }`}
        >
          <Button
            asChild
            variant={pathname === "/dashboard" ? "default" : "outline"}
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/all-patients" ? "default" : "outline"}
          >
            <Link href="/all-patients">Patients</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/add-patient" ? "default" : "outline"}
          >
            <Link href="/add-patient">Add Patient</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/new-ecmo" ? "default" : "outline"}
          >
            <Link href="/new-ecmo">New ECMO</Link>
          </Button>
          <Button
            asChild
            variant={pathname === "/profile" ? "default" : "outline"}
          >
            <Link href="/profile">Profile</Link>
          </Button>
        </div>
        <div className={`justify-end ${isCollapsed ? "hidden" : ""}`}>
          <LogoutButton>Logout</LogoutButton>
        </div>
      </nav>
    </>
  );
};
