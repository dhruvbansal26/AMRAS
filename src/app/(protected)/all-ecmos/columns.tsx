"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ECMOMachine } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ECMOType } from "@prisma/client";
import { ECMOMachineData } from "@/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { Cross2Icon } from "@radix-ui/react-icons";

const handleClick = (ecmoId: string) => async () => {
  const res = await fetch(`/api/auth/ecmo`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Set the Content-Type header
    },
    body: JSON.stringify({ id: ecmoId }), // Send the patientId in the request body
  });
  if (res.ok) {
    const data = await res.json();
    console.log(data.success);
  } else {
    // Handle errors or unsuccessful deletion
    console.error("Failed to remove ECMO");
  }
};

export const columns: ColumnDef<ECMOMachine>[] = [
  {
    accessorKey: "model",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Model
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, column, getValue }) => {
      const [editValue, setEditValue] = React.useState<string>(
        getValue() as string
      );
      const [isEditing, setIsEditing] = React.useState(false);

      const handleSave = async () => {
        const updatedMachine = {
          ...(row.original as ECMOMachineData),
          [column.id]: editValue,
        }; // Prepare the updated patient data
        // Call your API to update the patient data in the database
        const res = await fetch(`/api/auth/ecmo`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMachine),
        });

        if (res.ok) {
          setIsEditing(false); // Turn off editing mode
        } else {
          console.error("Failed to update ECMO data");
        }
      };

      return isEditing ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Input
            className="w-[120px] text-sm h-1/2"
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <Button
            size="sm"
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={handleSave}
          >
            <CheckIcon />
          </Button>
          <Button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            <Cross2Icon />
          </Button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {getValue() as React.ReactNode}
        </div>
      );
    },
  },
  {
    accessorKey: "serial",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Serial
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row, column, getValue }) => {
      const [editValue, setEditValue] = React.useState<string>(
        getValue() as string
      );
      const [isEditing, setIsEditing] = React.useState(false);

      const handleSave = async () => {
        const updatedMachine = {
          ...(row.original as ECMOMachineData),
          [column.id]: editValue,
        }; // Prepare the updated patient data
        // Call your API to update the patient data in the database
        const res = await fetch(`/api/auth/ecmo`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMachine),
        });

        if (res.ok) {
          setIsEditing(false); // Turn off editing mode
        } else {
          console.error("Failed to update ECMO data");
        }
      };

      return isEditing ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Input
            className="w-[120px] text-sm h-1/2"
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <Button
            size="sm"
            className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
            onClick={handleSave}
          >
            <CheckIcon />
          </Button>
          <Button
            className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            <Cross2Icon />
          </Button>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {getValue() as React.ReactNode}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
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
    cell: ({ row, getValue }) => {
      const initialEcmoValue = getValue() as ECMOType;
      const [editValue, setEditValue] = useState<ECMOType>(initialEcmoValue);
      const [isEditing, setIsEditing] = useState(false);

      const handleSave = async (newValue: ECMOType) => {
        const updatedECMO = { ...row.original, type: newValue };

        const res = await fetch(`/api/auth/ecmo`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedECMO),
        });

        if (res.ok) {
          setIsEditing(false);
        } else {
          console.error("Failed to update ECMO type");
        }
      };

      return isEditing ? (
        <div>
          <select
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value as ECMOType);
              handleSave(e.target.value as ECMOType);
            }}
            onBlur={() => setIsEditing(false)}
            style={{
              padding: "5px",
            }}
            className="bg-slate-100 text-slate-900 border border-slate-300 rounded-md w-1/2 h-1/2"
          >
            {Object.values(ECMOType).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {initialEcmoValue ? initialEcmoValue : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "inUse",
    header: "In Use",
    cell: ({ row, getValue }) => {
      const initialInUseValue = getValue() as boolean;
      const [editValue, setEditValue] = useState<boolean>(initialInUseValue);
      const [isEditing, setIsEditing] = useState(false);

      const handleSave = async (newValue: boolean) => {
        const updatedECMO = { ...row.original, inUse: newValue };

        const res = await fetch(`/api/auth/ecmo`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedECMO),
        });

        if (res.ok) {
          setIsEditing(false);
        } else {
          console.error("Failed to update ECMO in use status");
        }
      };

      return isEditing ? (
        <div>
          <select
            value={editValue ? "true" : "false"}
            onChange={(e) => {
              setEditValue(e.target.value === "true");
              handleSave(e.target.value === "true");
            }}
            onBlur={() => setIsEditing(false)}
            style={{
              padding: "5px",
            }}
            className="bg-slate-100 text-slate-900 border border-slate-300 rounded-md w-1/2 h-1/2"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {initialInUseValue ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => {
      const ecmoId: string = row.getValue("id");
      // Pass both router and ecmoId to handleClick
      return (
        <Button size="sm" variant="outline" onClick={handleClick(ecmoId)}>
          Remove
        </Button>
      );
    },
  },
];
