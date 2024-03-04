"use client";
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { PatientData } from "@/types";
import PusherClient from "pusher-js";
import { BeatLoader } from "react-spinners";

const AllPatientsPage = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetch("/api/auth/patient")
      .then((res) => res.json())
      .then((data) => {
        setPatients(data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(() => {
        setLoading(false); // Ensure loading is set to false even if there is an error
      });

    // Initialize Pusher and subscribe to the channel
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: "us2",
      forceTLS: true,
    });
    const channel = pusher.subscribe("patient-channel");

    // Listen for updates from Pusher and update the state
    channel.bind(
      "patient-update",
      (data: { action: "add" | "remove"; patient: PatientData }) => {
        if (data.action === "add") {
          // Add the new patient to the state
          setPatients((currentPatients) => [...currentPatients, data.patient]);
        } else if (data.action === "remove") {
          // Check if there are any patients to remove from
          setPatients((currentPatients) => {
            // If the list is not empty, proceed with the removal
            if (currentPatients.length > 0) {
              return currentPatients.filter(
                (patient) => patient.id !== data.patient.id
              );
            }
            // If the list is empty, just return it as is
            return currentPatients;
          });
        } else if (data.action === "update") {
          // Update the patient in the state
          setPatients((currentPatients) => {
            return currentPatients.map((patient) => {
              if (patient.id === data.patient.id) {
                return data.patient;
              }
              return patient;
            });
          });
        }
      }
    );

    // Cleanup function to unsubscribe from the channel
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []); // Empty dependency array means this effect runs once on mount
  if (loading) {
    return (
      <>
        <BeatLoader></BeatLoader>
      </>
    ); // Display loading indicator
  }
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={patients} />
    </div>
  );
};

export default AllPatientsPage;
