-- ============================================================================
-- SMMOWCUB - Senior Members Man O' War Club University of Benin
-- Complete Supabase Database Setup
-- ============================================================================
--
-- DEPLOYMENT INSTRUCTIONS:
-- ========================
--
-- STEP 1: CREATE A NEW SUPABASE PROJECT
--   1. Go to https://supabase.com and sign in
--   2. Click "New Project"
--   3. Choose your organization
--   4. Enter a project name (e.g., "smmowcub")
--   5. Set a strong database password (save this somewhere safe)
--   6. Choose a region close to your users
--   7. Click "Create new project" and wait for it to finish setting up
--
-- STEP 2: RUN THIS SQL
--   1. In your new Supabase project, go to "SQL Editor" in the left sidebar
--   2. Click "New query"
--   3. Paste this ENTIRE file into the editor
--   4. Click "Run" (or press Ctrl+Enter / Cmd+Enter)
--   5. You should see "Success. No rows returned" - that means it worked
--
-- STEP 3: GET YOUR SUPABASE CREDENTIALS
--   1. Go to "Settings" > "API" in your Supabase dashboard
--   2. Copy these values:
--      - Project URL (e.g., https://xxxxx.supabase.co)
--      - anon/public key (starts with "eyJ...")
--      - service_role key (starts with "eyJ..." - keep this secret!)
--
-- STEP 4: CONFIGURE YOUR VERCEL DEPLOYMENT
--   1. Go to your Vercel project settings > "Environment Variables"
--   2. Add these environment variables:
--      - VITE_SUPABASE_URL = your Project URL
--      - VITE_SUPABASE_ANON_KEY = your anon/public key
--      - SUPABASE_URL = your Project URL (same as above)
--      - SUPABASE_ANON_KEY = your anon/public key (same as above)
--      - SUPABASE_SERVICE_ROLE_KEY = your service_role key
--   3. Redeploy your Vercel project for the changes to take effect
--
-- STEP 5: CONFIGURE SUPABASE AUTH (IMPORTANT!)
--   1. In Supabase, go to "Authentication" > "URL Configuration"
--   2. Set "Site URL" to your Vercel deployment URL
--      (e.g., https://your-app.vercel.app)
--   3. Under "Redirect URLs", add:
--      - https://your-app.vercel.app/*
--      - https://your-app.vercel.app/upload-documents
--      - https://your-app.vercel.app/login
--      - https://your-app.vercel.app/dashboard
--   4. Go to "Authentication" > "Providers" > "Email"
--   5. Make sure "Enable Email Provider" is ON
--   6. Optionally disable "Confirm email" for easier testing
--
-- STEP 6: CONFIGURE REPLIT (FOR DEVELOPMENT)
--   1. In your Replit project, go to "Secrets" (lock icon)
--   2. Add the same environment variables as Step 4
--   3. Restart the application
--
-- ============================================================================
-- That's it! Your database is ready. The frontend and backend will
-- connect automatically using these environment variables.
-- ============================================================================


-- ============================================================================
-- SECTION 1: CLEANUP (safe to run on fresh or existing databases)
-- ============================================================================

DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS job_posts CASCADE;
DROP TABLE IF EXISTS mentorship_requests CASCADE;
DROP TABLE IF EXISTS forum_replies CASCADE;
DROP TABLE IF EXISTS forum_threads CASCADE;
DROP TABLE IF EXISTS badges CASCADE;
DROP TABLE IF EXISTS hall_of_fame CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS members CASCADE;


-- ============================================================================
-- SECTION 2: CREATE TABLES
-- ============================================================================

-- Members table: core user profiles linked to Supabase Auth
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE NOT NULL,
  full_name text NOT NULL,
  nickname text,
  stateship_year text NOT NULL,
  last_mowcub_position text NOT NULL,
  mowcub_position text,
  current_council_office text,
  photo_url text,
  dues_proof_url text,
  latitude real,
  longitude real,
  location text,
  paid_through text,
  role text NOT NULL DEFAULT 'member',
  status text NOT NULL DEFAULT 'pending',
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT members_role_check CHECK (role IN ('member', 'secretary')),
  CONSTRAINT members_status_check CHECK (status IN ('pending', 'active', 'inactive'))
);

-- Badges table: achievements awarded to members
CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  badge_name text NOT NULL,
  badge_code text NOT NULL,
  description text,
  awarded_by uuid REFERENCES members(id) ON DELETE SET NULL,
  awarded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Hall of Fame table: notable achievements by members
CREATE TABLE hall_of_fame (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  achievement_title text NOT NULL,
  achievement_description text,
  achievement_date text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- News table: articles and announcements
CREATE TABLE news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES members(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  excerpt text,
  category text,
  is_published boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT news_status_check CHECK (status IN ('draft', 'published'))
);

-- Forum threads table: discussion topics
CREATE TABLE forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid REFERENCES members(id) ON DELETE SET NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  is_pinned boolean NOT NULL DEFAULT false,
  is_locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Forum replies table: responses to forum threads
CREATE TABLE forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES forum_threads(id) ON DELETE CASCADE,
  author_id uuid REFERENCES members(id) ON DELETE SET NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Job posts table: job opportunities shared by members
CREATE TABLE job_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by uuid REFERENCES members(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL,
  company text NOT NULL,
  location text,
  job_type text,
  salary_range text,
  salary_min integer,
  salary_max integer,
  requirements text,
  contact_email text,
  is_active boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'active',
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT job_posts_status_check CHECK (status IN ('active', 'closed'))
);

-- Job applications table: applications to job posts
CREATE TABLE job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES job_posts(id) ON DELETE CASCADE,
  applicant_id uuid REFERENCES members(id) ON DELETE CASCADE,
  cover_letter text,
  resume_url text,
  status text NOT NULL DEFAULT 'pending',
  applied_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Mentorship requests table: mentorship matching
CREATE TABLE mentorship_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentee_id uuid,
  mentor_id uuid,
  CONSTRAINT mentorship_requests_mentee_id_fkey FOREIGN KEY (mentee_id) REFERENCES members(id) ON DELETE CASCADE,
  CONSTRAINT mentorship_requests_mentor_id_fkey FOREIGN KEY (mentor_id) REFERENCES members(id) ON DELETE SET NULL,
  request_message text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  matched_at timestamptz,
  completed_at timestamptz,
  responded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mentorship_status_check CHECK (status IN ('pending', 'active', 'completed'))
);

-- Notifications table: user notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'general',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notification_type_check CHECK (type IN ('general', 'approval', 'badge', 'hall_of_fame', 'job', 'mentorship'))
);

-- Events table: community events
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES members(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  event_date timestamptz,
  date text,
  location text,
  organizer text,
  max_attendees integer,
  is_public boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'upcoming',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_status_check CHECK (status IN ('upcoming', 'completed', 'cancelled'))
);


-- ============================================================================
-- SECTION 3: INDEXES (for fast queries)
-- ============================================================================

CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_role ON members(role);
CREATE INDEX idx_members_stateship_year ON members(stateship_year);
CREATE INDEX idx_members_created_at ON members(created_at DESC);

CREATE INDEX idx_badges_member_id ON badges(member_id);
CREATE INDEX idx_badges_awarded_at ON badges(awarded_at DESC);

CREATE INDEX idx_hall_of_fame_member_id ON hall_of_fame(member_id);
CREATE INDEX idx_hall_of_fame_created_at ON hall_of_fame(created_at DESC);

CREATE INDEX idx_news_author_id ON news(author_id);
CREATE INDEX idx_news_is_published ON news(is_published);
CREATE INDEX idx_news_status ON news(status);
CREATE INDEX idx_news_published_at ON news(published_at DESC);
CREATE INDEX idx_news_created_at ON news(created_at DESC);

CREATE INDEX idx_forum_threads_author_id ON forum_threads(author_id);
CREATE INDEX idx_forum_threads_created_at ON forum_threads(created_at DESC);
CREATE INDEX idx_forum_threads_is_pinned ON forum_threads(is_pinned);

CREATE INDEX idx_forum_replies_thread_id ON forum_replies(thread_id);
CREATE INDEX idx_forum_replies_author_id ON forum_replies(author_id);
CREATE INDEX idx_forum_replies_created_at ON forum_replies(created_at);

CREATE INDEX idx_job_posts_posted_by ON job_posts(posted_by);
CREATE INDEX idx_job_posts_is_active ON job_posts(is_active);
CREATE INDEX idx_job_posts_status ON job_posts(status);
CREATE INDEX idx_job_posts_created_at ON job_posts(created_at DESC);

CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);

CREATE INDEX idx_mentorship_requests_mentee_id ON mentorship_requests(mentee_id);
CREATE INDEX idx_mentorship_requests_mentor_id ON mentorship_requests(mentor_id);
CREATE INDEX idx_mentorship_requests_status ON mentorship_requests(status);

CREATE INDEX idx_notifications_member_id ON notifications(member_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_is_public ON events(is_public);
CREATE INDEX idx_events_status ON events(status);


-- ============================================================================
-- SECTION 4: AUTO-UPDATE TRIGGER (automatically sets updated_at on changes)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_badges_updated_at BEFORE UPDATE ON badges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_hall_of_fame_updated_at BEFORE UPDATE ON hall_of_fame FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_forum_threads_updated_at BEFORE UPDATE ON forum_threads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_forum_replies_updated_at BEFORE UPDATE ON forum_replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_job_posts_updated_at BEFORE UPDATE ON job_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_job_applications_updated_at BEFORE UPDATE ON job_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_mentorship_requests_updated_at BEFORE UPDATE ON mentorship_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_notifications_updated_at BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ============================================================================
-- SECTION 5: ROW LEVEL SECURITY (RLS)
-- ============================================================================

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


-- ========== MEMBERS POLICIES ==========

CREATE POLICY "service_role_full_access_members" ON members
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_active_members" ON members
  FOR SELECT TO anon
  USING (status = 'active');

CREATE POLICY "authenticated_read_active_members" ON members
  FOR SELECT TO authenticated
  USING (status = 'active');

CREATE POLICY "users_read_own_member_record" ON members
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "secretary_read_all_members" ON members
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM members m WHERE m.user_id = auth.uid() AND m.role = 'secretary'));

CREATE POLICY "users_insert_own_member_record" ON members
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_member_record" ON members
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "secretary_update_all_members" ON members
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM members m WHERE m.user_id = auth.uid() AND m.role = 'secretary'))
  WITH CHECK (EXISTS (SELECT 1 FROM members m WHERE m.user_id = auth.uid() AND m.role = 'secretary'));


-- ========== BADGES POLICIES ==========

CREATE POLICY "service_role_full_access_badges" ON badges
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anyone_can_read_badges" ON badges
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "secretary_insert_badges" ON badges
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_delete_badges" ON badges
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));


-- ========== HALL OF FAME POLICIES ==========

CREATE POLICY "service_role_full_access_hall_of_fame" ON hall_of_fame
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anyone_can_read_hall_of_fame" ON hall_of_fame
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "secretary_insert_hall_of_fame" ON hall_of_fame
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_update_hall_of_fame" ON hall_of_fame
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'))
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_delete_hall_of_fame" ON hall_of_fame
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));


-- ========== NEWS POLICIES ==========

CREATE POLICY "service_role_full_access_news" ON news
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anon_read_published_news" ON news
  FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "authenticated_read_all_news" ON news
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "secretary_insert_news" ON news
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_update_news" ON news
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'))
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_delete_news" ON news
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));


-- ========== FORUM THREADS POLICIES ==========

CREATE POLICY "service_role_full_access_forum_threads" ON forum_threads
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anyone_can_read_forum_threads" ON forum_threads
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "authenticated_insert_forum_threads" ON forum_threads
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_forum_threads" ON forum_threads
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_forum_threads" ON forum_threads
  FOR DELETE TO authenticated
  USING (true);


-- ========== FORUM REPLIES POLICIES ==========

CREATE POLICY "service_role_full_access_forum_replies" ON forum_replies
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anyone_can_read_forum_replies" ON forum_replies
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "authenticated_insert_forum_replies" ON forum_replies
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_delete_forum_replies" ON forum_replies
  FOR DELETE TO authenticated
  USING (true);


-- ========== JOB POSTS POLICIES ==========

CREATE POLICY "service_role_full_access_job_posts" ON job_posts
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anyone_can_read_job_posts" ON job_posts
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "secretary_insert_job_posts" ON job_posts
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_update_job_posts" ON job_posts
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'))
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_delete_job_posts" ON job_posts
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));


-- ========== JOB APPLICATIONS POLICIES ==========

CREATE POLICY "service_role_full_access_job_applications" ON job_applications
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_read_job_applications" ON job_applications
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_job_applications" ON job_applications
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_job_applications" ON job_applications
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);


-- ========== MENTORSHIP REQUESTS POLICIES ==========

CREATE POLICY "service_role_full_access_mentorship" ON mentorship_requests
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_read_mentorship_requests" ON mentorship_requests
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "authenticated_insert_mentorship_requests" ON mentorship_requests
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "authenticated_update_mentorship_requests" ON mentorship_requests
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete_mentorship_requests" ON mentorship_requests
  FOR DELETE TO authenticated
  USING (true);


-- ========== NOTIFICATIONS POLICIES ==========

CREATE POLICY "service_role_full_access_notifications" ON notifications
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "users_read_own_notifications" ON notifications
  FOR SELECT TO authenticated
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));

CREATE POLICY "authenticated_insert_notifications" ON notifications
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "users_update_own_notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()))
  WITH CHECK (member_id IN (SELECT id FROM members WHERE user_id = auth.uid()));


-- ========== EVENTS POLICIES ==========

CREATE POLICY "service_role_full_access_events" ON events
  FOR ALL TO service_role
  USING (true) WITH CHECK (true);

CREATE POLICY "anyone_can_read_public_events" ON events
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "secretary_insert_events" ON events
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_update_events" ON events
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'))
  WITH CHECK (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));

CREATE POLICY "secretary_delete_events" ON events
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM members WHERE user_id = auth.uid() AND role = 'secretary'));


-- ============================================================================
-- SECTION 6: GRANT PERMISSIONS
-- ============================================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;

GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;


-- ============================================================================
-- SECTION 7: ENABLE REALTIME (for live updates in the app)
-- ============================================================================

ALTER PUBLICATION supabase_realtime ADD TABLE members;
ALTER PUBLICATION supabase_realtime ADD TABLE news;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE forum_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE events;


-- ============================================================================
-- SECTION 8: SIGNUP HELPER FUNCTION (bypasses RLS for registration)
-- ============================================================================

CREATE OR REPLACE FUNCTION create_member_on_signup(
  p_user_id uuid,
  p_full_name text,
  p_nickname text DEFAULT NULL,
  p_stateship_year text DEFAULT '',
  p_last_mowcub_position text DEFAULT '',
  p_current_council_office text DEFAULT NULL,
  p_latitude real DEFAULT NULL,
  p_longitude real DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_member members%ROWTYPE;
BEGIN
  INSERT INTO members (
    user_id,
    full_name,
    nickname,
    stateship_year,
    last_mowcub_position,
    current_council_office,
    latitude,
    longitude,
    status
  ) VALUES (
    p_user_id,
    p_full_name,
    p_nickname,
    p_stateship_year,
    p_last_mowcub_position,
    p_current_council_office,
    p_latitude,
    p_longitude,
    'pending'
  )
  RETURNING * INTO new_member;

  RETURN row_to_json(new_member);
END;
$$;

GRANT EXECUTE ON FUNCTION create_member_on_signup TO anon;
GRANT EXECUTE ON FUNCTION create_member_on_signup TO authenticated;


-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Your database is now ready. All 11 tables have been created with:
--   - Proper column types matching the frontend code exactly
--   - Foreign key relationships between tables
--   - Performance indexes for common queries
--   - Auto-updating timestamps (updated_at)
--   - Row Level Security policies for Supabase Auth
--   - Realtime subscriptions for live updates
--
-- Tables created:
--   1.  members              - Member profiles (linked to Supabase Auth users)
--   2.  badges               - Achievement badges awarded to members
--   3.  hall_of_fame          - Hall of Fame entries
--   4.  news                 - News articles and announcements
--   5.  forum_threads        - Forum discussion topics
--   6.  forum_replies        - Replies to forum threads
--   7.  job_posts            - Job opportunity listings
--   8.  job_applications     - Applications to job posts
--   9.  mentorship_requests  - Mentorship matching requests
--   10. notifications        - User notifications
--   11. events               - Community events
-- ============================================================================
