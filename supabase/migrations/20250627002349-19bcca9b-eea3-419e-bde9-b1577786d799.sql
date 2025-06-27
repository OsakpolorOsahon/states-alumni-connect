
-- Drop existing tables to recreate with corrected ENUM types
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.forum_replies CASCADE;
DROP TABLE IF EXISTS public.forum_threads CASCADE;
DROP TABLE IF EXISTS public.mentorship_requests CASCADE;
DROP TABLE IF EXISTS public.job_posts CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.hall_of_fame CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.members CASCADE;

-- Drop existing types if they exist
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS member_status CASCADE;
DROP TYPE IF EXISTS mentorship_status CASCADE;
DROP TYPE IF EXISTS stateship_year_enum CASCADE;
DROP TYPE IF EXISTS last_position_enum CASCADE;
DROP TYPE IF EXISTS council_office_enum CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create comprehensive ENUM types
CREATE TYPE member_status AS ENUM ('Pending', 'Active', 'Rejected', 'Banned');
CREATE TYPE user_role AS ENUM ('member', 'secretary');
CREATE TYPE notification_type AS ENUM ('badge_awarded', 'member_approved', 'member_rejected', 'dues_reminder', 'general');
CREATE TYPE mentorship_status AS ENUM ('pending', 'active', 'completed');

-- Year of Statesmanship ENUM (2015/2016 to 2025/2026)
CREATE TYPE stateship_year_enum AS ENUM (
  '2015/2016', '2016/2017', '2017/2018', '2018/2019', '2019/2020', '2020/2021',
  '2021/2022', '2022/2023', '2023/2024', '2024/2025', '2025/2026'
);

-- Last MOWCUB Position ENUM - Complete 30-item list matching specification
CREATE TYPE last_position_enum AS ENUM (
  'CINC', 'CGS', 'AG', 'GOC', 'PM', 'EC', 'QMG', 'DSD', 'STO', 'BM', 'DO',
  'FCRO', 'DOP', 'CSO', 'DOH', 'CDI', 'CMO', 'HOV', 'DAG', 'DPM', 'DQMG',
  'DDSD', 'DBM', 'DDO', 'DFCRO', 'DDOP', 'DDOH', 'PC', 'ADC', 'DI', 'None'
);

-- Current Council Office ENUM - Exact 13 offices plus None
CREATE TYPE council_office_enum AS ENUM (
  'President',
  'Vice President (Diaspora)',
  'Vice President (National)',
  'Secretary-General',
  'Assistant Secretary-General',
  'Treasurer',
  'Director of Finance',
  'Director of Socials',
  'Director of Public Relations',
  'Provost Marshal',
  'Deputy Provost Marshal',
  'Ex-Officio (I)',
  'Ex-Officio (II)',
  'None'
);

-- Create members table with corrected ENUM types
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    nickname TEXT,
    stateship_year stateship_year_enum NOT NULL,
    last_mowcub_position last_position_enum NOT NULL,
    current_council_office council_office_enum DEFAULT 'None',
    photo_url TEXT,
    dues_proof_url TEXT,
    status member_status DEFAULT 'Pending',
    role user_role DEFAULT 'member',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    paid_through DATE,
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badges table
CREATE TABLE public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    badge_code TEXT NOT NULL,
    badge_name TEXT NOT NULL,
    description TEXT,
    awarded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    awarded_by UUID REFERENCES public.members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hall_of_fame table
CREATE TABLE public.hall_of_fame (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    achievement_title TEXT NOT NULL,
    achievement_description TEXT,
    achievement_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create news table
CREATE TABLE public.news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.members(id),
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT false
);

-- Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT,
    organizer_id UUID REFERENCES public.members(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_posts table
CREATE TABLE public.job_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    salary_range TEXT,
    posted_by UUID REFERENCES public.members(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create mentorship_requests table with proper ENUM
CREATE TABLE public.mentorship_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mentee_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    request_message TEXT,
    status mentorship_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE
);

-- Create forum_threads table
CREATE TABLE public.forum_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum_replies table
CREATE TABLE public.forum_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type DEFAULT 'general',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hall_of_fame ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function to get current member role
CREATE OR REPLACE FUNCTION public.get_current_member_role()
RETURNS user_role AS $$
  SELECT role FROM public.members WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Security definer function to check if user is secretary
CREATE OR REPLACE FUNCTION public.is_secretary()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.members 
    WHERE user_id = auth.uid() AND role = 'secretary' AND status = 'Active'
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for members table
CREATE POLICY "Anyone can view active members" ON public.members
    FOR SELECT USING (status = 'Active');

CREATE POLICY "Secretaries can view all members" ON public.members
    FOR SELECT USING (public.is_secretary());

CREATE POLICY "Members can update their own profile" ON public.members
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Secretaries can update any member" ON public.members
    FOR UPDATE USING (public.is_secretary());

CREATE POLICY "Users can insert their own member record" ON public.members
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS Policies for badges table
CREATE POLICY "Anyone can view badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Secretaries can manage badges" ON public.badges FOR ALL USING (public.is_secretary());

-- RLS Policies for hall_of_fame table
CREATE POLICY "Anyone can view hall of fame" ON public.hall_of_fame FOR SELECT USING (true);
CREATE POLICY "Secretaries can manage hall of fame" ON public.hall_of_fame FOR ALL USING (public.is_secretary());

-- RLS Policies for news table
CREATE POLICY "Anyone can view published news" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Secretaries can manage news" ON public.news FOR ALL USING (public.is_secretary());

-- RLS Policies for events table
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Secretaries can manage events" ON public.events FOR ALL USING (public.is_secretary());

-- RLS Policies for job_posts table
CREATE POLICY "Anyone can view active job posts" ON public.job_posts FOR SELECT USING (is_active = true);
CREATE POLICY "Members can create job posts" ON public.job_posts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Members can update their own job posts" ON public.job_posts FOR UPDATE USING (posted_by IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- RLS Policies for mentorship_requests table
CREATE POLICY "Members can view their mentorship requests" ON public.mentorship_requests 
    FOR SELECT USING (
        mentee_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()) OR
        mentor_id IN (SELECT id FROM public.members WHERE user_id = auth.uid())
    );
CREATE POLICY "Members can create mentorship requests" ON public.mentorship_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for forum_threads table
CREATE POLICY "Anyone can view forum threads" ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Members can create forum threads" ON public.forum_threads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Members can update their own threads" ON public.forum_threads FOR UPDATE USING (author_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- RLS Policies for forum_replies table
CREATE POLICY "Anyone can view forum replies" ON public.forum_replies FOR SELECT USING (true);
CREATE POLICY "Members can create forum replies" ON public.forum_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Members can update their own replies" ON public.forum_replies FOR UPDATE USING (author_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- RLS Policies for notifications table
CREATE POLICY "Members can view their own notifications" ON public.notifications 
    FOR SELECT USING (member_id IN (SELECT id FROM public.members WHERE user_id = auth.uid()));

-- Create function to calculate distance using Haversine formula
CREATE OR REPLACE FUNCTION public.calculate_distance(lat1 DECIMAL, lon1 DECIMAL, lat2 DECIMAL, lon2 DECIMAL)
RETURNS DECIMAL AS $$
DECLARE
    R DECIMAL := 6371; -- Earth's radius in kilometers
    dLat DECIMAL;
    dLon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dLat := RADIANS(lat2 - lat1);
    dLon := RADIANS(lon2 - lon1);
    a := SIN(dLat/2) * SIN(dLat/2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dLon/2) * SIN(dLon/2);
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    RETURN R * c;
END;
$$ LANGUAGE plpgsql;

-- Create function to get nearby members
CREATE OR REPLACE FUNCTION public.get_nearby_members(target_lat DECIMAL, target_lng DECIMAL, radius_km DECIMAL DEFAULT 10)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    nickname TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    distance_km DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.id,
        m.full_name,
        m.nickname,
        m.latitude,
        m.longitude,
        public.calculate_distance(target_lat, target_lng, m.latitude, m.longitude) as distance_km
    FROM public.members m
    WHERE 
        m.status = 'Active' 
        AND m.latitude IS NOT NULL 
        AND m.longitude IS NOT NULL
        AND public.calculate_distance(target_lat, target_lng, m.latitude, m.longitude) <= radius_km
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable realtime for tables
ALTER TABLE public.members REPLICA IDENTITY FULL;
ALTER TABLE public.badges REPLICA IDENTITY FULL;
ALTER TABLE public.hall_of_fame REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.badges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hall_of_fame;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create comprehensive triggers for updated_at columns on ALL tables
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_badges_updated_at BEFORE UPDATE ON public.badges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_hall_of_fame_updated_at BEFORE UPDATE ON public.hall_of_fame FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON public.job_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentorship_requests_updated_at BEFORE UPDATE ON public.mentorship_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_threads_updated_at BEFORE UPDATE ON public.forum_threads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_forum_replies_updated_at BEFORE UPDATE ON public.forum_replies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
