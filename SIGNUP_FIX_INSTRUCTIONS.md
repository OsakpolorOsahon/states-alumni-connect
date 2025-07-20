# Fix Signup RLS Error - SMMOWCUB

## Problem
Users getting error: "new row violates row-level security policy for table 'members'" during signup.

## Root Cause
The Row Level Security (RLS) policy was preventing new user registration because it was checking for a user that doesn't exist yet in the members table.

## Solution Steps

### 1. Open Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)

### 2. Run the Fix SQL
Copy and paste this SQL into the SQL Editor and run it:

```sql
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can insert their own member record" ON members;

-- Create new policy that allows authenticated users to insert their profile
CREATE POLICY "Authenticated users can create their member profile" ON members 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to view active members (for public directory)
CREATE POLICY "Anonymous users can view active members" ON members 
FOR SELECT 
TO anon 
USING (status = 'active');

-- Update authenticated user viewing policy
DROP POLICY IF EXISTS "Public members are viewable by everyone" ON members;
CREATE POLICY "Authenticated users can view active members" ON members 
FOR SELECT 
TO authenticated 
USING (status = 'active');

-- Allow users to view their own record (including pending status)
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
```

### 3. Test Signup
After running the SQL:
1. Try signing up on your website again
2. The signup should now work without RLS errors
3. New users will be created with "pending" status
4. Secretaries can approve them through the admin dashboard

## What This Fix Does
- ✅ Allows authenticated users to create their member profile during signup
- ✅ Maintains security by ensuring users can only create records with their own user_id
- ✅ Allows public viewing of active members (for the directory)
- ✅ Allows users to view their own profile even when pending approval
- ✅ Maintains all other security policies

Your signup should work perfectly after applying this fix!