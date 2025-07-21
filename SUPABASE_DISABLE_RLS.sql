-- EMERGENCY FIX: Temporarily disable RLS for signup testing
-- Run this in your Supabase SQL Editor to completely bypass RLS issues

-- STEP 1: Disable RLS on members table temporarily
ALTER TABLE members DISABLE ROW LEVEL SECURITY;

-- STEP 2: Re-enable RLS but with minimal policies
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- STEP 3: Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Service role can insert member records" ON members;
DROP POLICY IF EXISTS "Service role can update member records" ON members;
DROP POLICY IF EXISTS "Service role can read member records" ON members;
DROP POLICY IF EXISTS "Authenticated users can view active members" ON members;
DROP POLICY IF EXISTS "Users can view their own record" ON members;
DROP POLICY IF EXISTS "Users can update their own profile" ON members;
DROP POLICY IF EXISTS "Anonymous can view active members" ON members;
DROP POLICY IF EXISTS "Users can insert their own member record" ON members;
DROP POLICY IF EXISTS "Authenticated users can create their member profile" ON members;
DROP POLICY IF EXISTS "Public members are viewable by everyone" ON members;
DROP POLICY IF EXISTS "Users can view their own member record" ON members;
DROP POLICY IF EXISTS "Anonymous users can view active members" ON members;

-- STEP 4: Create the most permissive policies possible

-- Allow service role to do EVERYTHING (this should always work)
CREATE POLICY "service_role_all_access" ON members 
FOR ALL 
TO service_role 
USING (true) 
WITH CHECK (true);

-- Allow anyone to view active members (for directory)
CREATE POLICY "public_read_active" ON members 
FOR SELECT 
TO public 
USING (status = 'active');

-- STEP 5: Grant all permissions explicitly
GRANT ALL PRIVILEGES ON members TO service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- STEP 6: Ensure the service role can authenticate
GRANT USAGE ON SCHEMA auth TO service_role;
GRANT ALL ON auth.users TO service_role;

-- If this still doesn't work, run this to completely disable RLS temporarily:
-- ALTER TABLE members DISABLE ROW LEVEL SECURITY;