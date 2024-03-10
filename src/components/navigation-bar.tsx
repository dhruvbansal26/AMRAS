import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "./ui/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signIn, useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";

const Navbar = () => {
  return (
    <header>
      <nav>
        <ul className="flex items-center justify-between">
          <li className="flex flex-row">
            <Link className="gap-2 p-6" href="/">
              <h1 className="text-2xl font-bold leading-7">CareConnect</h1>
            </Link>
          </li>
          <div className="ml-auto flex flex-row gap-2 mr-5">
            <li>
              <Button>About</Button>
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
