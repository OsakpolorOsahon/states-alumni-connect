# SMMOWCUB Vercel Deployment Checklist

## ⚠️ CRITICAL: Database Setup Required

Your signup is failing because your Supabase database doesn't have the required tables yet. You MUST run the database migration first.

### 1. **Run Database Migration in Supabase**

Go to your Supabase project → SQL Editor → New Query and run this COMPLETE SQL:

```sql
-- Copy and paste the ENTIRE content from migrations/0000_huge_skaar.sql
-- This creates all tables, enums, and foreign key relationships

CREATE TYPE "public"."council_office_enum" AS ENUM('President', 'Vice President', 'Secretary General', 'Assistant Secretary General', 'Treasurer', 'Financial Secretary', 'Public Relations Officer', 'Welfare Officer', 'Provost Marshal', 'Organizing Secretary', 'Member');
CREATE TYPE "public"."last_position_enum" AS ENUM('Recruit', 'Lance Corporal', 'Corporal', 'Sergeant', 'Staff Sergeant', 'Warrant Officer II', 'Warrant Officer I', 'Second Lieutenant', 'Lieutenant', 'Captain', 'Major', 'Lieutenant Colonel', 'Colonel', 'Brigadier General', 'Major General', 'Lieutenant General', 'General');
CREATE TYPE "public"."member_status" AS ENUM('pending', 'active', 'inactive');
CREATE TYPE "public"."mentorship_status" AS ENUM('pending', 'active', 'completed');
CREATE TYPE "public"."notification_type" AS ENUM('general', 'approval', 'badge', 'hall_of_fame', 'job', 'mentorship');
CREATE TYPE "public"."stateship_year_enum" AS ENUM('1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026');
CREATE TYPE "public"."user_role" AS ENUM('member', 'secretary');

CREATE TABLE "badges" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "member_id" uuid,
        "badge_name" text NOT NULL,
        "badge_code" text NOT NULL,
        "description" text,
        "awarded_by" uuid,
        "awarded_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "events" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "organizer_id" uuid,
        "title" text NOT NULL,
        "description" text,
        "event_date" timestamp NOT NULL,
        "location" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "forum_replies" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "thread_id" uuid,
        "author_id" uuid,
        "content" text NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "forum_threads" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "author_id" uuid,
        "title" text NOT NULL,
        "content" text NOT NULL,
        "is_pinned" boolean DEFAULT false,
        "is_locked" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "hall_of_fame" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "member_id" uuid,
        "achievement_title" text NOT NULL,
        "achievement_description" text,
        "achievement_date" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "job_applications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "job_id" uuid,
        "applicant_id" uuid,
        "cover_letter" text,
        "resume_url" text,
        "status" text DEFAULT 'pending',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "job_posts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "posted_by" uuid,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "company" text NOT NULL,
        "location" text,
        "salary_range" text,
        "is_active" boolean DEFAULT true,
        "expires_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "members" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" uuid,
        "full_name" text NOT NULL,
        "nickname" text,
        "stateship_year" "stateship_year_enum" NOT NULL,
        "last_mowcub_position" "last_position_enum" NOT NULL,
        "current_council_office" "council_office_enum",
        "photo_url" text,
        "dues_proof_url" text,
        "latitude" real,
        "longitude" real,
        "paid_through" text,
        "role" "user_role" DEFAULT 'member',
        "status" "member_status" DEFAULT 'pending',
        "approved_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "mentorship_requests" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "mentee_id" uuid,
        "mentor_id" uuid,
        "request_message" text,
        "status" "mentorship_status" DEFAULT 'pending',
        "responded_at" timestamp,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "news" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "author_id" uuid,
        "title" text NOT NULL,
        "content" text NOT NULL,
        "is_published" boolean DEFAULT false,
        "published_at" timestamp,
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "notifications" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "member_id" uuid,
        "title" text NOT NULL,
        "message" text NOT NULL,
        "type" "notification_type" DEFAULT 'general',
        "is_read" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
);

CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        CONSTRAINT "users_username_unique" UNIQUE("username")
);

-- Foreign Key Constraints
ALTER TABLE "badges" ADD CONSTRAINT "badges_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "badges" ADD CONSTRAINT "badges_awarded_by_members_id_fk" FOREIGN KEY ("awarded_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_members_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_thread_id_forum_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_threads"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_author_id_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_author_id_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "hall_of_fame" ADD CONSTRAINT "hall_of_fame_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_job_posts_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."job_posts"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_applicant_id_members_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "job_posts" ADD CONSTRAINT "job_posts_posted_by_members_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentee_id_members_id_fk" FOREIGN KEY ("mentee_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "mentorship_requests" ADD CONSTRAINT "mentorship_requests_mentor_id_members_id_fk" FOREIGN KEY ("mentor_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "news" ADD CONSTRAINT "news_author_id_members_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
```

### 2. **Set Environment Variables in Vercel**

Go to your Vercel project dashboard → Settings → Environment Variables and add:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. **Optional: Set Up UploadThing (for file uploads)**

If you want member photo and document uploads:
1. Go to [uploadthing.com](https://uploadthing.com)
2. Create account and get API keys
3. Add to Vercel environment variables:
```
UPLOADTHING_SECRET=your_secret_key
UPLOADTHING_APP_ID=your_app_id
```

### 4. **Optional: Set Up Resend (for emails)**

For email notifications:
1. Go to [resend.com](https://resend.com)
2. Get API key
3. Add to Vercel:
```
RESEND_API_KEY=your_resend_api_key
```

### 5. **Redeploy Your Application**

After setting environment variables, trigger a new Vercel deployment:
- Push a small change to your repository, OR
- Go to Vercel dashboard → Deployments → Redeploy

## ✅ **Testing Checklist After Deployment:**

1. **Signup Test**: Try creating a new account with full information
2. **Directory Access**: Check if public member directory loads
3. **Login Test**: Test existing user login
4. **Secretary Functions**: Test admin features if you have secretary access

## 🚨 **If You Still Get Errors:**

- Check Vercel function logs for detailed error messages
- Verify Supabase database tables were created successfully
- Ensure all environment variables are set correctly
- Test locally first to confirm everything works

The main issue was your database didn't have the required tables yet. Once you run the SQL migration in Supabase, your signup should work perfectly!