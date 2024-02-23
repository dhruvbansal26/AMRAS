import * as z from "zod";
const ECMOType = z.enum(["PULMONARY", "CARDIAC", "ECPR"], {
  errorMap: (issue, ctx) => ({ message: "Inavlid ECMO type" }),
});
const SpecialCareCategory = z.enum(
  [
    "PEDIATRIC",
    "FIRST_RESPONDERS",
    "SINGLE_CARETAKERS",
    "PREGNANT_PATIENTS",
    "SHORT_TERM_SURVIVAL",
  ],
  {
    errorMap: (issue, ctx) => ({ message: "Invalid category" }),
  }
);

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required" }),
  code: z.optional(z.string()),
});
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimum 6 characters required" }),
});
export const MapSchema = z.object({
  location: z
    .string()
    .min(1, { message: "Minimum 1 character required" })
    .max(100),
});
export const NewEcmoSchema = z.object({
  model: z.string().min(1, { message: "Minimum 1 character required" }).max(30),
  serial: z
    .string()
    .min(1, { message: "Minimum 1 character required" })
    .max(30),
  type: ECMOType,
  hospitalId: z
    .string()
    .min(1, { message: "Minimum 1 character required" })
    .max(100),
  inUse: z.boolean(),
});

export const NewPatientSchema = z.object({
  name: z.string().min(1, { message: "Minimum 1 character required" }).max(30),
  age: z.number().min(1).max(100),
  specialCare: SpecialCareCategory,
  hospitalId: z
    .string()
    .min(1, { message: "Minimum 1 character required" })
    .max(100),
  ecmoType: ECMOType.optional(), // Make this optional to match the Prisma schema
});
export const LocationSchema = z.object({
  location: z.string().min(1, { message: "Minimum 1 character required" }),
});
