import { SpecialCareCategory } from "@prisma/client";
import { ECMOType } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

export interface PatientData {
  id: string;
  name: string;
  age: number;
  score: number;
  specialCare: SpecialCareCategory; // Assuming you have this enum defined elsewhere
  hospitalId: string;
  ecmoType: ECMOType | null; // Assuming ECMOType is an enum defined elsewhere
  coordinates: JsonValue; // Define this based on your needs, could be an object with latitude and longitude, for example
  [key: string]: any; // This allows indexing with any string key
}

export interface ECMOMachineData {
  id: string;
  model: string;
  serial: string;
  inUse: boolean;
  isMatched: boolean;
  type: ECMOType;
  hospitalId: string;
  coordinates: JsonValue; // Define this based on your needs, could be an object with latitude and longitude, for example
  [key: string]: any; // This allows indexing with any string key
}
