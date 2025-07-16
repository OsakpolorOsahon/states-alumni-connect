# 🚀 COMPLETE DEPLOYMENT GUIDE FOR SMMOWCUB.ORG

## Table of Contents
1. [What You'll Need](#what-youll-need)
2. [Step 1: Buy Domain from GoDaddy](#step-1-buy-domain-from-godaddy)
3. [Step 2: Get Hosting from Namecheap](#step-2-get-hosting-from-namecheap)
4. [Step 3: Connect Domain to Hosting](#step-3-connect-domain-to-hosting)
5. [Step 4: Set Up SSL Certificate](#step-4-set-up-ssl-certificate)
6. [Step 5: Deploy Your Backend Server](#step-5-deploy-your-backend-server)
7. [Step 6: Configure Database](#step-6-configure-database)
8. [Step 7: Set Up Email Service](#step-7-set-up-email-service)
9. [Step 8: Configure File Upload](#step-8-configure-file-upload)
10. [Step 9: Set Up Google Maps](#step-9-set-up-google-maps)
11. [Step 10: Build and Upload Frontend](#step-10-build-and-upload-frontend)
12. [Step 11: Configure DNS Records](#step-11-configure-dns-records)
13. [Step 12: Final Testing](#step-12-final-testing)
14. [Troubleshooting](#troubleshooting)

---

## What You'll Need

### Services to Sign Up For:
- **GoDaddy**: For domain registration
- **Namecheap**: For web hosting
- **Railway**: For backend server hosting
- **Resend**: For email service
- **UploadThing**: For file uploads
- **Google Cloud**: For Maps API

### Estimated Costs:
- Domain (GoDaddy): $12-15/year
- Hosting (Namecheap): $20-30/year
- Backend Server (Railway): $5-10/month
- Email (Resend): Free for first 3,000 emails/month
- File Upload (UploadThing): Free for first 2GB
- Google Maps: Free for first 28,000 map loads/month

**Total Monthly Cost: $15-25**

---

## Step 1: Buy Domain from GoDaddy

### 1.1 Go to GoDaddy
1. Open your web browser
2. Go to **godaddy.com**
3. Click "Sign In" or "Create Account"

### 1.2 Search for Domain
1. In the search box, type: **smmowcub.org**
2. Click "Search"
3. If available, click "Add to Cart"
4. If not available, try: **smmowcub.net** or **smmowcub.com**

### 1.3 Complete Purchase
1. Click "Continue to Cart"
2. **IMPORTANT**: Decline all extra services (privacy protection, email, etc.)
3. Click "Continue to Checkout"
4. Enter your personal information
5. Choose payment method
6. Click "Complete Purchase"

### 1.4 Save Your Login Details
Write down:
- **GoDaddy Username**: ________________
- **GoDaddy Password**: ________________
- **Domain Name**: ________________

---

## Step 2: Get Hosting from Namecheap

### 2.1 Go to Namecheap
1. Open your web browser
2. Go to **namecheap.com**
3. Click "Sign Up" to create account

### 2.2 Choose Hosting Plan
1. Click "Hosting" in the top menu
2. Click "Shared Hosting"
3. Choose **"Stellar"** plan (cheapest option)
4. Click "Add to Cart"

### 2.3 Configure Hosting
1. **Domain**: Choose "I have a domain"
2. Enter your domain from GoDaddy (e.g., smmowcub.org)
3. **Hosting Period**: Choose 1 year
4. **Data Center**: Choose closest to Nigeria (Europe)

### 2.4 Complete Purchase
1. Click "Continue to Checkout"
2. Enter your information
3. Choose payment method
4. Click "Complete Order"

### 2.5 Access Your Hosting
1. Go to your email and find "Welcome to Namecheap" email
2. Click "Login to cPanel"
3. Or go to **namecheap.com** → "Account" → "Hosting List"

### 2.6 Save Your Login Details
Write down:
- **Namecheap Username**: ________________
- **Namecheap Password**: ________________
- **cPanel URL**: ________________
- **cPanel Username**: ________________
- **cPanel Password**: ________________

---

## Step 3: Connect Domain to Hosting

### 3.1 Log into GoDaddy
1. Go to **godaddy.com**
2. Click "Sign In"
3. Enter your GoDaddy username and password

### 3.2 Access Domain Settings
1. Click "My Products"
2. Find your domain (smmowcub.org)
3. Click "DNS" or "Manage"

### 3.3 Change Nameservers
1. Find "Nameservers" section
2. Click "Change"
3. Select "Custom"
4. Enter these nameservers:
   - **Nameserver 1**: ns1.namecheap.com
   - **Nameserver 2**: ns2.namecheap.com
   - **Nameserver 3**: ns3.namecheap.com
5. Click "Save"

### ⏰ IMPORTANT: Wait 24-48 hours for this to take effect!

---

## Step 4: Set Up SSL Certificate

### 4.1 Access Namecheap cPanel
1. Log into **namecheap.com**
2. Go to "Hosting List"
3. Click "Manage" next to your hosting
4. Click "cPanel Login"

### 4.2 Install SSL Certificate
1. Find "SSL/TLS" section
2. Click "Let's Encrypt SSL"
3. Select your domain
4. Click "Issue"
5. Wait 5-10 minutes for installation

### 4.3 Force HTTPS
1. In cPanel, find "File Manager"
2. Click "File Manager"
3. Navigate to "public_html" folder
4. Click "New File"
5. Name it: **.htaccess**
6. Right-click the file and click "Edit"
7. Add this code:
```
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```
8. Click "Save Changes"

---

## Step 5: Deploy Your Backend Server

### 5.1 Sign Up for Railway
1. Go to **railway.app**
2. Click "Login"
3. Choose "Login with GitHub"
4. If you don't have GitHub, create account at **github.com** first

### 5.2 Create New Project
1. Click "New Project"
2. Click "Deploy from GitHub repo"
3. If this is your first time, click "Connect GitHub"
4. Search for your project repository
5. Click "Deploy"

### 5.3 Add Environment Variables
1. In Railway dashboard, click your project
2. Click "Variables" tab
3. Add these variables one by one:

**Click "New Variable" for each:**

| Variable Name | Value | Where to Get It |
|---------------|-------|-----------------|
| `DATABASE_URL` | Your database connection string | From Step 6 |
| `RESEND_API_KEY` | Your Resend API key | From Step 7 |
| `FROM_EMAIL` | noreply@smmowcub.org | Your domain email |
| `GOOGLE_MAPS_API_KEY` | Your Google Maps API key | From Step 9 |
| `UPLOADTHING_SECRET` | Your UploadThing secret | From Step 8 |
| `UPLOADTHING_APP_ID` | Your UploadThing app ID | From Step 8 |
| `NODE_ENV` | production | Type this exactly |
| `PORT` | 3000 | Type this exactly |

### 5.4 Get Your Server URL
1. After deployment, Railway will give you a URL like:
   **https://yourproject-production-abcd.up.railway.app**
2. Write this down: ________________

---

## Step 6: Configure Database

### 6.1 Your Database is Already Set Up!
Your Replit environment is already using a Neon PostgreSQL database. You just need to copy the connection string.

### 6.2 Get Database URL
1. In your Replit project, click "Secrets" tab
2. Find `DATABASE_URL`
3. Copy the entire value (it looks like: `postgresql://user:pass@host:5432/database`)

### 6.3 Add to Railway
1. In Railway dashboard, click "Variables"
2. Click "New Variable"
3. Name: `DATABASE_URL`
4. Value: Paste your database URL
5. Click "Add"

---

## Step 7: Set Up Email Service

### 7.1 Sign Up for Resend
1. Go to **resend.com**
2. Click "Sign Up"
3. Enter your email and password
4. Verify your email address

### 7.2 Get API Key
1. In Resend dashboard, click "API Keys"
2. Click "Create API Key"
3. Name: "SMMOWCUB Production"
4. Copy the API key (starts with "re_")
5. **IMPORTANT**: Save this key, you can't see it again!

### 7.3 Add Domain to Resend
1. In Resend dashboard, click "Domains"
2. Click "Add Domain"
3. Enter your domain: **smmowcub.org**
4. Click "Add"

### 7.4 Configure DNS Records
1. Resend will show you DNS records to add
2. Copy each record (there will be 3-4 records)
3. Go to your Namecheap cPanel
4. Find "Zone Editor" or "DNS Manager"
5. Add each record exactly as shown:

**Example records (yours will be different):**
- Type: TXT, Name: @, Value: v=spf1 include:_spf.resend.com ~all
- Type: TXT, Name: resend._domainkey, Value: [long key value]
- Type: CNAME, Name: resend, Value: feedback.resend.com

### 7.5 Test Email Setup
1. Wait 30 minutes after adding DNS records
2. In Resend dashboard, click "Domains"
3. Click "Verify" next to your domain
4. Status should show "Verified"

### 7.6 Add to Railway
1. In Railway dashboard, click "Variables"
2. Add these variables:
   - `RESEND_API_KEY`: Your API key from step 7.2
   - `FROM_EMAIL`: noreply@smmowcub.org

---

## Step 8: Configure File Upload

### 8.1 Sign Up for UploadThing
1. Go to **uploadthing.com**
2. Click "Sign Up"
3. Use your GitHub account (same as Railway)

### 8.2 Create New App
1. Click "Create App"
2. Name: "SMMOWCUB"
3. Click "Create"

### 8.3 Get API Keys
1. In UploadThing dashboard, click "API Keys"
2. Copy these values:
   - **App ID**: ut_app_xxxxxxxxxx
   - **Secret**: sk_live_xxxxxxxxxx

### 8.4 Add to Railway
1. In Railway dashboard, click "Variables"
2. Add these variables:
   - `UPLOADTHING_APP_ID`: Your App ID
   - `UPLOADTHING_SECRET`: Your Secret

---

## Step 9: Set Up Google Maps

### 9.1 Create Google Cloud Account
1. Go to **console.cloud.google.com**
2. Click "Get Started"
3. Sign in with your Google account
4. Accept terms and conditions

### 9.2 Create New Project
1. Click "Select a project" at the top
2. Click "New Project"
3. Name: "SMMOWCUB"
4. Click "Create"

### 9.3 Enable Maps API
1. In the search bar, type: "Maps JavaScript API"
2. Click on "Maps JavaScript API"
3. Click "Enable"

### 9.4 Create API Key
1. Click "Credentials" in the left sidebar
2. Click "Create Credentials"
3. Select "API Key"
4. Copy the API key
5. Click "Restrict Key"

### 9.5 Restrict API Key
1. Under "Application restrictions", choose "HTTP referrers"
2. Add these referrers:
   - https://smmowcub.org/*
   - https://www.smmowcub.org/*
   - https://yourproject-production-abcd.up.railway.app/*
3. Under "API restrictions", choose "Restrict key"
4. Select "Maps JavaScript API"
5. Click "Save"

### 9.6 Add to Railway
1. In Railway dashboard, click "Variables"
2. Add variable:
   - `GOOGLE_MAPS_API_KEY`: Your API key

---

## Step 10: Build and Upload Frontend

### 10.1 Build Your Project
1. In your Replit project, click "Shell" tab
2. Type this command: `npm run build`
3. Press Enter and wait for it to complete
4. You should see a "dist" folder created

### 10.2 Download Build Files
1. In Replit, find the "dist" folder
2. Right-click the "dist" folder
3. Click "Download"
4. Save it to your computer

### 10.3 Extract Files
1. Find the downloaded "dist.zip" file
2. Right-click and extract/unzip it
3. You should see files like: index.html, assets folder, etc.

### 10.4 Upload to Namecheap
1. Log into Namecheap cPanel
2. Click "File Manager"
3. Navigate to "public_html" folder
4. Delete any existing files (like index.html, cgi-bin)
5. Click "Upload" 
6. Select all files from your extracted "dist" folder
7. Click "Upload"

### 10.5 Set Correct Permissions
1. Select all uploaded files
2. Right-click and choose "Change Permissions"
3. Set folders to 755
4. Set files to 644

---

## Step 11: Configure DNS Records

### 11.1 Add API Subdomain
1. In Namecheap cPanel, find "Subdomains"
2. Click "Create Subdomain"
3. Subdomain: **api**
4. Document Root: Leave empty
5. Click "Create"

### 11.2 Point API to Railway
1. In cPanel, find "Zone Editor"
2. Click "Zone Editor"
3. Find your domain
4. Click "Manage"
5. Click "Add Record"
6. Type: **CNAME**
7. Name: **api**
8. Value: **yourproject-production-abcd.up.railway.app** (your Railway URL without https://)
9. Click "Save"

### 11.3 Update Frontend API URL
1. In your Replit project, open `client/src/lib/queryClient.ts`
2. Find the line with `apiRequest`
3. Change the base URL to: `https://api.smmowcub.org`
4. Save the file
5. Run `npm run build` again
6. Download and upload new files to Namecheap

---

## Step 12: Final Testing

### 12.1 Test Website Loading
1. Go to **https://smmowcub.org**
2. Website should load without errors
3. Check if all sections display correctly

### 12.2 Test Registration
1. Click "Sign Up"
2. Fill in registration form
3. Try to submit registration
4. Check if email is sent

### 12.3 Test File Upload
1. Try to upload a profile photo
2. Check if file uploads successfully

### 12.4 Test Admin Functions
1. Create admin account
2. Test member approval
3. Test creating news posts

### 12.5 Test Email Notifications
1. Check if registration emails are sent
2. Test approval/rejection emails
3. Verify email deliverability

---

## Troubleshooting

### Problem: Website Not Loading
**Symptoms**: "Site can't be reached" or "DNS error"
**Solutions**:
1. Check if 24-48 hours have passed since DNS changes
2. Verify nameservers are correct in GoDaddy
3. Clear your browser cache
4. Try accessing from different device/network

### Problem: "Not Secure" Warning
**Symptoms**: HTTP instead of HTTPS, security warnings
**Solutions**:
1. Check if SSL certificate is installed in cPanel
2. Verify .htaccess file is in public_html
3. Wait 1-2 hours for SSL activation
4. Contact Namecheap support

### Problem: API Not Working
**Symptoms**: Login fails, data not loading
**Solutions**:
1. Check if Railway deployment is successful
2. Verify all environment variables are set
3. Check Railway logs for errors
4. Ensure API subdomain points to Railway

### Problem: Email Not Sending
**Symptoms**: No registration emails, no notifications
**Solutions**:
1. Check if domain is verified in Resend
2. Verify DNS records are correct
3. Check RESEND_API_KEY in Railway
4. Test email deliverability in Resend dashboard

### Problem: File Upload Fails
**Symptoms**: Can't upload photos, file errors
**Solutions**:
1. Check UploadThing API keys in Railway
2. Verify file size limits
3. Check file format restrictions
4. Test with different file types

### Problem: Database Connection Error
**Symptoms**: Login fails, data not saving
**Solutions**:
1. Check DATABASE_URL in Railway
2. Verify database is running
3. Check connection string format
4. Test database connectivity

### Problem: Google Maps Not Working
**Symptoms**: Maps don't load, location errors
**Solutions**:
1. Check GOOGLE_MAPS_API_KEY in Railway
2. Verify API key restrictions
3. Enable billing in Google Cloud
4. Check API quotas

---

## Important Notes

### Security
- Never share your API keys publicly
- Use strong passwords for all accounts
- Enable two-factor authentication where possible
- Regularly update your passwords

### Backup
- Download your website files regularly
- Export your database periodically
- Keep copies of all API keys and passwords
- Document any custom changes

### Monitoring
- Check your website daily for the first week
- Monitor email delivery rates
- Watch for error messages in logs
- Set up uptime monitoring

### Support
- **Namecheap**: Live chat support for hosting issues
- **Railway**: Discord community for server issues
- **Resend**: Email support for email delivery
- **UploadThing**: Discord community for file upload issues

---

## Congratulations! 🎉

If you've followed all these steps, you should now have:

✅ **Professional Website**: https://smmowcub.org
✅ **Secure HTTPS**: SSL certificate installed
✅ **Backend Server**: Running on Railway
✅ **Email System**: Powered by Resend
✅ **File Uploads**: Handled by UploadThing
✅ **Database**: PostgreSQL with all data
✅ **Google Maps**: Location features working
✅ **Admin Panel**: Full member management
✅ **Mobile Responsive**: Works on all devices

Your SMMOWCUB member portal is now live and ready for members to register, connect, and engage with the community!

**Total Time to Complete**: 4-6 hours
**Total Cost**: $15-25 per month

Remember to test everything thoroughly before announcing the launch to your members.

---

**Need Help?**
If you get stuck on any step, don't hesitate to:
1. Re-read the specific step carefully
2. Check the troubleshooting section
3. Contact the support team for the specific service
4. Ask for help in the respective community forums

**Good luck with your launch!** 🚀