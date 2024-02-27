"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const handleClick = (patientId: string) => async () => {
  const router = useRouter();
  const res = await fetch(`/api/auth/patient`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Set the Content-Type header
    },
    body: JSON.stringify({ id: patientId }), // Send the patientId in the request body
  });
  if (res.ok) {
    router.refresh(); // Refresh the page
    console.log("Patient removed");
  } else {
    // Handle errors or unsuccessful deletion
    console.error("Failed to remove patient");
  }
};

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    accessorKey: "ecmoType",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          EMCO Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const specialCareValue: any = getValue(); // Get the current value
      // Transform the value: to lowercase, replace underscores with spaces, and capitalize the first letter of each word
      const formattedValue = specialCareValue
        .toLowerCase()
        .replace(/_/g, " ")
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return <span className="items-center">{formattedValue}</span>;
    },
  },
  {
    accessorKey: "specialCare",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Special Care
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const specialCareValue: any = getValue(); // Get the current value
      // Transform the value: to lowercase, replace underscores with spaces, and capitalize the first letter of each word
      const formattedValue = specialCareValue
        .toLowerCase()
        .replace(/_/g, " ")
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      return <span>{formattedValue}</span>;
    },
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => {
      const patientId: string = row.getValue("id");
      // Pass both router and patientId to handleClick
      return <Button onClick={handleClick(patientId)}>Remove</Button>;
    },
  },
];
