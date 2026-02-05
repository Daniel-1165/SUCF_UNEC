# Supabase Backend Connection Fix Guide

## Problem Identified
Your project is experiencing connection issues with Supabase backend, causing:
1. **No data showing** from the backend
2. **Authentication not working** (session timeout errors)
3. **Profiles table access issues**

## Root Cause
The main issue is the **profiles table** is either:
- Not created properly
- Missing RLS (Row Level Security) policies
- Not accessible due to permission issues

## Solution Steps

### Step 1: Fix Profiles Table and Authentication
1. Open your Supabase Dashboard: https://app.supabase.com
2. Navigate to your project: `rwfihokueijosudunhta`
3. Go to **SQL Editor**
4. Copy and paste the entire contents of `fix_profiles_and_auth.sql`
5. Click **Run** to execute the script

This script will:
- Create the profiles table if it doesn't exist
- Set up proper RLS policies
- Create triggers to automatically create profiles for new users
- Make `sucfunec01@gmail.com` an admin
- Fix any existing user profiles

### Step 2: Verify the Fix
After running the SQL script, run these verification queries in the SQL Editor:

```sql
-- Check if profiles table exists
SELECT * FROM public.profiles;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Verify admin user
SELECT email, is_admin FROM public.profiles WHERE email = 'sucfunec01@gmail.com';
```

### Step 3: Test the Connection
1. Restart your development server (if running)
2. Open the browser console (F12)
3. Look for these messages:
   - ✅ "Supabase connected successfully!" - Good!
   - ❌ "Supabase connection test failed" - Still has issues

### Step 4: Clear Browser Cache and Re-login
1. Clear your browser's local storage:
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Clear storage"
   - Click "Clear site data"
2. Refresh the page
3. Try logging in again

## Common Issues and Solutions

### Issue 1: "Session timeout" errors
**Cause:** Profiles table not accessible or missing
**Solution:** Run the `fix_profiles_and_auth.sql` script

### Issue 2: Data not loading
**Cause:** RLS policies blocking access
**Solution:** 
1. Check if tables have RLS enabled
2. Verify policies allow public read access
3. Run `supabase_rls_policies.sql` to fix table policies

### Issue 3: Authentication hanging
**Cause:** Network timeout or slow response
**Solution:** The updated `supabaseClient.js` now has timeout handling

### Issue 4: Admin features not working
**Cause:** User not marked as admin in profiles table
**Solution:** Run this SQL:
```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'sucfunec01@gmail.com';
```

## Files Created/Updated

1. **fix_profiles_and_auth.sql** - Main fix for profiles table
2. **supabaseClient.js** - Enhanced with better error handling
3. **test_supabase_connection.js** - Diagnostic tool to test connection

## Testing Checklist

- [ ] Profiles table exists and is accessible
- [ ] RLS policies are set up correctly
- [ ] Admin user has `is_admin = true`
- [ ] Can fetch news data from the homepage
- [ ] Can log in without session timeout
- [ ] Admin panel is accessible (if admin)
- [ ] Browser console shows "✅ Supabase connected successfully!"

## Next Steps

1. **Run the SQL script** in Supabase SQL Editor
2. **Restart your dev server**
3. **Clear browser cache and local storage**
4. **Test authentication** by logging in
5. **Verify data loads** on the homepage

## Need More Help?

If issues persist after following these steps:

1. Check the browser console for specific error messages
2. Verify your Supabase project is active (not paused)
3. Check your internet connection
4. Verify the `.env` file has correct credentials
5. Make sure you're using the correct Supabase project URL

## Environment Variables Check

Your current configuration:
```
VITE_SUPABASE_URL=https://rwfihokueijosudunhta.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci... (present)
```

These look correct! ✅

## Quick Test Command

Run this to test the connection:
```bash
node test_supabase_connection.js
```

Expected output:
```
✅ Connection successful!
✅ Data fetch successful!
✅ Auth check successful!
✅ Profiles table accessible!
```
