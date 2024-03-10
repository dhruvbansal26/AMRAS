"use client";
import React, { useEffect, useState } from "react";
import { PatientData, ECMOMachineData } from "@/types";
import PusherClient from "pusher-js";
import PatientCard from "../_components/patient-card";
import { BeatLoader } from "react-spinners";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DistanceComponent from "../_components/distance-component";
import { calculateDistanceAndDuration } from "../_components/calculate-distance";

// Define the type for the matches object
interface Matches {
  [key: string]: ECMOMachineData[];
}

const MatchList = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [ecmoMachines, setEcmoMachines] = useState<ECMOMachineData[]>([]);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  const [matchedEcmos, setMatchedEcmos] = useState<{
    [key: string]: ECMOMachineData[];
  }>({});
  useEffect(() => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: "us2",
      forceTLS: true,
    });
    const channel = pusher.subscribe("queue-channel");

    channel.bind("queue-update", () => {
      fetchPatientsAndEcmos();
    });

    return () => {
      channel.unbind("queue-update");
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchPatientsAndEcmos();
  }, []);

  const fetchPatientsAndEcmos = async () => {
    setIsLoading(true); // Start loading

    const patientsResponse = await fetch("/api/auth/get-patients", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const patientsData = await patientsResponse.json();
    const ecmosResponse = await fetch("/api/auth/get-ecmos", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const ecmosData = await ecmosResponse.json();

    setPatients(patientsData);
    setEcmoMachines(ecmosData);

    let matches: Matches = {};
    let updatedEcmosData = [...ecmosData]; // Clone the ecmoData array to manage state locally

    patientsData.forEach((patient: PatientData) => {
      let matchFound = false;

      for (let ecmoMachine of updatedEcmosData) {
        if (
          ecmoMachine.type === patient.ecmoType &&
          !ecmoMachine.isMatched &&
          !ecmoMachine.inUse
        ) {
          // Update the matched status immediately for subsequent iterations
          ecmoMachine.isMatched = true;
          matchFound = true;
          matches[patient.id] = [ecmoMachine];
          break; // Exit loop after finding a match
        }
      }

      if (!matchFound) {
        matches[patient.id] = []; // Assign an empty array if no match found
      }
    });

    setIsLoading(false); // Start loading
    setEcmoMachines(updatedEcmosData); // Update global state with new matched statuses
    setMatchedEcmos(matches);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <BeatLoader color="#1E40AF" />
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableCaption>
          A list of matched ECMO machines to patients.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Patient Name</TableHead>
            <TableHead className="w-1/3">ECMO Type</TableHead>
            <TableHead className="text-right w-1/3">Machine Info</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const patientEcmos = matchedEcmos[patient.id] || [];

            return patientEcmos.length > 0 ? (
              patientEcmos.map((ecmoMachine, index) => (
                <TableRow key={index}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.ecmoType}</TableCell>
                  <TableCell className="text-center w-full">
                    <DistanceComponent
                      patientCoordinates={patient.coordinates}
                      ecmoCoordinates={ecmoMachine.coordinates}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key={`no-match-${patient.id}`}>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.ecmoType}</TableCell>
                <TableCell className="text-right">No matches found</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatchList;
