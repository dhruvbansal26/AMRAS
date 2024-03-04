"use client";
import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SpecialCareCategory } from "@prisma/client";
import { ECMOType } from "@prisma/client";
import { PatientData } from "@/types";
import { CheckIcon } from "@radix-ui/react-icons";
import { Cross2Icon } from "@radix-ui/react-icons";

const handleClick = (patientId: string) => async () => {
  const res = await fetch(`/api/auth/patient`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json", // Set the Content-Type header
    },
    body: JSON.stringify({ id: patientId }), // Send the patientId in the request body
  });
  if (res.ok) {
    const data = await res.json();
    console.log(data.success);
  } else {
    // Handle errors or unsuccessful deletion
    console.error("Failed to remove patient");
  }
};
const formatEnumKey = (key: SpecialCareCategory) => {
  return key
    .toString()
    .toLowerCase()
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
    cell: ({ row, column, getValue }) => {
      const [editValue, setEditValue] = React.useState<string>(
        getValue() as string
      );
      const [isEditing, setIsEditing] = React.useState(false);

      const handleSave = async () => {
        const updatedPatient = {
          ...(row.original as PatientData),
          [column.id]: editValue,
        }; // Prepare the updated patient data
        // Call your API to update the patient data in the database
        const res = await fetch(`/api/auth/patient`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPatient),
        });

        if (res.ok) {
          setIsEditing(false); // Turn off editing mode
        } else {
          console.error("Failed to update patient data");
        }
      };

      return isEditing ? (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Input
            className="w-1/2 text-sm h-1/2"
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
    cell: ({ row, column, getValue }) => {
      const [editValue, setEditValue] = React.useState<number>(
        getValue() as number
      );
      const [isEditing, setIsEditing] = React.useState(false);

      const handleSave = async () => {
        const updatedPatient = {
          ...(row.original as PatientData),
          [column.id]: editValue,
        }; // Prepare the updated patient data
        // Call your API to update the patient data in the database
        const res = await fetch(`/api/auth/patient`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPatient),
        });

        if (res.ok) {
          setIsEditing(false); // Turn off editing mode
        } else {
          console.error("Failed to update patient data");
        }
      };

      return isEditing ? (
        <div className="flex flex-row items-center space-x-2">
          <Input
            className="w-20 h-8 border rounded"
            type="number"
            value={editValue}
            onChange={(e) => setEditValue(Number(e.target.value))}
            style={{ padding: "5px", fontSize: "1rem" }}
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
    cell: ({ row, getValue }) => {
      const initialEcmoValue = getValue() as ECMOType;
      const [editValue, setEditValue] = useState<ECMOType>(initialEcmoValue);
      const [isEditing, setIsEditing] = useState(false);

      const handleSave = async (newValue: ECMOType) => {
        const updatedPatient = { ...row.original, ecmoType: newValue };

        const res = await fetch(`/api/auth/patient`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPatient),
        });

        if (res.ok) {
          setIsEditing(false);
        } else {
          console.error("Failed to update patient's ECMO type");
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
    cell: ({ row, getValue, column }) => {
      const initialCareValue = getValue() as SpecialCareCategory;
      const [editValue, setEditValue] =
        useState<SpecialCareCategory>(initialCareValue);
      const [isEditing, setIsEditing] = useState(false);

      const handleSave = async (newValue: SpecialCareCategory) => {
        // Assuming row.original contains an `id` field for the patient
        const updatedPatient = { id: row.original.id, specialCare: newValue };

        const res = await fetch(`/api/auth/patient`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPatient),
        });

        if (res.ok) {
          setIsEditing(false); // Optionally refresh data or invalidate queries here
        } else {
          console.error("Failed to update patient special care");
          // Handle error (e.g., show a message to the user)
        }
      };
      const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newValue = e.target.value as SpecialCareCategory;
        setEditValue(newValue);
        handleSave(newValue); // Trigger save on change
      };
      return isEditing ? (
        <div>
          <select
            className="bg-slate-100 text-slate-900 border border-slate-300 rounded-md w-1/2 h-1/2"
            value={editValue}
            onChange={handleChange}
            style={{ padding: "5px" }}
            onBlur={() => setIsEditing(false)} // Close dropdown onBlur
          >
            {Object.values(SpecialCareCategory).map((value) => (
              <option key={value} value={value}>
                {formatEnumKey(value)}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div onClick={() => setIsEditing(true)}>
          {formatEnumKey(getValue() as SpecialCareCategory)}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Actions",
    cell: ({ row }) => {
      const patientId: string = row.getValue("id");
      // Pass both router and patientId to handleClick
      return (
        <Button size="sm" variant="outline" onClick={handleClick(patientId)}>
          Remove
        </Button>
      );
    },
  },
];
