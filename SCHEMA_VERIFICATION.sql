-- Run these queries in Supabase SQL Editor to verify your schema

-- 1. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected: portfolios, profiles, stock_prices, stocks

-- 2. Check if the trigger function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Expected: One row with the function name and source code

-- 3. Check if the trigger is attached to auth.users
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Expected: on_auth_user_created on users table

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: Multiple policies for each table

-- 5. Test if you can manually insert into profiles (this will fail, but shows if table exists)
-- DON'T RUN THIS - just check if the table structure is correct
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Expected columns: id, email, full_name, avatar_url, created_at, updated_at
