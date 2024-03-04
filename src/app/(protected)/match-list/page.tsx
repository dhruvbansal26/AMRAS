"use client";
import React, { useEffect, useState } from "react";
import DistanceComponent from "../_components/distance-component";
import { PatientData } from "@/types";
import { ECMOMachineData } from "@/types";

const MatchList = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [ecmoMachines, setEcmoMachines] = useState<ECMOMachineData[]>([]);
  const [matchedEcmos, setMatchedEcmos] = useState<{
    [key: string]: ECMOMachineData[];
  }>({});

  useEffect(() => {
    const fetchPatientsAndEcmos = async () => {
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

      const matches: { [key: string]: ECMOMachineData[] } = {};
      patientsData.forEach((patient: PatientData) => {
        // Filter ECMO machines by matching types with the patient's required type
        matches[patient.id] = ecmosData.filter(
          (ecmoMachine: ECMOMachineData) =>
            ecmoMachine.type === patient.ecmoType
        );
      });

      setMatchedEcmos(matches);
    };

    fetchPatientsAndEcmos();
  }, []);

  return (
    <div>
      {patients.map((patient) => {
        const patientEcmos = matchedEcmos[patient.id];
        return (
          <div key={patient.id}>
            <h2>Patient: {patient.name}</h2>
            {patientEcmos && patientEcmos.length > 0 ? (
              patientEcmos.map((ecmoMachine) => (
                <div key={ecmoMachine.id}>
                  <h2>
                    ECMO Machine: {ecmoMachine.name} - Type: {ecmoMachine.type}
                  </h2>
                  <DistanceComponent
                    patientCoordinates={patient.coordinates}
                    ecmoCoordinates={ecmoMachine.coordinates}
                  />
                </div>
              ))
            ) : (
              <p>No matches found for required ECMO type.</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MatchList;
