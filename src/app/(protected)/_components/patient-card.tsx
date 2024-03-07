"use client";
import React from "react";
import { PersonIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DistanceComponent from "./distance-component";

interface PatientCardProps {
  patientName?: string;
  patientId?: string;
  ecmoType?: string;
  patientCoordinates?: any;
  ecmoCoordinates?: any;
  errorMessage?: string;
}

const PatientCard = (props: PatientCardProps) => {
  if (props.errorMessage) {
    return (
      <Card key={props.patientId}>
        <CardContent className="flex flex-col items-center justify-center">
          <PersonIcon />
          <h1>{props.patientName}</h1>
          <h1>{props.errorMessage}</h1>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card key={props.patientId}>
        <CardContent className="flex flex-row items-center space-x-4 justify-center">
          <PersonIcon />
          <h1>{props.patientName}</h1>
          <p>{props.ecmoType}</p>
          <DistanceComponent
            patientCoordinates={props.patientCoordinates}
            ecmoCoordinates={props.ecmoCoordinates}
          />{" "}
        </CardContent>
      </Card>
    </>
  );
};

export default PatientCard;
