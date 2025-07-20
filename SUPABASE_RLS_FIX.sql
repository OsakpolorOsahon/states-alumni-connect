-- SMMOWCUB RLS Policies Fix for Signup Issue
-- Run these commands in your Supabase SQL Editor

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Users can insert their own member record" ON members;

-- Create a new policy that allows authenticated users to insert their own member record
-- This checks that the user_id in the new record matches the authenticated user's ID
CREATE POLICY "Authenticated users can create their member profile" ON members 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Also add a policy to allow anonymous users to view public member data (for directory)
CREATE POLICY "Anonymous users can view active members" ON members 
FOR SELECT 
TO anon 
USING (status = 'active');

-- Update the existing authenticated user policy to be more specific
DROP POLICY IF EXISTS "Public members are viewable by everyone" ON members;
CREATE POLICY "Authenticated users can view active members" ON members 
FOR SELECT 
TO authenticated 
USING (status = 'active');

-- Allow users to view their own record regardless of status (for pending approval)
CREATE POLICY "Users can view their own member record" ON members 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile" ON members 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);