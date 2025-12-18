import type { RegistrationFormData, APIResponse, CheckInRequest, CheckInResponse, GuestData } from "../types";
import { API_CONFIG } from "../config/api";

function generateMockToken(): string {
  return `TOK-${Math.random().toString(36).substring(2, 15)}-${Date.now()}`;
}


export const apiService = {
  /**
   * Register guests and get secure tokens
   */
  async registerGuests(data: RegistrationFormData): Promise<APIResponse> {
    if (API_CONFIG.DEV_MODE) {
      // Mock response for development
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      const guests: APIResponse["guests"] = [];
      
      // Main guest
      const vipToken = generateMockToken();
      const vipName = `${data.mainGuest.title} ${data.mainGuest.firstName} ${data.mainGuest.surname}`;
      guests.push({
        id: `VIP-${Date.now()}`,
        token: vipToken,
        name: vipName,
        type: "VIP",
        qrData: {
          token: vipToken,
          checkInUrl: `${API_CONFIG.CHECK_IN_BASE_URL}/checkin/${vipToken}`,
        },
      });

      // Spouse if applicable
      if (data.mainGuest.withSpouse) {
        const spouseToken = generateMockToken();
        const spouseName = `${data.mainGuest.title === "Mr." ? "Mrs." : "Mr."} ${data.mainGuest.surname} (Spouse)`;
        guests.push({
          id: `SPOUSE-${Date.now()}`,
          token: spouseToken,
          name: spouseName,
          type: "SPOUSE",
          qrData: {
            token: spouseToken,
            checkInUrl: `${API_CONFIG.CHECK_IN_BASE_URL}/checkin/${spouseToken}`,
          },
        });
      }

      // Associates
      data.associates.forEach((assoc, index) => {
        const token = generateMockToken();
        const name = `${assoc.title} ${assoc.firstName} ${assoc.surname}`;
        const type = index === 0 && data.associates.length > 1 ? "PA" : "ASSOCIATE";
        guests.push({
          id: `${type}-${Date.now()}-${index}`,
          token,
          name,
          type,
          qrData: {
            token,
            checkInUrl: `${API_CONFIG.CHECK_IN_BASE_URL}/checkin/${token}`,
          },
        });
      });

      return {
        success: true,
        message: "Registration successful",
        guests,
      };
    }

    // Production: Call Google Apps Script
    const response = await fetch(API_CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        data,
      }),
    });

    if (!response.ok) {
      throw new Error("Registration failed");
    }

    return response.json();
  },

  /**
   * Check-in a guest by token
   */
  async checkInGuest(request: CheckInRequest): Promise<CheckInResponse> {
    if (API_CONFIG.DEV_MODE) {
      // Mock check-in for development
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockGuest: GuestData = {
        id: "VIP-001",
        token: request.token,
        type: "VIP",
        title: "Dr.",
        firstName: "John",
        surname: "Doe",
        fullName: "Dr. John Doe",
        phone: "+2348012345678",
        email: "john.doe@example.com",
        churchName: "Grace Chapel",
        position: "Senior Pastor",
        withCar: true,
        zone: "VIP Front Section",
        registrationDate: new Date().toISOString(),
        checkIns: [
          {
            day: request.day,
            timestamp: new Date().toISOString(),
            scannerName: request.scannerName,
          },
        ],
      };

      // Simulate already checked in scenario (10% of the time)
      if (Math.random() < 0.1) {
        return {
          success: false,
          message: `Guest already checked in for ${request.day}`,
          guest: mockGuest,
          alreadyCheckedIn: true,
        };
      }

      return {
        success: true,
        message: "Check-in successful",
        guest: mockGuest,
        alreadyCheckedIn: false,
      };
    }

    // Production: Call Google Apps Script
    const response = await fetch(API_CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkIn",
        ...request,
      }),
    });

    if (!response.ok) {
      throw new Error("Check-in failed");
    }

    return response.json();
  },

  /**
   * Fetch guest details by token (for scanner preview)
   */
  async getGuestByToken(token: string): Promise<GuestData | null> {
    if (API_CONFIG.DEV_MODE) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      return {
        id: "VIP-001",
        token,
        type: "VIP",
        title: "Dr.",
        firstName: "John",
        surname: "Doe",
        fullName: "Dr. John Doe",
        phone: "+2348012345678",
        email: "john.doe@example.com",
        churchName: "Grace Chapel",
        position: "Senior Pastor",
        withCar: true,
        zone: "VIP Front Section",
        registrationDate: new Date().toISOString(),
        checkIns: [],
      };
    }

    const response = await fetch(`${API_CONFIG.APPS_SCRIPT_URL}?action=getGuest&token=${token}`);
    
    if (!response.ok) {
      return null;
    }

    return response.json();
  },
};
