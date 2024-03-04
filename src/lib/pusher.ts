import PusherServer from "pusher";
import PusherClient from "pusher-js";
import { PatientData } from "@/types";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || "",
  secret: process.env.PUSHER_APP_SECRET || "",
  cluster: process.env.PUSHER_APP_CLUSTER || "",
  useTLS: true,
});

// Modify the function to accept an action type
export async function handlePatientUpdate(
  action: "add" | "remove" | "update",
  patientData: PatientData
) {
  pusherServer.trigger("patient-channel", "patient-update", {
    action, // 'add' or 'remove'
    patient: patientData, // Rename 'newPatient' to 'patient' for clarity
  });
}
