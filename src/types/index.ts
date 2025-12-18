import { z } from "zod";

export const mainGuestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format"),
  email: z.string().email("Invalid email address"),
  churchName: z.string().min(2, "Church name is required"),
  position: z.string().min(2, "Position is required"),
  withSpouse: z.boolean().default(false),
  withCar: z.boolean().default(false),
  numAssociates: z.number().min(0).max(10, "Maximum 10 associates allowed"),
});

export const associateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  surname: z.string().min(2, "Surname required"),
  firstName: z.string().min(2, "First name required"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
  withCar: z.boolean().default(false),
});

export const registrationSchema = z.object({
  mainGuest: mainGuestSchema,
  associates: z.array(associateSchema),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type RegistrationFormInput = z.input<typeof registrationSchema>;
export type MainGuestData = z.infer<typeof mainGuestSchema>;
export type AssociateData = z.infer<typeof associateSchema>;

export interface QRCodeData {
  token: string; // Secure token, not raw data
  checkInUrl: string; // Full URL for scanning
}

export interface GuestData {
  id: string;
  token: string;
  type: "VIP" | "SPOUSE" | "PA" | "ASSOCIATE";
  title: string;
  firstName: string;
  surname: string;
  fullName: string;
  phone: string;
  email: string;
  churchName?: string;
  position?: string;
  withCar: boolean;
  zone: string;
  registrationDate: string;
  checkIns: {
    day: string;
    timestamp: string;
    scannerName?: string;
  }[];
}

export interface APIResponse {
  success: boolean;
  message: string;
  guests: {
    id: string;
    token: string;
    name: string;
    type: "VIP" | "SPOUSE" | "PA" | "ASSOCIATE";
    qrData: QRCodeData;
  }[];
}

export interface CheckInRequest {
  token: string;
  day: string;
  scannerName?: string;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  guest?: GuestData;
  alreadyCheckedIn?: boolean;
}
