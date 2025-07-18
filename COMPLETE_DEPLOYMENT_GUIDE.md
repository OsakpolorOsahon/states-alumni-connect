# 🚀 SMMOWCUB Complete Deployment Guide
## Step-by-Step Instructions (So Simple a 10-Year-Old Can Follow!)

Welcome! This guide will help you put your SMMOWCUB website on the internet so everyone can use it. Think of it like building a house and then putting it on a street so people can visit.

---

## 🎯 What We're Going to Do

We need to set up 4 important things:
1. **Supabase** - This stores all your member information (like a digital filing cabinet)
2. **UploadThing** - This stores photos and documents that members upload
3. **Resend** - This sends emails to members 
4. **Vercel** - This puts your website on the internet
5. **Google Maps** - This shows where members are located (map feature)

---

## 📋 What You'll Need Before Starting

- [ ] A computer with internet
- [ ] An email address 
- [ ] About 30-45 minutes of time
- [ ] This project code (which you already have!)

---

## 🗂️ Step 1: Create Your Supabase Database (Digital Filing Cabinet)

Supabase is like a giant digital filing cabinet that stores all your member information safely.

### 1.1 Sign Up for Supabase
1. Go to https://supabase.com
2. Click the big green **"Start your project"** button
3. Sign up with your email address
4. Check your email and click the confirmation link
5. You'll see a dashboard (like a control panel)

### 1.2 Create a New Project
1. Click **"New Project"** (big green button)
2. Choose a name: `smmowcub-database` 
3. Create a strong database password (write this down somewhere safe!)
4. Choose a region close to Nigeria (like "West Europe" or "East US")
5. Click **"Create new project"**
6. Wait 2-3 minutes for it to set up (perfect time for a quick break!)

### 1.3 Set Up Your Database Tables
This is like creating organized folders in your filing cabinet.

1. In your Supabase dashboard, click **"SQL Editor"** in the left menu
2. Click **"New query"**
3. Copy the entire SQL code from the box below and paste it:

```sql
-- ============================================
-- COMPLETE SMMOWCUB DATABASE SCHEMA
-- This creates all the tables your website needs
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all enum types (these are like dropdown lists)
CREATE TYPE user_role AS ENUM ('member', 'secretary');
CREATE TYPE member_status AS ENUM ('pending', 'active', 'inactive');
CREATE TYPE mentorship_status AS ENUM ('pending', 'active', 'completed');
CREATE TYPE notification_type AS ENUM ('general', 'approval', 'badge', 'hall_of_fame', 'job', 'mentorship');

-- Stateship years (all years from 1976 to 2026)
CREATE TYPE stateship_year_enum AS ENUM (
  '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985',
  '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995',
  '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005',
  '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015',
  '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'
);

-- MOWCUB military positions
CREATE TYPE last_position_enum AS ENUM (
  'Recruit', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Warrant Officer II',
  'Warrant Officer I', 'Second Lieutenant', 'Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel',
  'Colonel', 'Brigadier General', 'Major General', 'Lieutenant General', 'General'
);

-- Council office positions
CREATE TYPE council_office_enum AS ENUM (
  'President', 'Vice President', 'Secretary General', 'Assistant Secretary General',
  'Treasurer', 'Financial Secretary', 'Public Relations Officer', 'Welfare Officer',
  'Provost Marshal', 'Organizing Secretary', 'Member'
);

-- Create main tables
-- Members table - stores all member information
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Links to login account
  full_name TEXT NOT NULL,
  nickname TEXT,
  stateship_year stateship_year_enum NOT NULL,
  last_mowcub_position last_position_enum NOT NULL,
  current_council_office council_office_enum,
  photo_url TEXT, -- Photo storage
  dues_proof_url TEXT, -- Document storage
  latitude REAL, -- Map location
  longitude REAL, -- Map location
  paid_through TEXT, -- Dues tracking
  role user_role DEFAULT 'member',
  status member_status DEFAULT 'pending',
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Badges table - member achievements
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  badge_name TEXT NOT NULL,
  badge_code TEXT NOT NULL,
  description TEXT,
  awarded_by UUID REFERENCES members(id),
  awarded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Hall of Fame table - member honors
CREATE TABLE hall_of_fame (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  achievement_title TEXT NOT NULL,
  achievement_description TEXT,
  achievement_date TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- News table - announcements
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Forum threads table - discussion topics
CREATE TABLE forum_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID REFERENCES members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Forum replies table - discussion responses
CREATE TABLE forum_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES members(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job posts table - career opportunities
CREATE TABLE job_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  posted_by UUID REFERENCES members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  salary_range TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Job applications table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES members(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Mentorship requests table
CREATE TABLE mentorship_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mentee_id UUID REFERENCES members(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES members(id) ON DELETE CASCADE,
  request_message TEXT,
  status mentorship_status DEFAULT 'pending',
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID REFERENCES members(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP NOT NULL,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_stateship_year ON members(stateship_year);
CREATE INDEX idx_members_location ON members(latitude, longitude);
CREATE INDEX idx_badges_member_id ON badges(member_id);
CREATE INDEX idx_forum_threads_pinned ON forum_threads(is_pinned, updated_at);
CREATE INDEX idx_forum_replies_thread_id ON forum_replies(thread_id);
CREATE INDEX idx_job_posts_active ON job_posts(is_active, created_at);
CREATE INDEX idx_notifications_member_id ON notifications(member_id);

-- Enable Row Level Security for data protection
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_of_fame ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Members can view active members" ON members
  FOR SELECT USING (status = 'active');

CREATE POLICY "Members can update own profile" ON members
  FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Everyone can view published news" ON news
  FOR SELECT USING (is_published = true);

CREATE POLICY "Everyone can view forum threads" ON forum_threads
  FOR SELECT USING (true);

CREATE POLICY "Everyone can view forum replies" ON forum_replies
  FOR SELECT USING (true);

CREATE POLICY "Everyone can view active job posts" ON job_posts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Everyone can view events" ON events
  FOR SELECT USING (true);

-- Insert sample data for testing
INSERT INTO members (
  user_id, 
  full_name, 
  nickname, 
  stateship_year, 
  last_mowcub_position, 
  current_council_office,
  role,
  status,
  approved_at,
  latitude,
  longitude
) VALUES (
  gen_random_uuid(),
  'Test Secretary',
  'TestSec',
  '2020',
  'Captain',
  'Secretary General',
  'secretary',
  'active',
  NOW(),
  6.5244,
  3.3792
);
```

4. Click **"Run"** (bottom right of the editor)
5. You should see "Success. No rows returned" - that's perfect!

### 1.4 Get Your Database Connection Details
1. Click **"Settings"** in the left menu
2. Click **"Database"** 
3. Scroll down to **"Connection string"**
4. Copy the **"URI"** string (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@...`)
5. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with the database password you created earlier
6. Save this connection string somewhere safe - you'll need it later!

### 1.5 Get Your API Keys
1. Click **"Settings"** → **"API"**
2. Copy these two keys and save them safely:
   - **anon public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
   - **service_role secret key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
3. Copy your **Project URL** (looks like: `https://yourproject.supabase.co`)

✅ **Checkpoint:** You now have a database ready! Your digital filing cabinet is set up.

---

## 📸 Step 2: Set Up UploadThing (Photo & Document Storage)

UploadThing is like a digital photo album and document folder for your website.

### 2.1 Create UploadThing Account
1. Go to https://uploadthing.com
2. Click **"Get Started"** 
3. Sign up with GitHub, Google, or email
4. Verify your email if needed

### 2.2 Create Your App
1. Click **"Create a new app"**
2. App name: `smmowcub-files`
3. Click **"Create App"**

### 2.3 Get Your API Keys
1. In your UploadThing dashboard, click **"API Keys"**
2. Copy these two keys:
   - **UPLOADTHING_SECRET** (keep this super secret!)
   - **UPLOADTHING_APP_ID** 

✅ **Checkpoint:** You can now store photos and documents safely!

---

## 📧 Step 3: Set Up Resend (Email Service)

Resend sends emails to your members when they sign up or get approved.

### 3.1 Create Resend Account
1. Go to https://resend.com
2. Click **"Get Started"**
3. Sign up with your email
4. Verify your email address

### 3.2 Get Your API Key
1. In your Resend dashboard, click **"API Keys"** in the left menu
2. Click **"Create API Key"**
3. Name: `smmowcub-emails`
4. Permission: **"Sending access"**
5. Click **"Add"**
6. Copy the API key (starts with `re_...`) and save it safely

### 3.3 Set Up Your Domain (Optional but Recommended)
1. Click **"Domains"** in the left menu
2. Click **"Add Domain"**
3. Enter your domain (like `smmowcub.org`) if you have one
4. Follow the DNS setup instructions
5. If you don't have a domain, you can skip this and use the default for now

✅ **Checkpoint:** Email system is ready to notify members!

---

## 🗺️ Step 4: Set Up Google Maps (Member Location Map)

This lets members see where other members are located on an interactive map.

### 4.1 Create Google Cloud Account
1. Go to https://console.cloud.google.com
2. Sign in with your Google account (create one if needed)
3. Accept the terms and conditions

### 4.2 Create a New Project
1. Click the project dropdown at the top
2. Click **"New Project"**
3. Project name: `smmowcub-maps`
4. Click **"Create"**
5. Select your new project from the dropdown

### 4.3 Enable Maps API
1. Click **"Enable APIs and Services"**
2. Search for "Maps JavaScript API"
3. Click on it and click **"Enable"**
4. Also search for and enable:
   - "Geocoding API"
   - "Places API"

### 4.4 Create API Key
1. Click **"Credentials"** in the left menu
2. Click **"Create Credentials"** → **"API Key"**
3. Copy your API key (starts with `AIza...`)
4. Click **"Restrict Key"** for security:
   - Application restrictions: **"HTTP referrers"**
   - Add your website URL (like `https://smmowcub.vercel.app/*`)
   - API restrictions: Select only the 3 APIs you enabled above
5. Save the restricted key

✅ **Checkpoint:** Map feature is ready to show member locations!

---

## 🌐 Step 5: Deploy to Vercel (Put Your Website on the Internet)

Vercel is like renting a space on the internet where people can visit your website.

### 5.1 Prepare Your Code
First, let's make sure your code has all the right settings:

1. Open your project folder
2. Create a file called `.env.local` and add these lines (replace with your actual keys):

```
# Supabase Configuration
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
DATABASE_URL=your_database_connection_string_here

# UploadThing Configuration  
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# Resend Configuration
RESEND_API_KEY=your_resend_api_key_here

# Google Maps Configuration
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# Frontend Environment Variables (for the website)
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_UPLOADTHING_APP_ID=your_uploadthing_app_id_here
```

### 5.2 Upload to GitHub
1. Go to https://github.com
2. Sign up/sign in to your account
3. Click **"New repository"** 
4. Repository name: `smmowcub-website`
5. Make it **"Public"** 
6. Click **"Create repository"**
7. Follow the instructions to upload your code (use GitHub Desktop app for easier upload)

### 5.3 Deploy with Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"** and use your GitHub account
3. Click **"Import Project"**
4. Find your `smmowcub-website` repository and click **"Import"**
5. **IMPORTANT:** Configure these settings:
   - Framework Preset: **"Vite"**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 5.4 Add Environment Variables to Vercel
1. In your Vercel project dashboard, click **"Settings"**
2. Click **"Environment Variables"**
3. Add each variable from your `.env.local` file:
   - Name: `SUPABASE_URL`, Value: `https://yourproject.supabase.co`
   - Name: `SUPABASE_ANON_KEY`, Value: your anon key
   - Name: `SUPABASE_SERVICE_ROLE_KEY`, Value: your service role key
   - Name: `DATABASE_URL`, Value: your database connection string
   - Name: `UPLOADTHING_SECRET`, Value: your UploadThing secret
   - Name: `UPLOADTHING_APP_ID`, Value: your UploadThing app ID
   - Name: `RESEND_API_KEY`, Value: your Resend API key
   - Name: `VITE_GOOGLE_MAPS_API_KEY`, Value: your Google Maps API key
   - Name: `VITE_SUPABASE_URL`, Value: `https://yourproject.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`, Value: your anon key
   - Name: `VITE_UPLOADTHING_APP_ID`, Value: your UploadThing app ID

4. Click **"Save"** after each one

### 5.5 Deploy Your Website
1. Click **"Deployments"** tab
2. Click **"Redeploy"** to deploy with the new environment variables
3. Wait 2-3 minutes for deployment to complete
4. Click on your deployment URL (looks like: `https://smmowcub-website.vercel.app`)

✅ **Checkpoint:** Your website is now live on the internet!

---

## 🎉 Step 6: Test Everything Works

Let's make sure all features work properly:

### 6.1 Test Basic Website
1. Visit your Vercel URL
2. Check that the homepage loads
3. Navigate through different pages (About, Contact, etc.)
4. Make sure everything looks good

### 6.2 Test Member Registration
1. Click **"Sign Up"** 
2. Create a test account with:
   - Email: `test@example.com`
   - Password: `testpass123`
   - Fill in member details
3. Check if you receive a confirmation email

### 6.3 Test Google Maps
1. Go to the **"Map"** page
2. Check if the map loads properly
3. Test if member locations show up

### 6.4 Test Secretary Functions
1. Log in to Supabase dashboard
2. Go to **"Table Editor"** → **"members"**
3. Find your test member and change `role` to `secretary` and `status` to `active`
4. Log out and log back in to your website
5. You should now see secretary options (member management, etc.)

### 6.5 Test File Uploads
1. Try uploading a profile photo
2. Try uploading a dues proof document
3. Check if files appear correctly

---

## 🔧 Step 7: Final Configuration

### 7.1 Update Google Maps Restrictions
1. Go back to Google Cloud Console
2. Update your API key restrictions to include your new Vercel URL
3. Add both:
   - `https://yourproject.vercel.app/*`
   - `http://localhost:*` (for testing)

### 7.2 Update Supabase Auth Settings
1. In Supabase dashboard, go to **"Authentication"** → **"Settings"**
2. Add your Vercel URL to **"Site URL"**
3. Add your Vercel URL to **"Redirect URLs"**

### 7.3 Set Up Custom Domain (Optional)
If you have a custom domain like `smmowcub.org`:
1. In Vercel, go to **"Settings"** → **"Domains"**
2. Add your custom domain
3. Update your DNS settings as instructed
4. Update all API restrictions to use your custom domain

---

## 🚨 Troubleshooting Common Issues

### Problem: Website shows "Environment variable missing"
**Solution:** Double-check all environment variables in Vercel settings

### Problem: Database connection fails
**Solution:** Make sure your DATABASE_URL has the correct password and format

### Problem: Maps don't load
**Solution:** Check that your Google Maps API key is correct and has proper restrictions

### Problem: Emails not sending
**Solution:** Verify your Resend API key and domain setup

### Problem: File uploads fail
**Solution:** Check your UploadThing API keys and app ID

---

## ✅ Final Checklist

Before announcing your website to members:

- [ ] Website loads properly on desktop and mobile
- [ ] Member registration works
- [ ] Email notifications are sent
- [ ] File uploads work (photos and documents)
- [ ] Google Maps displays correctly
- [ ] Secretary can approve/reject members
- [ ] All pages (About, Contact, Directory, etc.) work
- [ ] Forum discussions work
- [ ] Job board functions properly
- [ ] Member directory shows correctly
- [ ] Hall of Fame displays properly

---

## 🎊 Congratulations!

Your SMMOWCUB website is now live and ready for members to use! 

**Your website URL:** `https://[your-project-name].vercel.app`

### What Members Can Now Do:
1. **Register** for membership online
2. **Upload** their photos and dues proof
3. **View** the member directory and map
4. **Participate** in forum discussions
5. **Apply** for jobs posted by other members
6. **Request** mentorship from senior members
7. **View** news and announcements
8. **See** Hall of Fame achievements

### What Secretaries Can Do:
1. **Approve/reject** new member applications
2. **Manage** member information
3. **Post** news and announcements
4. **Award** badges to members
5. **Add** Hall of Fame entries
6. **Moderate** forum discussions

---

## 🔄 Keeping Your Website Updated

### To Add New Features:
1. Update your code
2. Push changes to GitHub
3. Vercel automatically deploys updates

### To Backup Your Data:
1. In Supabase, go to **"Settings"** → **"Database"**
2. Click **"Database backups"**
3. Enable automatic backups

### To Monitor Your Website:
1. Check Vercel dashboard for deployment status
2. Monitor Supabase for database performance
3. Check UploadThing for file storage usage

---

**Need Help?** 
- Check the error logs in Vercel dashboard
- Review Supabase logs for database issues
- Contact support for any third-party services

**Your SMMOWCUB community website is now ready to bring members together! 🎉**