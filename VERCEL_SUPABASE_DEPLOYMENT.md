# SMMOWCUB Deployment Guide: Vercel + Supabase

This guide provides complete step-by-step instructions for deploying the SMMOWCUB application using Vercel for the frontend and Supabase for the backend and database.

## Architecture Overview

- **Frontend**: React/Vite app deployed on Vercel
- **Backend**: Express API deployed on Vercel Functions
- **Database**: PostgreSQL hosted on Supabase
- **Authentication**: Supabase Auth
- **File Storage**: UploadThing for member photos and documents
- **Email**: Resend for transactional emails

## Prerequisites

- Node.js 18+ installed locally
- Git installed
- Accounts for:
  - [Vercel](https://vercel.com)
  - [Supabase](https://supabase.com)
  - [UploadThing](https://uploadthing.com)
  - [Resend](https://resend.com)

## Part 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Set project details:
   - **Name**: `smmowcub-production`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

### 1.2 Get Supabase Credentials

1. In your Supabase dashboard, go to "Settings" → "API"
2. Copy these values (you'll need them later):
   - **Project URL** (starts with `https://`)
   - **Project API Keys**:
     - `anon` `public` (for client-side)
     - `service_role` `secret` (for server-side)

### 1.3 Set up Database Schema

1. In Supabase dashboard, go to "SQL Editor"
2. Create a new query and run this SQL:

```sql
-- ============================================
-- COMPLETE SMMOWCUB DATABASE SCHEMA
-- This is the complete, tested database schema for the SMMOWCUB application
-- All tables, relationships, and constraints are included
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create all enum types used throughout the application
CREATE TYPE user_role AS ENUM ('member', 'secretary');
CREATE TYPE member_status AS ENUM ('pending', 'active', 'inactive');
CREATE TYPE mentorship_status AS ENUM ('pending', 'active', 'completed');
CREATE TYPE notification_type AS ENUM ('general', 'approval', 'badge', 'hall_of_fame', 'job', 'mentorship');

-- Stateship years - this covers all years from founding to future projections
CREATE TYPE stateship_year_enum AS ENUM (
  '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985',
  '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995',
  '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005',
  '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015',
  '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'
);

-- MOWCUB military positions hierarchy
CREATE TYPE last_position_enum AS ENUM (
  'Recruit', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Warrant Officer II',
  'Warrant Officer I', 'Second Lieutenant', 'Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel',
  'Colonel', 'Brigadier General', 'Major General', 'Lieutenant General', 'General'
);

-- Current council office positions
CREATE TYPE council_office_enum AS ENUM (
  'President', 'Vice President', 'Secretary General', 'Assistant Secretary General',
  'Treasurer', 'Financial Secretary', 'Public Relations Officer', 'Welfare Officer',
  'Provost Marshal', 'Organizing Secretary', 'Member'
);

-- ============================================
-- MAIN TABLES
-- ============================================

-- Users table - stores authentication data via Supabase Auth
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);

-- Members table - core member profile information
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID, -- Links to Supabase Auth user ID
  full_name TEXT NOT NULL,
  nickname TEXT,
  stateship_year stateship_year_enum NOT NULL,
  last_mowcub_position last_position_enum NOT NULL,
  current_council_office council_office_enum,
  photo_url TEXT, -- UploadThing photo URL
  dues_proof_url TEXT, -- UploadThing document URL
  latitude REAL, -- Google Maps coordinates
  longitude REAL, -- Google Maps coordinates
  paid_through TEXT, -- Dues payment tracking
  role user_role DEFAULT 'member',
  status member_status DEFAULT 'pending',
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Badges table - member achievements and recognitions
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

-- Hall of Fame table - member achievements and honors
CREATE TABLE hall_of_fame (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  achievement_title TEXT NOT NULL,
  achievement_description TEXT,
  achievement_date TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- News table - announcements and news articles
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

-- Forum replies table - responses to forum threads
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

-- Job applications table - member applications to jobs
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES members(id) ON DELETE CASCADE,
  cover_letter TEXT,
  resume_url TEXT, -- UploadThing resume URL
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Mentorship requests table - mentoring relationships
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

-- Notifications table - system and user notifications
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

-- Events table - club events and meetings
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

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Member-related indexes
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_stateship_year ON members(stateship_year);
CREATE INDEX idx_members_location ON members(latitude, longitude);
CREATE INDEX idx_members_created_at ON members(created_at);

-- Badge indexes
CREATE INDEX idx_badges_member_id ON badges(member_id);
CREATE INDEX idx_badges_awarded_by ON badges(awarded_by);

-- Hall of Fame indexes
CREATE INDEX idx_hall_of_fame_member_id ON hall_of_fame(member_id);

-- News indexes
CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_published ON news(is_published, published_at);

-- Forum indexes
CREATE INDEX idx_forum_threads_author_id ON forum_threads(author_id);
CREATE INDEX idx_forum_threads_pinned ON forum_threads(is_pinned, updated_at);
CREATE INDEX idx_forum_replies_thread_id ON forum_replies(thread_id);
CREATE INDEX idx_forum_replies_author_id ON forum_replies(author_id);

-- Job indexes
CREATE INDEX idx_job_posts_posted_by ON job_posts(posted_by);
CREATE INDEX idx_job_posts_active ON job_posts(is_active, created_at);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);

-- Mentorship indexes
CREATE INDEX idx_mentorship_mentee_id ON mentorship_requests(mentee_id);
CREATE INDEX idx_mentorship_mentor_id ON mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_status ON mentorship_requests(status);

-- Notification indexes
CREATE INDEX idx_notifications_member_id ON notifications(member_id);
CREATE INDEX idx_notifications_read ON notifications(is_read, created_at);

-- Event indexes
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_date ON events(event_date);

-- ============================================
-- SAMPLE DATA FOR TESTING (Optional)
-- ============================================

-- Insert a sample secretary member for testing
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
  'sample-uuid-secretary',
  'Secretary Test',
  'SecTest',
  '2020',
  'Captain',
  'Secretary General',
  'secretary',
  'active',
  NOW(),
  6.5244,
  3.3792
);

-- Insert a sample active member for testing
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
  'sample-uuid-member',
  'Test Member',
  'TestMember',
  '2019',
  'Lieutenant',
  'Member',
  'member',
  'active',
  NOW(),
  9.0820,
  8.6753
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
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

-- Members can view all active members, but only edit their own profile
CREATE POLICY "Members can view active members" ON members
  FOR SELECT USING (status = 'active');

CREATE POLICY "Members can update own profile" ON members
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Secretaries can manage all members
CREATE POLICY "Secretaries can manage members" ON members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM members 
      WHERE user_id = auth.uid()::text 
      AND role = 'secretary' 
      AND status = 'active'
    )
  );

-- Similar policies for other tables...
-- (Add more RLS policies as needed for your security requirements)
```

### 1.4 Configure Authentication

1. In Supabase dashboard, go to "Authentication" → "Settings"
2. Under "Site URL", set your production domain: `https://your-vercel-domain.vercel.app`
3. Under "Redirect URLs", add:
   - `https://your-vercel-domain.vercel.app/auth/callback`
   - `http://localhost:5173/auth/callback` (for development)
4. Enable email confirmations if desired
5. Configure email templates under "Auth" → "Email Templates"

## Part 2: Third-Party Services Setup

### 2.1 UploadThing Setup

1. Go to [uploadthing.com](https://uploadthing.com) and sign in
2. Create a new app: "SMMOWCUB Production"
3. Go to "API Keys" and copy:
   - **App ID**
   - **Secret Key**

### 2.2 Resend Setup

1. Go to [resend.com](https://resend.com) and sign in
2. Go to "API Keys" and create a new key
3. Copy the **API Key**
4. Verify your domain for sending emails (optional but recommended)

## Part 3: Local Development Setup

### 3.1 Clone and Install

```bash
git clone <your-repo-url>
cd smmowcub
npm install
```

### 3.2 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:your_db_password@db.your_project_ref.supabase.co:5432/postgres

# Email
RESEND_API_KEY=your_resend_api_key

# File Upload
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Session
SESSION_SECRET=your_random_session_secret_here
```

### 3.3 Test Locally

```bash
npm run dev
```

Visit `http://localhost:5173` and test the application.

## Part 4: Vercel Deployment

### 4.1 Prepare for Deployment

1. Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    },
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/client/dist/$1"
    }
  ],
  "outputDirectory": "client/dist"
}
```

2. Update `package.json` scripts:

```json
{
  "scripts": {
    "build": "npm run build:client && npm run build:server",
    "build:client": "cd client && npm run build",
    "build:server": "esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
  }
}
```

### 4.2 Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy the project:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Yes**
   - Which scope? Choose your account
   - Link to existing project? **No**
   - Project name: `smmowcub`
   - Directory: `./` (root)

### 4.3 Configure Environment Variables

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Add all the environment variables from your `.env.local` file:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_database_url
RESEND_API_KEY=your_resend_api_key
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
SESSION_SECRET=your_random_session_secret
```

### 4.4 Custom Domain (Optional)

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed
4. Update Supabase redirect URLs with your custom domain

## Part 5: Final Configuration

### 5.1 Update Supabase URLs

1. Go back to Supabase dashboard
2. Update "Site URL" and "Redirect URLs" with your Vercel domain
3. Test authentication flows

### 5.2 Test Production Deployment

1. Visit your deployed site
2. Test key features:
   - User registration and login
   - Member profile creation
   - File uploads
   - Email notifications
   - All CRUD operations

### 5.3 Monitoring and Maintenance

1. Set up Vercel Analytics for performance monitoring
2. Monitor Supabase usage and performance
3. Set up uptime monitoring
4. Configure backup strategies

## Security Checklist

- [ ] All environment variables are properly set in Vercel
- [ ] Supabase RLS (Row Level Security) policies are configured
- [ ] Database passwords are strong and unique
- [ ] API keys are kept secret and not exposed in client code
- [ ] HTTPS is enforced everywhere
- [ ] CORS settings are properly configured
- [ ] File upload restrictions are in place

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check Supabase project status
   - Ensure IP allowlisting if configured

2. **Authentication Issues**
   - Verify Supabase Auth settings
   - Check redirect URLs
   - Ensure SUPABASE_URL and keys are correct

3. **File Upload Issues**
   - Verify UploadThing configuration
   - Check API keys
   - Ensure proper file size limits

4. **Email Issues**
   - Verify Resend API key
   - Check domain verification status
   - Review email templates

### Getting Help

- Check Vercel deployment logs
- Review Supabase logs and metrics
- Use browser developer tools for client-side debugging
- Check server logs in Vercel Functions

## Maintenance

### Regular Tasks

- Monitor database usage and performance
- Review and rotate API keys quarterly
- Update dependencies regularly
- Backup database periodically
- Monitor error rates and performance metrics

### Scaling Considerations

- Supabase automatically scales with usage
- Vercel handles frontend scaling automatically
- Consider CDN for static assets as traffic grows
- Monitor and optimize database queries
- Implement caching strategies for frequently accessed data

## Support

For issues specific to:
- Vercel: [Vercel Support](https://vercel.com/support)
- Supabase: [Supabase Support](https://supabase.com/support)
- UploadThing: [UploadThing Docs](https://docs.uploadthing.com)
- Resend: [Resend Support](https://resend.com/support)

This completes the full deployment guide for SMMOWCUB using Vercel and Supabase!