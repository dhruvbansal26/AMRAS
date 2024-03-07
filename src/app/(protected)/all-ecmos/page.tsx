"use client";
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import { DataTableECMO } from "./data-table";
import { columns } from "./columns";
import { ECMOMachineData } from "@/types";
import PusherClient from "pusher-js";
import { BeatLoader } from "react-spinners";

const AllECMOsPage = () => {
  const [ECMOs, setECMOs] = useState<ECMOMachineData[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    fetch("/api/auth/ecmo")
      .then((res) => res.json())
      .then((data) => {
        setECMOs(data);
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
    const channel = pusher.subscribe("ecmo-channel");

    // Listen for updates from Pusher and update the state
    channel.bind(
      "ecmo-update",
      (data: {
        action: "add" | "remove" | "update";
        ecmoMachine: ECMOMachineData;
      }) => {
        if (data.action === "add") {
          // Add the new patient to the state
          setECMOs((currentECMOs) => [...currentECMOs, data.ecmoMachine]);
        } else if (data.action === "remove") {
          // Check if there are any patients to remove from
          setECMOs((currentPatients) => {
            // If the list is not empty, proceed with the removal
            if (currentPatients.length > 0) {
              return currentPatients.filter(
                (patient) => patient.id !== data.ecmoMachine.id
              );
            }
            // If the list is empty, just return it as is
            return currentPatients;
          });
        } else if (data.action === "update") {
          // Update the patient in the state
          setECMOs((currentPatients) => {
            return currentPatients.map((patient) => {
              if (patient.id === data.ecmoMachine.id) {
                return data.ecmoMachine;
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
      <DataTableECMO columns={columns} data={ECMOs} />
    </div>
  );
};

export default AllECMOsPage;
