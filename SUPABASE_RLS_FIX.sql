-- SMMOWCUB RLS Policies Fix for Server-Side Signup Issue
-- Run these commands in your Supabase SQL Editor
-- This fix handles server-side admin operations for member creation

-- STEP 1: Clean up existing problematic policies
DROP POLICY IF EXISTS "Users can insert their own member record" ON members;
DROP POLICY IF EXISTS "Authenticated users can create their member profile" ON members;
DROP POLICY IF EXISTS "Public members are viewable by everyone" ON members;
DROP POLICY IF EXISTS "Authenticated users can view active members" ON members;
DROP POLICY IF EXISTS "Users can view their own member record" ON members;
DROP POLICY IF EXISTS "Users can update their own profile" ON members;
DROP POLICY IF EXISTS "Anonymous users can view active members" ON members;

-- STEP 2: Create comprehensive policies that work with server-side admin operations

-- Allow service role (server) to insert member records during signup
-- This policy allows the server to create member records on behalf of users
CREATE POLICY "Service role can insert member records" ON members 
FOR INSERT 
TO service_role 
WITH CHECK (true);

-- Allow service role to update any member record (for admin operations)
CREATE POLICY "Service role can update member records" ON members 
FOR UPDATE 
TO service_role 
WITH CHECK (true);

-- Allow service role to read any member record (for admin operations)
CREATE POLICY "Service role can read member records" ON members 
FOR SELECT 
TO service_role 
USING (true);

-- Allow authenticated users to view active members (for directory)
CREATE POLICY "Authenticated users can view active members" ON members 
FOR SELECT 
TO authenticated 
USING (status = 'active');

-- Allow users to view their own record regardless of status
CREATE POLICY "Users can view their own record" ON members 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id::uuid);

-- Allow users to update their own profile (basic info only, not status/role)
CREATE POLICY "Users can update their own profile" ON members 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id::uuid) 
WITH CHECK (
  auth.uid() = user_id::uuid AND 
  -- Prevent users from changing sensitive fields
  (OLD.status = NEW.status) AND 
  (OLD.role = NEW.role) AND
  (OLD.user_id = NEW.user_id)
);

-- Allow anonymous users to view active members (for public directory)
CREATE POLICY "Anonymous can view active members" ON members 
FOR SELECT 
TO anon 
USING (status = 'active');

-- STEP 3: Apply similar fixes to other tables that might have RLS issues

-- Fix for other tables to allow service role operations
DO $$
DECLARE
    table_name text;
    table_names text[] := ARRAY['news', 'forum_threads', 'forum_replies', 'job_posts', 'job_applications', 'mentorship_requests', 'notifications', 'events', 'badges', 'hall_of_fame'];
BEGIN
    FOREACH table_name IN ARRAY table_names
    LOOP
        -- Drop existing policies that might conflict
        EXECUTE format('DROP POLICY IF EXISTS "Service role can manage %s" ON %s', table_name, table_name);
        
        -- Create comprehensive service role policy for each table
        EXECUTE format('CREATE POLICY "Service role can manage %s" ON %s FOR ALL TO service_role USING (true) WITH CHECK (true)', table_name, table_name);
        
        -- Enable RLS on the table if not already enabled
        EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', table_name);
    END LOOP;
END $$;

-- STEP 4: Ensure proper RLS is enabled on members table
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- STEP 5: Grant necessary permissions to service role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;