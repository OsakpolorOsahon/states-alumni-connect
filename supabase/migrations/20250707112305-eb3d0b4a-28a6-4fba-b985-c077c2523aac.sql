-- Create all missing tables first

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

-- Enable RLS for all tables
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Add the missing policies for job applications
CREATE POLICY "Members can view their own applications" ON public.job_applications
FOR SELECT USING (applicant_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

CREATE POLICY "Job posters can view applications for their jobs" ON public.job_applications
FOR SELECT USING (job_id IN (SELECT id FROM public.job_posts WHERE posted_by IN (SELECT id FROM public.members WHERE user_id = auth.uid())));

CREATE POLICY "Members can create job applications" ON public.job_applications
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add triggers for updated_at on new tables
CREATE TRIGGER update_job_applications_updated_at 
    BEFORE UPDATE ON public.job_applications 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

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

-- Add tables to realtime publication (only if not already added)
DO $$
BEGIN
    -- Add tables to realtime publication only if they're not already there
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
    EXCEPTION WHEN duplicate_object THEN
        NULL; -- Table already in publication
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.job_posts;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.news;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_threads;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_replies;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.mentorship_requests;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.badges;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
    
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.hall_of_fame;
    EXCEPTION WHEN duplicate_object THEN
        NULL;
    END;
END $$;

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