import type { MainGuestData } from "../types";

export const emailService = {
  async sendQRCodes(
    mainGuest: MainGuestData,
    qrCodes: { name: string; qrImage: string }[]
  ): Promise<void> {
    // In production, this would call your email API
    // For now, this is a placeholder
    console.log("Sending QR codes to:", mainGuest.email);
    console.log("QR Codes:", qrCodes.length);

    // You can integrate with services like SendGrid, Mailgun, or AWS SES
    // Example structure:
    /*
    const emailData = {
      to: mainGuest.email,
      subject: "Your Event Access QR Codes",
      html: generateEmailHTML(qrCodes),
      attachments: qrCodes.map(qr => ({
        filename: `QR-${qr.name}.png`,
        content: qr.qrImage.split(',')[1],
        encoding: 'base64'
      }))
    };
    
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    });
    */
  },

  generateEmailHTML(qrCodes: { name: string; qrImage: string }[]): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            .qr-container { margin: 20px 0; text-align: center; }
            .qr-image { max-width: 300px; }
          </style>
        </head>
        <body>
          <h1>Your Event Access QR Codes</h1>
          <p>Please find your QR codes below. Save them for event entry.</p>
          ${qrCodes
            .map(
              (qr) => `
            <div class="qr-container">
              <h3>${qr.name}</h3>
              <img src="${qr.qrImage}" alt="QR Code for ${qr.name}" class="qr-image" />
            </div>
          `
            )
            .join("")}
        </body>
      </html>
    `;
  },
};
