# Production Deployment Guide
# Event Access System - 30th Anniversary Celebration

## Deployment Options

### Option 1: Netlify (Recommended - Fastest)

#### Prerequisites
- GitHub account
- Netlify account (free)

#### Steps:

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Event Access System"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/event-access-system.git
   git push -u origin main
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click "Show advanced" → "New variable" and add:
     ```
     VITE_APPS_SCRIPT_URL = https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
     VITE_CHECK_IN_BASE_URL = (leave empty for now)
     VITE_DEV_MODE = false
     ```
   - Click "Deploy site"

3. **Get Your URL:**
   - Netlify will give you a URL like: `https://random-name-123.netlify.app`
   - Click "Site settings" → "Change site name" to customize it
   - Example: `church-anniversary-2025.netlify.app`

4. **Update Environment Variable:**
   - Go to Site settings → Environment variables
   - Edit `VITE_CHECK_IN_BASE_URL` to your Netlify URL
   - Click "Save"
   - Trigger a new deployment: Deploys → Trigger deploy → Deploy site

5. **Update Apps Script:**
   - Go to your Google Apps Script
   - Update `CONFIG.BASE_URL` to your Netlify URL
   - Redeploy the script

### Option 2: Vercel (Alternative)

#### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow prompts:**
   - Link to existing project: No
   - Project name: event-access-system
   - Directory: ./
   - Build command: `npm run build`
   - Output directory: `dist`

4. **Set Environment Variables:**
   ```bash
   vercel env add VITE_APPS_SCRIPT_URL production
   vercel env add VITE_CHECK_IN_BASE_URL production
   vercel env add VITE_DEV_MODE production
   ```

5. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Testing Your Deployment

### 1. Test Registration
- Visit `https://your-site.netlify.app`
- Fill out registration form
- Check Google Sheets for new entry
- Verify email received

### 2. Test QR Scanner
- Visit `https://your-site.netlify.app/scan`
- Allow camera access
- Scan a QR code (from email or success screen)
- Verify guest details appear
- Complete check-in
- Check CheckIns sheet in Google Sheets

### 3. Test Mobile
- Open site on mobile phone
- Test camera scanning
- Verify responsive design

## Custom Domain (Optional)

### Netlify:
1. Buy domain from any registrar (Namecheap, GoDaddy, etc.)
2. In Netlify: Site settings → Domain management → Add custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

### Update after custom domain:
- Update `VITE_CHECK_IN_BASE_URL` in Netlify env vars
- Update `CONFIG.BASE_URL` in Apps Script
- Redeploy both

## Pre-Event Checklist

- [ ] Frontend deployed successfully
- [ ] Backend (Apps Script) configured and deployed
- [ ] Environment variables set correctly
- [ ] Test registration works end-to-end
- [ ] QR codes are being generated
- [ ] Emails are being sent
- [ ] Scanner page works on mobile
- [ ] Check-in records in Google Sheets
- [ ] Duplicate check-in prevention works
- [ ] Custom domain configured (if using)
- [ ] Backup Google Sheets created

## Event Day Checklist

### For Protocol Officers:

1. **Scanner Setup:**
   - Navigate to `https://your-site.netlify.app/scan`
   - Bookmark the page
   - Test camera before guests arrive
   - Ensure good lighting for scanning

2. **Check-In Process:**
   - Enter your name as scanner
   - Select correct day (Day 1 or Day 2)
   - Start scanning
   - Guest scans QR code
   - Verify details on screen
   - Direct to seating zone
   - Scan next guest

3. **Troubleshooting:**
   - **QR won't scan:** Try adjusting phone angle/distance
   - **"Already checked in":** Guest already scanned for this day
   - **"Invalid QR code":** Not a valid guest code
   - **Camera not working:** Check browser permissions

##  Security Best Practices

- [ ] Never commit `.env` files to git
- [ ] Keep Apps Script deployment URL private
- [ ] Regularly backup Google Sheets
- [ ] Monitor for suspicious activity
- [ ] Disable DEV_MODE in production

##  Post-Event

### Data Export:
1. Open Google Sheets
2. Event System menu → Export Guests
3. File will be saved to Google Drive
4. Download for records

### Analytics:
- Total registrations: Count rows in Guests sheet
- Total check-ins: Count rows in CheckIns sheet
- Day-by-day attendance: Filter CheckIns by day
- VIP vs Associate ratio: Filter Guests by type

##  Emergency Contacts

### Quick Fixes:

**Site is down:**
- Check Netlify deployment status
- Check if domain expired
- Check Apps Script is still deployed

**Emails not sending:**
- Verify `CONFIG.EMAIL_ENABLED = true`
- Check Apps Script execution logs
- Test with "Test Email" function

**Scanner not working:**
- Clear browser cache
- Try different browser
- Check camera permissions
- Use direct `/scan` URL

##  Backup Strategy

**Before Event:**
1. Make copy of Google Sheet
2. Export guest list as CSV
3. Download Apps Script code

**During Event:**
- Google Sheets auto-saves
- No action needed

**After Event:**
1. Final export of all data
2. Archive Google Sheets
3. Keep Apps Script deployed for 1 month (for late check-ins/reports)

##  Success!

Your event access system is now live and ready for the 30th Anniversary Celebration!

### Quick Links:
- **Registration:** `https://your-site.netlify.app`
- **Scanner:** `https://your-site.netlify.app/scan`
- **Database:** Your Google Sheets
- **Backend:** Your Apps Script

---

Made by Liz for the 30th Anniversary Celebration
