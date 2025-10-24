# Fix "Database error saving new user"

## Issue
The signup is failing because the database schema needs to be applied or updated.

## Solution

### Step 1: Apply/Update Database Schema

1. Go to your Supabase project: https://supabase.com/dashboard/project/fgeisgqpjvcjamctfjcd
2. Click on **SQL Editor** in the left sidebar
3. Copy the entire contents of `db/schema.sql`
4. Paste into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

### Step 2: Verify Tables Exist

Run this query in SQL Editor to check:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see: `profiles`, `portfolios`, `stocks`, `stock_prices`

### Step 3: Verify Trigger Exists

Run this query:

```sql
SELECT trigger_name 
FROM information_schema.triggers 
WHERE event_object_table = 'users';
```

You should see: `on_auth_user_created`

### Step 4: Test Signup Again

1. Stop the dev server (Ctrl+C in terminal)
2. Run `npm run dev` again
3. Try signing up with a new email

## Why This Happened

The trigger `handle_new_user()` automatically creates a profile when you sign up, but it needs to be in the database first. I also added a missing INSERT policy to the profiles table.

## Alternative: Manual Fix

If the trigger still doesn't work, you can manually insert the profile after signup. But try the schema application first!
