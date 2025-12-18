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
  BASE_URL: "YOUR_FRONTEND_URL", // Replace with your deployed frontend URL
  EMAIL_ENABLED: true,
  EVENT_NAME: "30th Anniversary Celebration"
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
      
      guestSheet.appendRow([
        assocId,
        assocToken,
        assocType,
        assoc.title,
        assoc.firstName,
        assoc.surname,
        assocName,
        assoc.phone,
        mainGuest.email, // Use main guest's email
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
        const guest = buildGuestObject(guestRow, checkInData);
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
    
    const guest = buildGuestObject(guestRow, checkInSheet.getDataRange().getValues());
    
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
function buildGuestObject(guestRow, checkInData) {
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
    
    for (let i = 1; i < guestData.length; i++) {
      if (guestData[i][1] === token) {
        return buildGuestObject(guestData[i], checkInSheet.getDataRange().getValues());
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
    const subject = `${CONFIG.EVENT_NAME} - Your QR Codes`;
    
    let htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .qr-container { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; text-align: center; border: 2px solid #FF6B35; }
          .qr-title { font-size: 18px; font-weight: bold; color: #FF6B35; margin-bottom: 10px; }
          .qr-link { display: inline-block; background: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
          .instructions { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${CONFIG.EVENT_NAME}</h1>
            <p>Your Event Access QR Codes</p>
          </div>
          <div class="content">
            <p>Dear ${mainGuestName},</p>
            <p>Thank you for registering for the ${CONFIG.EVENT_NAME}. Your QR codes are ready!</p>
            
            <div class="instructions">
              <strong>Important Instructions:</strong>
              <ul>
                <li>Each person has their own unique QR code</li>
                <li>Save these links or take screenshots</li>
                <li>Present your QR code at the venue entrance</li>
                <li>QR codes are valid for all event days</li>
              </ul>
            </div>
    `;
    
    guests.forEach(guest => {
      htmlBody += `
        <div class="qr-container">
          <div class="qr-title">${guest.name}</div>
          <p><strong>Guest Type:</strong> ${guest.type}</p>
          <a href="${guest.qrData.checkInUrl}" class="qr-link">Open QR Code</a>
          <p style="font-size: 11px; color: #666; margin-top: 10px;">
            Link: ${guest.qrData.checkInUrl}
          </p>
        </div>
      `;
    });
    
    htmlBody += `
            <p style="margin-top: 30px;">We look forward to seeing you at the celebration!</p>
            <div class="footer">
              <p>${CONFIG.EVENT_NAME}</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
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
