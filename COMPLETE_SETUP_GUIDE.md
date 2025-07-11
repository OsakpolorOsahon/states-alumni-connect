# SMMOWCUB Complete Setup & Deployment Guide

## 🎯 Overview
This guide will walk you through setting up ALL external services for your SMMOWCUB website. Follow each section step-by-step to ensure everything works perfectly.

---

## 📋 **PART 1: EXTERNAL SERVICES SETUP**

### 🔥 **1. Firebase Setup (Authentication & Firestore)**

#### Step 1: Access Your Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your existing SMMOWCUB project (or create one if needed)

#### Step 2: Configure Authentication
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add these domains:
   ```
   localhost (for development)
   your-replit-app.replit.app (current domain)
   yourdomain.com (your final domain)
   www.yourdomain.com
   ```

#### Step 3: Set Up Firestore Security Rules
1. Go to **Firestore Database** → **Rules**
2. Replace existing rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow authenticated users to read/write all documents
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
3. Click **Publish**

#### Step 4: Create Initial Secretary Account
1. Go to **Authentication** → **Users** → **Add user**
2. Create user with email: `secretary@yourdomain.com`
3. Set a temporary password
4. After creating, go to **Firestore Database** → **Data**
5. Create collection `members` with document ID matching the user's UID:
   ```json
   {
     "id": "USER_UID_HERE",
     "userId": "USER_UID_HERE", 
     "fullName": "Your Name",
     "nickname": "Secretary",
     "stateshipYear": "2020",
     "lastMowcubPosition": "Major",
     "currentCouncilOffice": "Secretary General",
     "role": "secretary",
     "status": "active",
     "createdAt": "2025-01-11T00:00:00.000Z",
     "updatedAt": "2025-01-11T00:00:00.000Z"
   }
   ```

---

### 💾 **2. Neon.tech Database Setup**

#### Step 1: Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub or email
3. Create new project: "SMMOWCUB"

#### Step 2: Get Connection String
1. In Neon dashboard, go to **Connection Details**
2. Copy the connection string (starts with `postgresql://`)
3. Save this - you'll need it later

#### Step 3: Update Your Application
1. In your Replit project, go to **Secrets**
2. Update `DATABASE_URL` with your Neon connection string
3. Run database migration:
   ```bash
   npm run db:push
   ```

---

### 📧 **3. Resend Email Setup**

#### Step 1: Domain Verification
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **Add Domain**
3. Enter your domain: `yourdomain.com`
4. Follow DNS verification steps:
   - Add TXT record for domain verification
   - Add MX records for email delivery
   - Add DKIM records for authentication

#### Step 2: Update Email Settings
1. In `server/email.ts`, update the sender email:
   ```typescript
   from: 'SMMOWCUB <noreply@yourdomain.com>'
   ```

#### Step 3: Test Email Delivery
1. Send test email from Resend dashboard
2. Verify emails reach inbox (not spam)

---

### 📎 **4. UploadThing File Upload Setup**

#### Step 1: Configure Upload Settings
1. Go to [UploadThing Dashboard](https://uploadthing.com/dashboard)
2. Go to **File Router** settings
3. Set upload limits:
   - Max file size: 10MB
   - Allowed types: image/*, application/pdf
   - Max files per upload: 1

#### Step 2: Configure CORS
1. In UploadThing settings, add allowed origins:
   ```
   http://localhost:5000
   https://your-replit-app.replit.app
   https://yourdomain.com
   ```

#### Step 3: Test File Upload
1. Try uploading a photo on signup page
2. Verify files appear in UploadThing dashboard

---

### 🗺️ **5. Google Maps API Setup**

#### Step 1: Enable Required APIs
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project: "SMMOWCUB Maps"
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional)

#### Step 2: Create API Key
1. Go to **Credentials** → **Create Credentials** → **API Key**
2. Copy the API key
3. Click **Restrict Key**:
   - Application restrictions: HTTP referrers
   - Add your domains:
     ```
     localhost:5000/*
     your-replit-app.replit.app/*
     yourdomain.com/*
     ```

#### Step 3: Test Map Functionality
1. Go to your website's Map page
2. Verify map loads correctly
3. Test member location markers

---

## 🚀 **PART 2: DEPLOYMENT OPTIONS**

### **Option A: Replit Deployment (Recommended)**

#### Step 1: Configure Domain
1. In Replit, click **Deploy** button
2. Choose **Autoscale Deployment**
3. Connect your custom domain
4. Update DNS in your domain registrar:
   ```
   Type: CNAME
   Name: www
   Value: your-app.replit.app
   
   Type: A
   Name: @
   Value: [Replit IP from dashboard]
   ```

#### Step 2: Environment Variables
All your environment variables are already configured in Replit Secrets:
- ✅ VITE_FIREBASE_API_KEY
- ✅ VITE_FIREBASE_PROJECT_ID  
- ✅ VITE_FIREBASE_APP_ID
- ✅ VITE_FIREBASE_MESSAGING_SENDER_ID
- ✅ RESEND_API_KEY
- ✅ UPLOADTHING_SECRET
- ✅ UPLOADTHING_APP_ID
- ✅ VITE_GOOGLE_MAPS_API_KEY
- ✅ DATABASE_URL (update with Neon)

#### Step 3: Deploy
1. Click **Deploy** in Replit
2. Wait for build to complete
3. Test all functionality on live domain

---

### **Option B: Namecheap Hosting Setup**

#### Step 1: Prepare Files
1. Build the application:
   ```bash
   npm run build
   ```
2. Upload these folders to Namecheap:
   - `dist/` (frontend build)
   - `server/` (backend files)
   - `node_modules/` (dependencies)
   - `package.json`

#### Step 2: Configure Namecheap
1. Enable Node.js in cPanel
2. Set Node.js version to 18 or higher
3. Set entry point to `server/index.js`
4. Configure environment variables in cPanel

#### Step 3: Database Connection
1. Use external Neon database (Namecheap shared hosting doesn't support PostgreSQL)
2. Update DATABASE_URL with Neon connection string

---

## 📝 **PART 3: CONTENT SETUP**

### **Sample Content for Testing**

#### Hall of Fame Entries
```json
[
  {
    "name": "Chief John Ogbonnaya",
    "achievement": "First MOWCUB President University of Benin",
    "year": "1976",
    "description": "Pioneered the establishment of MOWCUB at University of Benin",
    "photoUrl": "https://example.com/photo1.jpg"
  },
  {
    "name": "Prof. Margaret Adeola",
    "achievement": "Distinguished Service in Education",
    "year": "1985", 
    "description": "Served as Vice-Chancellor and promoted MOWCUB values in academia",
    "photoUrl": "https://example.com/photo2.jpg"
  }
]
```

#### Sample News Articles
```json
[
  {
    "title": "SMMOWCUB Annual Convention 2025",
    "content": "Join us for our annual gathering of Statesmen. Date: March 15, 2025. Venue: University of Benin Campus.",
    "author": "Secretary General",
    "status": "published",
    "featured": true
  },
  {
    "title": "New Member Orientation Program",
    "content": "All newly approved members are invited to attend our orientation program to learn about SMMOWCUB history and values.",
    "author": "Secretary General", 
    "status": "published",
    "featured": false
  }
]
```

#### Forum Discussion Topics
```json
[
  {
    "title": "Welcome New Members - Introduce Yourself",
    "content": "New Statesmen, please introduce yourself and share your MOWCUB journey",
    "category": "introductions"
  },
  {
    "title": "Career Networking Opportunities", 
    "content": "Share job opportunities and professional networking tips for fellow Statesmen",
    "category": "careers"
  }
]
```

---

## 🔧 **PART 4: TESTING CHECKLIST**

### **Authentication Flow**
- [ ] User can sign up with email/password
- [ ] Email verification works
- [ ] File upload (photo/documents) works
- [ ] User can login after approval
- [ ] Password reset works

### **Member Management**
- [ ] Secretary can view pending members
- [ ] Secretary can approve/reject members  
- [ ] Approval emails are sent
- [ ] Member directory shows active members
- [ ] Member profiles display correctly

### **Content Features**
- [ ] Secretary can create news articles
- [ ] Forum discussions work
- [ ] Job board functions
- [ ] Hall of Fame displays

### **Map & Location**
- [ ] Interactive map loads
- [ ] Member locations show on map
- [ ] Map controls work (zoom, pan)

---

## 🎯 **PART 5: FINAL CONFIGURATION**

### **Security Settings**
1. **Firebase**: Set stricter security rules for production
2. **API Keys**: Restrict to your domain only
3. **Environment Variables**: Never expose in client code
4. **HTTPS**: Ensure all external services use HTTPS

### **Performance Optimization**
1. **Images**: Compress uploaded images via UploadThing
2. **Database**: Index frequently queried fields
3. **Caching**: Enable browser caching for static assets
4. **CDN**: Consider using Cloudflare for better performance

### **Monitoring Setup**
1. **Firebase Analytics**: Track user engagement
2. **Error Tracking**: Monitor application errors
3. **Database Monitoring**: Watch query performance
4. **Email Delivery**: Monitor email success rates

---

## 🆘 **TROUBLESHOOTING**

### **Common Issues**

#### "Permission Denied" Errors
- Check Firebase security rules
- Verify user authentication
- Ensure proper API key restrictions

#### File Upload Failures
- Check UploadThing API key configuration
- Verify file size limits
- Check CORS settings

#### Map Not Loading
- Verify Google Maps API key
- Check API restrictions
- Ensure Maps JavaScript API is enabled

#### Email Not Sending
- Verify Resend domain verification
- Check sender email domain
- Review email delivery logs

---

## 📞 **SUPPORT CONTACTS**

### **Service Support**
- **Firebase**: [Firebase Support](https://firebase.google.com/support)
- **Neon.tech**: [Neon Support](https://neon.tech/docs)
- **Resend**: [Resend Docs](https://resend.com/docs)
- **UploadThing**: [UploadThing Docs](https://docs.uploadthing.com)
- **Google Maps**: [Google Cloud Support](https://cloud.google.com/support)

### **Emergency Contacts**
If you encounter critical issues during deployment, document the error message and contact the respective service support immediately.

---

## ✅ **COMPLETION CHECKLIST**

### **Pre-Launch**
- [ ] All external services configured
- [ ] Domain DNS properly set up
- [ ] SSL certificate active
- [ ] All API keys working
- [ ] Database connected and migrated
- [ ] Email delivery tested
- [ ] File uploads working
- [ ] Map functionality verified
- [ ] Secretary account created
- [ ] Sample content added

### **Post-Launch**
- [ ] User registration tested end-to-end
- [ ] Member approval process verified
- [ ] All features functional
- [ ] Performance acceptable
- [ ] Security measures active
- [ ] Monitoring enabled
- [ ] Backup procedures in place

---

## 🎉 **CONGRATULATIONS!**

Once you complete all these steps, your SMMOWCUB website will be fully functional and ready to serve your alumni community. The platform includes:

- ✅ Complete member management system
- ✅ Interactive location mapping
- ✅ File upload capabilities
- ✅ Email notification system
- ✅ Forum discussions
- ✅ Job board
- ✅ Hall of Fame
- ✅ Secretary administration panel
- ✅ Mobile-responsive design
- ✅ PWA capabilities (works offline)

Your website is built with modern, scalable technology that can grow with your community!