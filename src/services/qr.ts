import QRCode from "qrcode";
import { API_CONFIG } from "../config/api";

export const qrService = {
  /**
   * Generate QR code image from secure token
   * QR contains only the pass URL, not guest data
   */
  async generateQRCodeImage(token: string): Promise<string> {
    try {
      // Use /pass/ instead of /checkin/ so guests see their pass, not the scanner
      const passUrl = `${API_CONFIG.CHECK_IN_BASE_URL}/pass/${token}`;
      
      const qrDataUrl = await QRCode.toDataURL(passUrl, {
        errorCorrectionLevel: "H", // High error correction for better scanning
        width: 500,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      return qrDataUrl;
    } catch (error) {
      console.error("QR Code generation failed:", error);
      throw error;
    }
  },

  /**
   * Generate QR codes for all guests in a registration
   */
  async generateQRCodesForGuests(
    guests: { id: string; token: string; name: string; type: string }[]
  ): Promise<{ name: string; qrImage: string; token: string }[]> {
    const qrCodes: { name: string; qrImage: string; token: string }[] = [];

    for (const guest of guests) {
      const qrImage = await this.generateQRCodeImage(guest.token);
      qrCodes.push({ 
        name: guest.name, 
        qrImage, 
        token: guest.token 
      });
    }

    return qrCodes;
  },

  /**
   * Parse scanned QR code URL to extract token
   * Supports both /pass/ and /checkin/ URLs for backwards compatibility
   */
  parseQRCodeUrl(url: string): string | null {
    try {
      // Match both /pass/ and /checkin/ URLs
      const match = url.match(/\/(pass|checkin)\/([a-zA-Z0-9-]+)/);
      return match ? match[2] : null;
    } catch {
      return null;
    }
  },
};
