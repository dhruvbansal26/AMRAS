"use client";
interface PatientCardProps {
  id: string;
  name: string;
  age: number;
  score: number;
  specialCare: string;
  hospitalId: string;
  ecmoType: string | null;
}
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export const PatientCard = (patient: PatientCardProps) => {
  const router = useRouter();
  const handleClick = async () => {
    const response = await fetch("/api/auth/patient", {
      method: "DELETE",
      body: JSON.stringify({ id: patient.id }),
    });
    if (response.ok) {
      router.refresh();
    } else {
      console.log("Error deleting patient");
    }
  };

  return (
    <Card className="w-[550px] shadow-lg">
      <CardContent>
        <div
          key={patient.id}
          className="flex flex-row items-center space-y-4 space-x-4"
        >
          <p>{patient.name}</p>
          <p>{patient.age}</p>
          <p>{patient.specialCare}</p>
          <p>{patient.ecmoType}</p>
          <Button onClick={handleClick}>Remove</Button>
        </div>
      </CardContent>
    </Card>
  );
};
