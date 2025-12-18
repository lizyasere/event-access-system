# 📧 Email Setup Guide - QR Code Delivery

## Current Status

✅ **Your backend (`backend/Code.gs`) ALREADY has email functionality built-in!**

The `sendQRCodesEmail()` function is implemented and ready to use. It sends beautiful HTML emails with QR code links.

## How It Works

### Current Flow:
1. User fills registration form → Frontend
2. Form submits to Google Apps Script → Backend
3. Backend creates guest records and generates tokens
4. Backend calls `sendQRCodesEmail()` → **Sends email automatically!**
5. Email contains QR code links for each guest

### Email Content Includes:
- ✅ Personalized greeting
- ✅ Individual QR code links for each guest (VIP, Spouse, Associates)
- ✅ Guest type labels
- ✅ Instructions for use
- ✅ Professional orange/white branded design

## ⚠️ Configuration Required

### Step 1: Enable Email in Google Apps Script

Open `backend/Code.gs` and verify this line:

```javascript
const CONFIG = {
  BASE_URL: "YOUR_FRONTEND_URL", // Replace with your deployed frontend URL
  EMAIL_ENABLED: true,           // ✅ Make sure this is true
  EVENT_NAME: "30th Anniversary Celebration"
};
```

### Step 2: Update BASE_URL

Replace `"YOUR_FRONTEND_URL"` with your actual deployed website URL:

**Example:**
```javascript
const CONFIG = {
  BASE_URL: "https://your-event-site.com",  // Your actual URL
  EMAIL_ENABLED: true,
  EVENT_NAME: "30th Anniversary Celebration"
};
```

### Step 3: Test Email Functionality

In Google Apps Script editor:

1. Click on **Run** > Select `testEmail`
2. This will send a test email to verify everything works
3. Check your email inbox

### Step 4: Grant Email Permissions

First time you run the script:

1. Google will ask for permissions
2. Click **Review Permissions**
3. Choose your Google account
4. Click **Allow**
5. Required permissions:
   - Send email as you
   - Access spreadsheet data

## 🔧 Troubleshooting

### Issue: Emails Not Sending

**Check 1: EMAIL_ENABLED setting**
```javascript
EMAIL_ENABLED: true  // ✅ Must be true
```

**Check 2: Email quota**
- Free Google accounts: 100 emails/day
- Google Workspace: 1,500 emails/day
- Check quota: [Google Apps Script Quotas](https://developers.google.com/apps-script/guides/services/quotas)

**Check 3: Spam folder**
- First emails may go to spam
- Mark as "Not Spam" to whitelist

### Issue: Invalid Email Address

The backend uses `mainGuest.email` field. Ensure:
- Email validation in frontend is working
- Form requires valid email format

### Issue: QR Links Not Working

**Update BASE_URL in Code.gs:**
```javascript
BASE_URL: "https://your-actual-deployed-url.com"
```

Not:
- ❌ `http://localhost:5174`
- ❌ `YOUR_FRONTEND_URL` (placeholder)

## 📨 Email Example

Recipients will receive:

```
Subject: 30th Anniversary Celebration - Your QR Codes

Dear Dr. John Smith,

Thank you for registering for the 30th Anniversary Celebration. Your QR codes are ready!

[Orange Header with Event Name]

Important Instructions:
• Each person has their own unique QR code
• Save these links or take screenshots
• Present your QR code at the venue entrance
• QR codes are valid for all event days

┌─────────────────────────┐
│ Dr. John Smith          │
│ Guest Type: VIP         │
│ [Open QR Code] Button   │
└─────────────────────────┘

┌─────────────────────────┐
│ Mrs. Jane Smith         │
│ Guest Type: SPOUSE      │
│ [Open QR Code] Button   │
└─────────────────────────┘

We look forward to seeing you at the celebration!
```

## 🎨 Customizing Email Template

Edit `sendQRCodesEmail()` function in `backend/Code.gs` (line ~440):

### Change Colors:
```javascript
.header { background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); }
.qr-container { border: 2px solid #FF6B35; }
```

### Change Text:
```javascript
<p>Thank you for registering for the ${CONFIG.EVENT_NAME}.</p>
```

### Add Logo:
```javascript
<div class="header">
  <img src="YOUR_LOGO_URL" alt="Logo" style="max-width: 100px;">
  <h1>${CONFIG.EVENT_NAME}</h1>
</div>
```

## 🚀 Deployment Checklist

Before going live:

- [ ] Update `BASE_URL` in Code.gs
- [ ] Set `EMAIL_ENABLED: true`
- [ ] Deploy Apps Script as Web App
- [ ] Update frontend `api.ts` with Web App URL
- [ ] Test registration with your own email
- [ ] Verify QR links work
- [ ] Check email lands in inbox (not spam)
- [ ] Test on mobile device

## 📱 Mobile Optimization

The QR code links work on mobile:
- Users click link → Opens QR code page
- Protocol officer scans displayed QR
- Or user shows QR directly from email

## 🔐 Security Notes

- ✅ Tokens are unique and secure
- ✅ Generated with timestamp + random string
- ✅ Format: `TOK-randomstring-timestamp`
- ✅ Cannot be guessed or duplicated
- ✅ Email sent only to registered email address

## Need More Help?

### Advanced Email Services (Optional)

If you need more features (tracking, analytics, templates):

**Option 1: Gmail (Current - Free)**
- ✅ Already working
- ✅ Up to 100 emails/day
- ✅ Simple setup

**Option 2: SendGrid (Advanced)**
- 100 emails/day free
- Email tracking
- Analytics dashboard
- Requires API integration

**Option 3: Mailgun**
- 5,000 emails/month free
- Email validation
- Detailed logs

**Option 4: AWS SES**
- Very low cost
- High volume
- Requires AWS account

---

## Summary

✅ **Email functionality is ALREADY BUILT and READY!**

Just:
1. Update `BASE_URL` in Code.gs
2. Verify `EMAIL_ENABLED: true`
3. Deploy your backend
4. Test registration

Emails will be sent automatically! 🎉
