-- Complete database setup for SMMOWCUB platform
-- Handle existing policies by dropping them first

-- First, let's clean up and recreate the members table policies
DROP POLICY IF EXISTS "Public can view active members" ON public.members;
DROP POLICY IF EXISTS "Anyone can view active members" ON public.members;
DROP POLICY IF EXISTS "Members can view their own profile" ON public.members;
DROP POLICY IF EXISTS "Members can update their own profile" ON public.members;
DROP POLICY IF EXISTS "Secretaries can update any member" ON public.members;
DROP POLICY IF EXISTS "Secretaries can view all members" ON public.members;
DROP POLICY IF EXISTS "Users can insert their own member record" ON public.members;

-- Create comprehensive RLS policies for members
CREATE POLICY "Public can view active members" ON public.members
FOR SELECT USING (status = 'Active');

CREATE POLICY "Members can view their own profile" ON public.members
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Secretaries can view all members" ON public.members
FOR SELECT USING (is_secretary());

CREATE POLICY "Members can update their own profile" ON public.members
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Secretaries can update any member" ON public.members
FOR UPDATE USING (is_secretary());

CREATE POLICY "Users can insert their own member record" ON public.members
FOR INSERT WITH CHECK (user_id = auth.uid());

-- Clean up existing notification policies
DROP POLICY IF EXISTS "Members can view their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Secretaries can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Members can update their own notifications" ON public.notifications;

-- Recreate notifications policies
CREATE POLICY "Members can view their own notifications" ON public.notifications
FOR SELECT USING (member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Secretaries can create notifications" ON public.notifications
FOR INSERT WITH CHECK (is_secretary());

CREATE POLICY "Members can update their own notifications" ON public.notifications
FOR UPDATE USING (member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- Clean up existing job posts policies
DROP POLICY IF EXISTS "Anyone can view active job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Members can create job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Members can update their own job posts" ON public.job_posts;
DROP POLICY IF EXISTS "Secretaries can manage all job posts" ON public.job_posts;

-- Recreate job posts policies
CREATE POLICY "Anyone can view active job posts" ON public.job_posts
FOR SELECT USING (is_active = true);

CREATE POLICY "Members can create job posts" ON public.job_posts
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their own job posts" ON public.job_posts
FOR UPDATE USING (posted_by IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Secretaries can manage all job posts" ON public.job_posts
FOR ALL USING (is_secretary());

-- Clean up existing news policies
DROP POLICY IF EXISTS "Anyone can view published news" ON public.news;
DROP POLICY IF EXISTS "Secretaries can manage news" ON public.news;

-- Recreate news policies
CREATE POLICY "Anyone can view published news" ON public.news
FOR SELECT USING (is_published = true);

CREATE POLICY "Secretaries can manage news" ON public.news
FOR ALL USING (is_secretary());

-- Clean up existing events policies
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Secretaries can manage events" ON public.events;

-- Recreate events policies
CREATE POLICY "Anyone can view events" ON public.events
FOR SELECT USING (true);

CREATE POLICY "Secretaries can manage events" ON public.events
FOR ALL USING (is_secretary());

-- Clean up existing forum threads policies
DROP POLICY IF EXISTS "Anyone can view forum threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Members can create forum threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Members can update their own threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Secretaries can manage all threads" ON public.forum_threads;

-- Recreate forum threads policies
CREATE POLICY "Anyone can view forum threads" ON public.forum_threads
FOR SELECT USING (true);

CREATE POLICY "Members can create forum threads" ON public.forum_threads
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their own threads" ON public.forum_threads
FOR UPDATE USING (author_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Secretaries can manage all threads" ON public.forum_threads
FOR ALL USING (is_secretary());

-- Clean up existing forum replies policies
DROP POLICY IF EXISTS "Anyone can view forum replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Members can create forum replies" ON public.forum_replies;
DROP POLICY IF EXISTS "Members can update their own replies" ON public.forum_replies;

-- Recreate forum replies policies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies
FOR SELECT USING (true);

CREATE POLICY "Members can create forum replies" ON public.forum_replies
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their own replies" ON public.forum_replies
FOR UPDATE USING (author_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- Clean up existing mentorship policies
DROP POLICY IF EXISTS "Members can view their mentorship requests" ON public.mentorship_requests;
DROP POLICY IF EXISTS "Members can create mentorship requests" ON public.mentorship_requests;
DROP POLICY IF EXISTS "Members can update their mentorship requests" ON public.mentorship_requests;

-- Recreate mentorship policies
CREATE POLICY "Members can view their mentorship requests" ON public.mentorship_requests
FOR SELECT USING (
    (mentee_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())) OR
    (mentor_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()))
);

CREATE POLICY "Members can create mentorship requests" ON public.mentorship_requests
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their mentorship requests" ON public.mentorship_requests
FOR UPDATE USING (
    (mentee_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())) OR
    (mentor_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()))
);

-- Job applications policies
CREATE POLICY "Members can view their own applications" ON public.job_applications
FOR SELECT USING (applicant_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Job posters can view applications for their jobs" ON public.job_applications
FOR SELECT USING (job_id IN (SELECT id FROM public.job_posts WHERE posted_by IN (SELECT id FROM public.members WHERE user_id = auth.uid())));

CREATE POLICY "Members can create job applications" ON public.job_applications
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);