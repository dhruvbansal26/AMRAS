"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaUser } from "react-icons/fa";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";

export const UserButton = () => {
  const user = useCurrentUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-gray-500 outline-none hover:outline-none">
            <FaUser className="text-black" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="font-semibold m-4 mt-0 shadow-md rounded-md pt-2 pb-2 p-4 bg-white text-black text-sm"
        align="end"
      >
        <LogoutButton>
          <DropdownMenuItem className="outline outline-none hover:outline-none">
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
