-- Complete database setup for SMMOWCUB platform

-- First, let's create the updated members table with proper RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Anyone can view active members" ON public.members;
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

-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'general',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications RLS policies
CREATE POLICY "Members can view their own notifications" ON public.notifications
FOR SELECT USING (member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Secretaries can create notifications" ON public.notifications
FOR INSERT WITH CHECK (is_secretary());

CREATE POLICY "Members can update their own notifications" ON public.notifications
FOR UPDATE USING (member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.job_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    salary_range TEXT,
    posted_by UUID REFERENCES public.members(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

-- Job posts RLS policies
CREATE POLICY "Anyone can view active job posts" ON public.job_posts
FOR SELECT USING (is_active = true);

CREATE POLICY "Members can create job posts" ON public.job_posts
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their own job posts" ON public.job_posts
FOR UPDATE USING (posted_by IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Secretaries can manage all job posts" ON public.job_posts
FOR ALL USING (is_secretary());

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- News RLS policies
CREATE POLICY "Anyone can view published news" ON public.news
FOR SELECT USING (is_published = true);

CREATE POLICY "Secretaries can manage news" ON public.news
FOR ALL USING (is_secretary());

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    organizer_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events RLS policies
CREATE POLICY "Anyone can view events" ON public.events
FOR SELECT USING (true);

CREATE POLICY "Secretaries can manage events" ON public.events
FOR ALL USING (is_secretary());

-- Create forum threads table
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;

-- Forum threads RLS policies
CREATE POLICY "Anyone can view forum threads" ON public.forum_threads
FOR SELECT USING (true);

CREATE POLICY "Members can create forum threads" ON public.forum_threads
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their own threads" ON public.forum_threads
FOR UPDATE USING (author_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Secretaries can manage all threads" ON public.forum_threads
FOR ALL USING (is_secretary());

-- Create forum replies table
CREATE TABLE IF NOT EXISTS public.forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;

-- Forum replies RLS policies
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies
FOR SELECT USING (true);

CREATE POLICY "Members can create forum replies" ON public.forum_replies
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Members can update their own replies" ON public.forum_replies
FOR UPDATE USING (author_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- Create mentorship requests table
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentee_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    request_message TEXT,
    status TEXT DEFAULT 'pending',
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- Mentorship requests RLS policies
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

-- Create job applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.job_posts(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(job_id, applicant_id)
);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Job applications RLS policies
CREATE POLICY "Members can view their own applications" ON public.job_applications
FOR SELECT USING (applicant_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Job posters can view applications for their jobs" ON public.job_applications
FOR SELECT USING (job_id IN (SELECT id FROM public.job_posts WHERE posted_by IN (SELECT id FROM public.members WHERE user_id = auth.uid())));

CREATE POLICY "Members can create job applications" ON public.job_applications
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create updated_at triggers for all tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON public.job_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON public.forum_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentorship_requests_updated_at BEFORE UPDATE ON public.mentorship_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.members REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER TABLE public.job_posts REPLICA IDENTITY FULL;
ALTER TABLE public.news REPLICA IDENTITY FULL;
ALTER TABLE public.events REPLICA IDENTITY FULL;
ALTER TABLE public.forum_threads REPLICA IDENTITY FULL;
ALTER TABLE public.forum_replies REPLICA IDENTITY FULL;
ALTER TABLE public.mentorship_requests REPLICA IDENTITY FULL;
ALTER TABLE public.job_applications REPLICA IDENTITY FULL;
ALTER TABLE public.badges REPLICA IDENTITY FULL;
ALTER TABLE public.hall_of_fame REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_threads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_replies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mentorship_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.badges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hall_of_fame;

-- Create function to get member statistics
CREATE OR REPLACE FUNCTION public.get_member_stats()
RETURNS TABLE(
    total_members INTEGER,
    active_members INTEGER,
    pending_members INTEGER,
    hall_of_fame_count INTEGER,
    recent_members INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM public.members) as total_members,
        (SELECT COUNT(*)::INTEGER FROM public.members WHERE status = 'Active') as active_members,
        (SELECT COUNT(*)::INTEGER FROM public.members WHERE status = 'Pending') as pending_members,
        (SELECT COUNT(*)::INTEGER FROM public.hall_of_fame) as hall_of_fame_count,
        (SELECT COUNT(*)::INTEGER FROM public.members WHERE created_at >= NOW() - INTERVAL '30 days') as recent_members;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle secretary handover
CREATE OR REPLACE FUNCTION public.handover_secretary_role(new_secretary_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    current_secretary_id UUID;
BEGIN
    -- Check if the caller is a secretary
    IF NOT is_secretary() THEN
        RAISE EXCEPTION 'Only secretaries can handover their role';
    END IF;
    
    -- Get current secretary
    SELECT id INTO current_secretary_id FROM public.members 
    WHERE user_id = auth.uid() AND role = 'secretary';
    
    -- Update roles
    UPDATE public.members SET role = 'member' WHERE id = current_secretary_id;
    UPDATE public.members SET role = 'secretary' WHERE id = new_secretary_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;