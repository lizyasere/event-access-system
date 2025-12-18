# Google Apps Script Backend Setup Guide

## 📋 Prerequisites
- Google Account
- Google Sheets access
- 30 minutes setup time

## 🚀 Quick Setup (Step-by-Step)

### Step 1: Create Google Sheets Database

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Event Access System - 30th Anniversary"**
4. Leave it blank for now (the script will create the structure)

### Step 2: Add Apps Script

1. In your spreadsheet, click **Extensions > Apps Script**
2. Delete any existing code in the editor
3. Copy the entire content from `Code.gs` file
4. Paste it into the Apps Script editor
5. Click **Save** (💾 icon) or press `Ctrl+S`
6. Name the project: **"Event Access Backend"**

### Step 3: Configure the Script

In the script, find the `CONFIG` object (around line 27) and update:

```javascript
const CONFIG = {
  BASE_URL: "YOUR_FRONTEND_URL", // Replace with your deployed URL (Step 6)
  EMAIL_ENABLED: true,
  EVENT_NAME: "30th Anniversary Celebration"
};
```

**Note:** You'll update `BASE_URL` after deploying the frontend (Step 6)

### Step 4: Initialize the Database

1. Click **Run > Run function > setupSheets**
2. **First time only:** You'll see an authorization prompt:
   - Click "Review Permissions"
   - Choose your Google account
   - Click "Advanced" → "Go to Event Access Backend (unsafe)"
   - Click "Allow"
3. Wait for "Execution completed" message
4. Refresh your spreadsheet - you should see two new sheets:
   - **Guests** (with orange headers)
   - **CheckIns** (with orange headers)

### Step 5: Deploy as Web App

1. In Apps Script editor, click **Deploy > New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **Web app**
4. Configure:
   - **Description:** "Event Check-In System v1"
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/ABC123.../exec
   ```
7. Click **Done**

### Step 6: Connect Frontend to Backend

1. In your frontend project, create a `.env` file:

```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_CHECK_IN_BASE_URL=https://your-app.netlify.app
VITE_DEV_MODE=false
```

2. Replace:
   - `YOUR_SCRIPT_ID` with your actual Apps Script deployment URL
   - `your-app.netlify.app` with your deployed frontend URL

3. Go back to Apps Script and update the `BASE_URL` in the `CONFIG` object with your frontend URL

4. **Redeploy the script:**
   - Click **Deploy > Manage deployments**
   - Click ✏️ Edit next to your deployment
   - Click **Deploy**

### Step 7: Test the Integration

1. **Test Email (Optional but Recommended):**
   - In spreadsheet: **Event System menu > Test Email**
   - Enter your email address
   - Check your inbox for test QR code email

2. **Test Registration:**
   - Open your frontend app
   - Fill out the registration form
   - Submit
   - Check Google Sheets - new guest should appear in **Guests** sheet

3. **Test Check-In:**
   - Go to `/scan` route in your app
   - Allow camera access
   - Scan a QR code
   - Check **CheckIns** sheet for new entry

## 📊 Understanding the Database Structure

### Guests Sheet
| Column | Description |
|--------|-------------|
| ID | Unique guest identifier (VIP-xxx, SPOUSE-xxx, etc.) |
| Token | Secure token for QR code |
| Type | VIP, SPOUSE, PA, or ASSOCIATE |
| Title, First Name, Surname | Guest name parts |
| Full Name | Combined full name |
| Phone | Contact phone |
| Email | Email address |
| Church Name | Guest's church |
| Position | Role/position |
| With Car | Boolean - arrived with vehicle |
| Zone | Seating zone assignment |
| Registration Date | ISO timestamp |
| Main Guest ID | Links associates to main VIP |

### CheckIns Sheet
| Column | Description |
|--------|-------------|
| Check-In ID | Unique check-in identifier |
| Guest ID | Links to Guests sheet |
| Guest Name | For easy reference |
| Day | Event day (Day 1, Day 2) |
| Timestamp | Check-in time |
| Scanner Name | Protocol officer name |

## 🔧 Troubleshooting

### Issue: "Authorization required"
**Solution:** Run `setupSheets` again and complete the authorization flow

### Issue: "Script function not found"
**Solution:** Make sure you saved the script (Ctrl+S) before deploying

### Issue: "Emails not sending"
**Solution:** 
- Verify `CONFIG.EMAIL_ENABLED = true`
- Check that Gmail API is enabled (should be automatic)
- Test with the "Test Email" menu option

### Issue: "Invalid token" errors
**Solution:**
- Verify the `BASE_URL` in CONFIG matches your frontend URL
- Redeploy the script after changing CONFIG
- Clear browser cache and try again

### Issue: "CORS errors"
**Solution:**
- Ensure deployment is set to "Anyone" access
- Use the `/exec` URL, not `/dev`
- Frontend should handle CORS (already configured in api.ts)

## 📱 Production Checklist

Before going live:

- [ ] `CONFIG.BASE_URL` set to production frontend URL
- [ ] `CONFIG.EMAIL_ENABLED` set to `true`
- [ ] Apps Script deployed as Web App (Anyone access)
- [ ] Frontend `.env` configured with production URLs
- [ ] Test registration end-to-end
- [ ] Test check-in with real QR code
- [ ] Verify email delivery
- [ ] Test duplicate check-in prevention
- [ ] Backup Google Sheets (File > Make a copy)

## 🎯 Testing in Development Mode

To test without Apps Script:

1. In frontend `.env`:
   ```env
   VITE_DEV_MODE=true
   ```

2. App will use mock data (defined in `src/services/api.ts`)

3. Switch to `VITE_DEV_MODE=false` for production

## 📧 Email Customization

To customize the email template, edit the `sendQRCodesEmail` function in `Code.gs`:

- Update HTML styling
- Modify email subject
- Add logo/images
- Change footer text

## 🔐 Security Notes

- **Tokens are secure:** Random, unique, non-guessable
- **Apps Script runs as YOU:** Be careful with permissions
- **Data privacy:** Guest data is in your Google Drive
- **Access control:** Only deployed web app can modify data

## 🆘 Need Help?

Common commands in Apps Script:

- **View logs:** View > Logs (Ctrl+Enter)
- **Debug:** Add `Logger.log("message")` in code
- **Redeploy:** Deploy > Manage deployments > Edit > Deploy
- **Rollback:** Deploy > Manage deployments > Archive old version

## 🎉 You're Done!

Your backend is now fully operational and ready for the event!
