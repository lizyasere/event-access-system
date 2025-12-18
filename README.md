# 🎉 Event Access System - 30th Anniversary Celebration

A complete QR-code-based invited-guest registration and check-in system built for church anniversary celebrations and formal events.

![Tech Stack](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## ✨ Features

### For Guests:
- ✅ **Elegant Registration Form** - VIP guests register with associates/spouse
- 📧 **Automatic QR Code Delivery** - Unique QR codes sent via email
- 📱 **Mobile-Friendly** - Works seamlessly on all devices
- 👥 **Multi-Guest Support** - Register spouse, PA, and associates (up to 10)
- 🎨 **Beautiful UI** - Orange & white theme, production-ready design

### For Protocol Officers:
- 📸 **Mobile QR Scanner** - Real-time scanning with device camera
- ✅ **Instant Verification** - Guest details displayed immediately
- 🚫 **Duplicate Prevention** - Prevents multiple check-ins per day
- 🗓️ **Multi-Day Support** - Track attendance across multiple days
- 🎯 **Zone-Based Seating** - Automatic seating assignments
- 📊 **Check-In History** - View all past check-ins

### Technical Features:
- 🔐 **Secure Tokens** - QR codes contain secure tokens, not raw data
- 📊 **Google Sheets Backend** - Data stored in your Google Drive
- 🚀 **No Complex Infrastructure** - Simple Apps Script backend
- 📈 **Real-Time Updates** - Instant synchronization
- 💾 **Automatic Backups** - Google Sheets handles data safety

## 🏗️ Architecture

```
Frontend (React + Vite)
        ↓
    QR Codes
        ↓
Google Apps Script (Backend)
        ↓
   Google Sheets (Database)
```

## 🎯 Business Rules

### Guest Types:
- **VIP** - Main invited guest → VIP Front Section
- **SPOUSE** - VIP spouse → VIP Front Section (seated together)
- **PA** - Personal Assistant → Protocol Section
- **ASSOCIATE** - Other associates → Associate Section

### QR Code Logic:
- Each person gets their own unique QR code
- QR encodes a secure token (not guest data)
- Format: `https://your-site.com/checkin/{token}`
- Tokens are random, unique, and non-guessable

### Check-In Rules:
- **One scan per guest per day**
- **Multi-day event support** (Day 1, Day 2, etc.)
- **Duplicate prevention** - Shows warning if already checked in
- **Check-in history** - View all past scans

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Google account
- Modern web browser

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo>
   cd event-access-system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set `VITE_DEV_MODE=true` for testing

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:5173
   ```

## 📱 Usage

### For Event Organizers:

1. **Setup Backend** (one-time):
   - Follow [`backend/SETUP_GUIDE.md`](backend/SETUP_GUIDE.md)
   - Takes about 30 minutes

2. **Deploy Frontend**:
   - Follow [`DEPLOYMENT.md`](DEPLOYMENT.md)
   - Recommended: Netlify (5 minutes)

3. **Test End-to-End**:
   - Register a test guest
   - Check email for QR codes
   - Scan QR code at `/scan`
   - Verify check-in in Google Sheets

### For Protocol Officers (Event Day):

1. **Open Scanner:**
   ```
   https://your-site.com/scan
   ```

2. **Setup:**
   - Enter your name
   - Select event day (Day 1/Day 2)
   - Click "Start Scanning"

3. **Check-In Process:**
   - Guest presents QR code (phone or printout)
   - Scan with your phone camera
   - Guest details appear instantly
   - Direct to seating zone shown on screen
   - Click "Scan Next Guest"

4. **Handle Issues:**
   - **Already checked in** - Shows warning, guest already entered
   - **Invalid QR** - Not a valid guest code
   - **Camera not working** - Check browser permissions

## 📂 Project Structure

```
event-access-system/
├── src/
│   ├── components/
│   │   ├── registration/      # Registration form & success screen
│   │   ├── scanner/            # QR scanner & guest details
│   │   ├── layout/             # Header & footer
│   │   └── shared/             # Reusable UI components
│   ├── services/
│   │   ├── api.ts              # Backend API calls
│   │   ├── qr.ts               # QR code generation
│   │   └── email.ts            # Email service
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utilities (seating, validation)
│   ├── config/                 # Configuration
│   └── App.tsx                 # Main app with routing
├── backend/
│   ├── Code.gs                 # Google Apps Script backend
│   └── SETUP_GUIDE.md          # Backend setup instructions
├── public/                     # Static assets
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # This file
```

## 🛠️ Tech Stack

### Frontend:
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS 4** - Styling
- **React Hook Form + Zod** - Form validation
- **React Router** - Navigation
- **html5-qrcode** - QR scanning
- **qrcode** - QR generation
- **Lucide React** - Icons

### Backend:
- **Google Apps Script** - Serverless backend
- **Google Sheets** - Database
- **Gmail API** - Email delivery

## 🎨 Customization

### Brand Colors:
Edit tailwind configuration:
```css
/* Change orange and yellow gradients in components */
```

### Event Name:
Edit [backend/Code.gs](backend/Code.gs):
```javascript
const CONFIG = {
  EVENT_NAME: "Your Event Name"
}
```

### Seating Zones:
Edit [src/utils/seating.ts](src/utils/seating.ts):
```typescript
function assignSeatingZone(type: GuestType) {
  // Customize zone names and logic
}
```

### Email Template:
Edit `sendQRCodesEmail` function in [backend/Code.gs](backend/Code.gs)

## 📊 Data Management

### View Registrations:
1. Open Google Sheets
2. "Guests" sheet shows all registered guests
3. Columns: ID, Token, Type, Name, Contact, etc.

### View Check-Ins:
1. "CheckIns" sheet shows all check-in records
2. Columns: ID, Guest, Day, Time, Scanner

### Export Data:
- Menu: Event System → Export Guests
- Saves CSV to Google Drive
- Use for reports and analytics

## 🔐 Security

- ✅ **Secure Tokens** - Random, non-guessable, unique
- ✅ **No Raw Data in QR** - Only secure token included
- ✅ **Google Auth** - Apps Script uses your Google account
- ✅ **Private Data** - All data in your Google Drive
- ✅ **HTTPS Only** - Encrypted connections
- ✅ **Input Validation** - All forms validated with Zod

## 🧪 Testing

### Development Mode:
```bash
# .env
VITE_DEV_MODE=true
```
Uses mock data, no backend needed

### Production Mode:
```bash
# .env
VITE_DEV_MODE=false
VITE_APPS_SCRIPT_URL=https://script.google.com/...
```
Uses real Google Apps Script backend

### Test Checklist:
- [ ] Registration form validation
- [ ] QR code generation
- [ ] Email delivery
- [ ] Scanner camera access
- [ ] Check-in recording
- [ ] Duplicate prevention
- [ ] Mobile responsiveness
- [ ] Multiple guest types

## 📝 Event Day Protocol

### Pre-Event (1 hour before):
1. Charge all scanning devices
2. Test scanner on each device
3. Bookmark scanner URL
4. Ensure good lighting at entrance
5. Brief protocol officers

### During Event:
1. Officers scan guests at entrance
2. Direct to assigned seating zones
3. Handle duplicates gracefully
4. Keep devices charged

### Post-Event:
1. Export data from Google Sheets
2. Generate attendance reports
3. Archive data for records

## 🤝 Support

### Common Issues:

**Registration not working:**
- Check Apps Script is deployed
- Verify environment variables
- Check browser console for errors

**QR codes not scanning:**
- Improve lighting
- Adjust phone angle/distance
- Try different browser
- Check camera permissions

**Emails not sending:**
- Verify `EMAIL_ENABLED = true` in Apps Script
- Check spam folder
- Run "Test Email" in Apps Script

### Need Help?
- Check [backend/SETUP_GUIDE.md](backend/SETUP_GUIDE.md)
- Check [DEPLOYMENT.md](DEPLOYMENT.md)
- Review Google Apps Script logs

## 📜 License

This project is created for the 30th Anniversary Celebration.

## 🙏 Acknowledgments

Built with ❤️ for memorable celebrations and seamless event experiences.

---

**Ready to launch?** Follow the [DEPLOYMENT.md](DEPLOYMENT.md) guide!
