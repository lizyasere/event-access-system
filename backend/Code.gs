/**
 * Google Apps Script Backend for Event Access System
 * 30th Anniversary Celebration - QR Code Check-In System
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheets document
 * 2. Name it "Event Access System - 30th Anniversary"
 * 3. Open Extensions > Apps Script
 * 4. Copy this entire file into Code.gs
 * 5. Configure the SHEET_NAMES constant below
 * 6. Deploy as Web App:
 *    - Click Deploy > New Deployment
 *    - Select "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy
 * 7. Copy the Web App URL to your frontend config
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const SHEET_NAMES = {
  GUESTS: "Guests",
  CHECK_INS: "CheckIns",
  CONFIG: "Config"
};

const CONFIG = {
  BASE_URL: "https://cbcis30-invite.netlify.app",
  EMAIL_ENABLED: true,
  EVENT_NAME: "30th Anniversary Celebration",
  EVENT_HOST: "Calvary Bible Church",
  EVENT_DATE: "December 28, 2025 · 4:00 PM",
  EVENT_GATE_TIME: "Gate opens by 3:30 PM",
  EVENT_VENUE: "Plot A3C, Ikosi Road, Oregun, Ikeja, Lagos",
  EVENT_LOGO_URL: "https://cbcis30-invite.netlify.app/branding/cbc-logo.png",
  EVENT_BANNER_URL: "https://cbcis30-invite.netlify.app/branding/vip-banner.svg"
};

// ============================================================================
// INITIALIZATION
// ============================================================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Event System')
    .addItem('Setup Sheets', 'setupSheets')
    .addItem('Test Email', 'testEmail')
    .addSeparator()
    .addItem('Export Guests', 'exportGuests')
    .addToUi();
}

/**
 * Setup spreadsheet structure
 * Run this once after creating the script
 */
function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Guests Sheet
  let guestSheet = ss.getSheetByName(SHEET_NAMES.GUESTS);
  if (!guestSheet) {
    guestSheet = ss.insertSheet(SHEET_NAMES.GUESTS);
    guestSheet.getRange("A1:O1").setValues([[
      "ID", "Token", "Type", "Title", "First Name", "Surname", "Full Name",
      "Phone", "Email", "Church Name", "Position", "With Car", "Zone",
      "Registration Date", "Main Guest ID"
    ]]);
    guestSheet.getRange("A1:O1").setFontWeight("bold").setBackground("#FF6B35");
    guestSheet.setFrozenRows(1);
  }
  
  // Check-Ins Sheet
  let checkInSheet = ss.getSheetByName(SHEET_NAMES.CHECK_INS);
  if (!checkInSheet) {
    checkInSheet = ss.insertSheet(SHEET_NAMES.CHECK_INS);
    checkInSheet.getRange("A1:F1").setValues([[
      "Check-In ID", "Guest ID", "Guest Name", "Day", "Timestamp", "Scanner Name"
    ]]);
    checkInSheet.getRange("A1:F1").setFontWeight("bold").setBackground("#FF6B35");
    checkInSheet.setFrozenRows(1);
  }
  
  SpreadsheetApp.getUi().alert("Sheets setup complete!");
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a secure token
 */
function generateToken() {
  const timestamp = new Date().getTime();
  const random = Math.random().toString(36).substring(2, 15);
  return `TOK-${random}-${timestamp}`;
}

/**
 * Generate unique guest ID
 */
function generateGuestId(type) {
  const timestamp = Date.now();
  const prefix = type.substring(0, 3).toUpperCase();
  return `${prefix}-${timestamp}`;
}

/**
 * Determine guest type
 */
function determineGuestType(index, isSpouse) {
  if (index === 0) return "VIP";
  if (index === 1 && isSpouse) return "SPOUSE";
  if (index > 0 && index <= 2) return "PA";
  return "ASSOCIATE";
}

/**
 * Assign seating zone
 */
function assignSeatingZone(type) {
  switch (type) {
    case "VIP":
    case "SPOUSE":
      return "VIP Front Section";
    case "PA":
      return "Protocol Section";
    case "ASSOCIATE":
      return "Associate Section";
    default:
      return "General Section";
  }
}

/**
 * Get sheet by name, create if doesn't exist
 */
function getOrCreateSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    setupSheets();
    sheet = ss.getSheetByName(name);
  }
  return sheet;
}

// ============================================================================
// GUEST REGISTRATION
// ============================================================================

/**
 * Register new guests
 */
function registerGuests(data) {
  try {
    const guestSheet = getOrCreateSheet(SHEET_NAMES.GUESTS);
    const mainGuest = data.mainGuest;
    const associates = data.associates || [];
    const registrationDate = new Date().toISOString();
    const mainGuestId = generateGuestId("VIP");
    
    const guests = [];
    
    // Register main VIP guest
    const vipToken = generateToken();
    const vipFullName = `${mainGuest.title} ${mainGuest.firstName} ${mainGuest.surname}`;
    const vipZone = assignSeatingZone("VIP");
    
    guestSheet.appendRow([
      mainGuestId,
      vipToken,
      "VIP",
      mainGuest.title,
      mainGuest.firstName,
      mainGuest.surname,
      vipFullName,
      mainGuest.phone,
      mainGuest.email,
      mainGuest.churchName,
      mainGuest.position,
      mainGuest.withCar,
      vipZone,
      registrationDate,
      mainGuestId
    ]);
    
    guests.push({
      id: mainGuestId,
      token: vipToken,
      name: vipFullName,
      type: "VIP",
      qrData: {
        token: vipToken,
        checkInUrl: `${CONFIG.BASE_URL}/checkin/${vipToken}`
      }
    });
    
    // Register spouse if applicable
    if (mainGuest.withSpouse) {
      const spouseToken = generateToken();
      const spouseTitle = mainGuest.title === "Mr." ? "Mrs." : "Mr.";
      const spouseName = `${spouseTitle} ${mainGuest.surname} (Spouse)`;
      const spouseZone = assignSeatingZone("SPOUSE");
      
      const spouseId = generateGuestId("SPOUSE");
      guestSheet.appendRow([
        spouseId,
        spouseToken,
        "SPOUSE",
        spouseTitle,
        mainGuest.surname,
        "(Spouse)",
        spouseName,
        mainGuest.phone,
        mainGuest.email,
        mainGuest.churchName,
        "Spouse",
        mainGuest.withCar,
        spouseZone,
        registrationDate,
        mainGuestId
      ]);
      
      guests.push({
        id: spouseId,
        token: spouseToken,
        name: spouseName,
        type: "SPOUSE",
        qrData: {
          token: spouseToken,
          checkInUrl: `${CONFIG.BASE_URL}/checkin/${spouseToken}`
        }
      });
    }
    
    // Register associates
    associates.forEach((assoc, index) => {
      const assocToken = generateToken();
      const assocType = index === 0 && associates.length > 1 ? "PA" : "ASSOCIATE";
      const assocName = `${assoc.title} ${assoc.firstName} ${assoc.surname}`;
      const assocZone = assignSeatingZone(assocType);
      const assocId = generateGuestId(assocType);
      
      const associateEmail = assoc.email && assoc.email.length > 0 ? assoc.email : mainGuest.email;
      guestSheet.appendRow([
        assocId,
        assocToken,
        assocType,
        assoc.title,
        assoc.firstName,
        assoc.surname,
        assocName,
        assoc.phone,
        associateEmail,
        mainGuest.churchName,
        assocType === "PA" ? "Personal Assistant" : "Associate",
        assoc.withCar,
        assocZone,
        registrationDate,
        mainGuestId
      ]);
      
      guests.push({
        id: assocId,
        token: assocToken,
        name: assocName,
        type: assocType,
        qrData: {
          token: assocToken,
          checkInUrl: `${CONFIG.BASE_URL}/checkin/${assocToken}`
        }
      });
    });
    
    // Send email with QR codes
    if (CONFIG.EMAIL_ENABLED) {
      sendQRCodesEmail(mainGuest.email, vipFullName, guests);
    }
    
    return {
      success: true,
      message: "Registration successful",
      guests: guests
    };
    
  } catch (error) {
    Logger.log("Registration error: " + error.toString());
    return {
      success: false,
      message: "Registration failed: " + error.toString(),
      guests: []
    };
  }
}

// ============================================================================
// CHECK-IN MANAGEMENT
// ============================================================================

/**
 * Check-in a guest
 */
function checkInGuest(token, day, scannerName) {
  try {
    const guestSheet = getOrCreateSheet(SHEET_NAMES.GUESTS);
    const checkInSheet = getOrCreateSheet(SHEET_NAMES.CHECK_INS);
    
    // Find guest by token
    const guestData = guestSheet.getDataRange().getValues();
    let guestRow = null;
    let guestIndex = -1;
    
    for (let i = 1; i < guestData.length; i++) {
      if (guestData[i][1] === token) { // Column B is Token
        guestRow = guestData[i];
        guestIndex = i + 1;
        break;
      }
    }
    
    if (!guestRow) {
      return {
        success: false,
        message: "Invalid QR code. Guest not found.",
        guest: null,
        alreadyCheckedIn: false
      };
    }
    
    // Check if already checked in for this day
    const checkInData = checkInSheet.getDataRange().getValues();
    for (let i = 1; i < checkInData.length; i++) {
      if (checkInData[i][1] === guestRow[0] && checkInData[i][3] === day) {
        // Already checked in
        const guest = buildGuestObject(guestRow, checkInData, guestData);
        return {
          success: false,
          message: `Guest already checked in for ${day}`,
          guest: guest,
          alreadyCheckedIn: true
        };
      }
    }
    
    // Record check-in
    const checkInId = `CHK-${Date.now()}`;
    const timestamp = new Date().toISOString();
    checkInSheet.appendRow([
      checkInId,
      guestRow[0], // Guest ID
      guestRow[6], // Full Name
      day,
      timestamp,
      scannerName || "Unknown"
    ]);
    
    const guest = buildGuestObject(guestRow, checkInData, guestData);
    
    return {
      success: true,
      message: "Check-in successful",
      guest: guest,
      alreadyCheckedIn: false
    };
    
  } catch (error) {
    Logger.log("Check-in error: " + error.toString());
    return {
      success: false,
      message: "Check-in failed: " + error.toString(),
      guest: null,
      alreadyCheckedIn: false
    };
  }
}

/**
 * Build guest object from row data
 */
function buildGuestObject(guestRow, checkInData, guestSheetData) {
  const checkIns = [];
  
  // Get all check-ins for this guest
  for (let i = 1; i < checkInData.length; i++) {
    if (checkInData[i][1] === guestRow[0]) {
      checkIns.push({
        day: checkInData[i][3],
        timestamp: checkInData[i][4],
        scannerName: checkInData[i][5]
      });
    }
  }

  const mainGuestId = guestRow[14] || guestRow[0];
  let hostName = guestRow[6];
  let hostPhone = guestRow[7];
  let hostEmail = guestRow[8];

  if (guestSheetData && mainGuestId) {
    for (let i = 1; i < guestSheetData.length; i++) {
      if (guestSheetData[i][0] === mainGuestId) {
        hostName = guestSheetData[i][6];
        hostPhone = guestSheetData[i][7];
        hostEmail = guestSheetData[i][8];
        break;
      }
    }
  }
  
  return {
    id: guestRow[0],
    token: guestRow[1],
    type: guestRow[2],
    title: guestRow[3],
    firstName: guestRow[4],
    surname: guestRow[5],
    fullName: guestRow[6],
    phone: guestRow[7],
    email: guestRow[8],
    churchName: guestRow[9],
    position: guestRow[10],
    withCar: guestRow[11],
    zone: guestRow[12],
    registrationDate: guestRow[13],
    mainGuestId: mainGuestId,
    hostName: hostName,
    hostPhone: hostPhone,
    hostEmail: hostEmail,
    checkIns: checkIns
  };
}

/**
 * Get guest by token
 */
function getGuestByToken(token) {
  try {
    const guestSheet = getOrCreateSheet(SHEET_NAMES.GUESTS);
    const checkInSheet = getOrCreateSheet(SHEET_NAMES.CHECK_INS);
    
    const guestData = guestSheet.getDataRange().getValues();
    const checkInData = checkInSheet.getDataRange().getValues();
    
    for (let i = 1; i < guestData.length; i++) {
      if (guestData[i][1] === token) {
        return buildGuestObject(guestData[i], checkInData, guestData);
      }
    }
    
    return null;
  } catch (error) {
    Logger.log("Get guest error: " + error.toString());
    return null;
  }
}

// ============================================================================
// EMAIL SERVICE
// ============================================================================

/**
 * Send QR codes via email
 */
function sendQRCodesEmail(email, mainGuestName, guests) {
  try {
    const subject = "VIP Guest Logistics Guide - Calvary Bible Church";

    const passCards = guests.map(guest => {
      const passUrl = `${CONFIG.BASE_URL}/pass/${guest.token}`;
      const qrUrl = `https://chart.googleapis.com/chart?chs=420x420&cht=qr&chl=${encodeURIComponent(guest.qrData.checkInUrl)}&choe=UTF-8`;
      const guestType = guest.type === "VIP" ? "VIP Guest" : guest.type === "SPOUSE" ? "Spouse" : guest.type === "PA" ? "Personal Assistant" : "Associate";

      return `
        <div class="pass-card">
          <img class="pass-logo" src="${CONFIG.EVENT_LOGO_URL}" alt="${CONFIG.EVENT_HOST} logo" />
          <div class="pass-chip">${guestType}</div>
          <h3>${guest.name}</h3>
          <div class="pass-meta">
            <p>${CONFIG.EVENT_DATE}</p>
            <p>${CONFIG.EVENT_GATE_TIME}</p>
            <p>${CONFIG.EVENT_VENUE}</p>
          </div>
          <div class="pass-qr">
            <img src="${qrUrl}" alt="QR code for ${guest.name}" />
          </div>
          <a href="${passUrl}" class="pass-link">View & Download Full Pass</a>
        </div>
      `;
    }).join("\n");

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; color: #1f2937; }
          .wrapper { max-width: 640px; margin: 0 auto; padding: 32px 20px; }
          .hero { position: relative; border-radius: 28px; overflow: hidden; text-align: center; }
          .hero::after { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(15,23,42,0.92), rgba(76,29,149,0.85)); }
          .hero-overlay { position: relative; padding: 40px 32px; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 16px; }
          .hero-logo { width: 86px; height: 86px; border-radius: 24px; background: rgba(255,255,255,0.08); padding: 12px; object-fit: contain; border: 1px solid rgba(255,255,255,0.2); }
          .hero .eyebrow { text-transform: uppercase; letter-spacing: 0.4em; font-size: 12px; color: #fbbf24; margin-bottom: 12px; }
          .message { background: #ffffff; margin-top: 16px; padding: 28px; border-radius: 24px; line-height: 1.7; }
          .logistics h4 { margin-bottom: 4px; color: #c2410c; text-transform: uppercase; letter-spacing: 0.25em; font-size: 12px; }
          .logistics ul { padding-left: 18px; margin-top: 8px; margin-bottom: 16px; }
          .logistics li { margin-bottom: 6px; }
          .contact-card { background: #fffbeb; border: 1px solid #facc15; padding: 16px; border-radius: 16px; margin-top: 16px; font-weight: 600; }
          .pass-card { background: linear-gradient(135deg, #0f172a, #1e1b4b, #a21caf); color: #fff; border-radius: 32px; padding: 32px; margin-top: 24px; text-align: center; box-shadow: 0 20px 60px rgba(15, 23, 42, 0.35); position: relative; overflow: hidden; }
          .pass-card::after { content: ""; position: absolute; inset: 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; pointer-events: none; }
          .pass-card > * { position: relative; z-index: 1; }
          .pass-chip { display: inline-block; background: rgba(255,255,255,0.1); border-radius: 999px; padding: 6px 18px; letter-spacing: 0.3em; font-size: 11px; text-transform: uppercase; }
          .pass-logo { width: 60px; height: 60px; margin: 0 auto 12px; border-radius: 16px; background: rgba(255,255,255,0.08); padding: 10px; object-fit: contain; border: 1px solid rgba(255,255,255,0.2); }
          .pass-card h3 { font-size: 26px; margin: 16px 0 8px; }
          .pass-meta { font-size: 14px; line-height: 1.4; color: #e5e7eb; }
          .pass-qr { background: #fff; padding: 18px; border-radius: 24px; margin: 20px auto; width: fit-content; }
          .pass-qr img { width: 220px; height: 220px; display: block; }
          .pass-link { display: inline-block; margin-top: 8px; padding: 12px 24px; background: #f97316; color: #fff; text-decoration: none; border-radius: 999px; font-weight: 600; }
          .footer { text-align: center; margin-top: 28px; font-size: 12px; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="hero" style="background-image: url('${CONFIG.EVENT_BANNER_URL}'); background-size: cover; background-position: center;">
            <div class="hero-overlay">
              <img class="hero-logo" src="${CONFIG.EVENT_LOGO_URL}" alt="${CONFIG.EVENT_HOST} logo" />
              <p class="eyebrow">${CONFIG.EVENT_HOST}</p>
              <h1>VIP Guest Logistics Guide</h1>
              <p>${CONFIG.EVENT_NAME}</p>
            </div>
          </div>

          <div class="message">
            <p>Dear ${mainGuestName},</p>
            <p>We are delighted to welcome you as our VIP Guest at the Anniversary Celebration on December 28, at 4:00 PM prompt. Our team will be on ground from 3:30 PM to ensure a seamless and memorable experience. Kindly review the brief logistics below.</p>

            <div class="logistics">
              <h4>VIP Guest</h4>
              <ul>
                <li>E-Access Card: Attached for you and your listed associates/PA. Please present it (printed or digital) on arrival.</li>
                <li>Arrival & Drop-Off: Proceed to the main gate, present your E-Access Card, and you will be directed to the drop-off point. Our Protocol Team will escort you and your spouse to your seats.</li>
                <li>Parking: Your vehicle will be guided to the designated VIP parking area.</li>
              </ul>

              <h4>VIP Associates</h4>
              <ul>
                <li>Arrival & Entry: Associates should present their E-Access Cards at the main gate, park as directed, and receive wristbands from the Protocol Team.</li>
              </ul>
            </div>

            <div class="contact-card">
              For inquiries, please contact Mr. Femi Adelugba on 0803 451 3465 or Mr. Excellence Aliu on 0806 622 7712.
            </div>

            <p style="margin-top: 18px;">We look forward to receiving you.</p>
          </div>

          ${passCards}

          <p class="footer">${CONFIG.EVENT_HOST} Protocol Team · This is an automated email.</p>
        </div>
      </body>
      </html>
    `;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });

    Logger.log(`Email sent successfully to ${email}`);
    return true;

  } catch (error) {
    Logger.log(`Email send error: ${error.toString()}`);
    return false;
  }
}

/**
 * Test email function
 */
function testEmail() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('Test Email', 'Enter email address:', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() == ui.Button.OK) {
    const email = response.getResponseText();
    const testGuests = [{
      id: "TEST-001",
      token: "TOK-test-123",
      name: "Test Guest",
      type: "VIP",
      qrData: {
        token: "TOK-test-123",
        checkInUrl: `${CONFIG.BASE_URL}/checkin/TOK-test-123`
      }
    }];
    
    sendQRCodesEmail(email, "Test Guest", testGuests);
    ui.alert('Test email sent to ' + email);
  }
}

// ============================================================================
// WEB APP ENDPOINTS
// ============================================================================

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  const token = e.parameter.token;
  
  if (action === "getGuest" && token) {
    const guest = getGuestByToken(token);
    return ContentService
      .createTextOutput(JSON.stringify(guest))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ error: "Invalid request" }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    let response;
    
    if (action === "register") {
      response = registerGuests(data.data);
    } else if (action === "checkIn") {
      response = checkInGuest(data.token, data.day, data.scannerName);
    } else {
      response = { success: false, message: "Invalid action" };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    Logger.log("doPost error: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: "Server error: " + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================================================
// REPORTING FUNCTIONS
// ============================================================================

/**
 * Export guests to CSV
 */
function exportGuests() {
  const guestSheet = getOrCreateSheet(SHEET_NAMES.GUESTS);
  const data = guestSheet.getDataRange().getValues();
  
  // Create CSV content
  let csv = data.map(row => row.join(",")).join("\n");
  
  // Create blob and download
  const blob = Utilities.newBlob(csv, "text/csv", "guests_export.csv");
  DriveApp.createFile(blob);
  
  SpreadsheetApp.getUi().alert("Guests exported to your Google Drive as 'guests_export.csv'");
}
