// Zone-based seating assignment logic

export type GuestType = "VIP" | "SPOUSE" | "PA" | "ASSOCIATE";

export interface ZoneAssignment {
  zone: string;
  description: string;
  color: string;
}

/**
 * Determine seating zone based on guest type and relationship
 */
export function assignSeatingZone(guestType: GuestType): ZoneAssignment {
  switch (guestType) {
    case "VIP":
      return {
        zone: "VIP Front Section",
        description: "Reserved VIP seating at the front",
        color: "purple",
      };
    case "SPOUSE":
      return {
        zone: "VIP Front Section",
        description: "Seated with VIP guest",
        color: "purple",
      };
    case "PA":
      return {
        zone: "Protocol Section",
        description: "Personal Assistant seating area",
        color: "blue",
      };
    case "ASSOCIATE":
      return {
        zone: "Associate Section",
        description: "General associate seating",
        color: "green",
      };
    default:
      return {
        zone: "General Section",
        description: "General seating area",
        color: "gray",
      };
  }
}

/**
 * Get zone color class for styling
 */
export function getZoneColorClass(zone: string): string {
  if (zone.includes("VIP")) return "bg-purple-100 text-purple-800 border-purple-300";
  if (zone.includes("Protocol")) return "bg-blue-100 text-blue-800 border-blue-300";
  if (zone.includes("Associate")) return "bg-green-100 text-green-800 border-green-300";
  return "bg-gray-100 text-gray-800 border-gray-300";
}
