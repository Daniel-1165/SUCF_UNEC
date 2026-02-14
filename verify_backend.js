import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwfihokueijosudunhta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Zmlob2t1ZWlqb3N1ZHVuaHRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODE0OTMsImV4cCI6MjA4MTg1NzQ5M30.ywu9wwGDUpQplx37d2MnWKWfvbMw-uWrQ8-PGlaxYq0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('═══════════════════════════════════════════════════════');
console.log('  SUPABASE BACKEND VERIFICATION SCRIPT');
console.log('═══════════════════════════════════════════════════════\n');

async function verifyBackend() {
    let allPassed = true;

    // Test 1: Basic Connection
    console.log('📡 Test 1: Basic Connection');
    try {
        const { error } = await supabase
            .from('gallery')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.log('   ❌ FAILED:', error.message);
            allPassed = false;
        } else {
            console.log('   ✅ PASSED: Can connect to Supabase');
        }
    } catch (err) {
        console.log('   ❌ FAILED:', err.message);
        allPassed = false;
    }

    // Test 2: Profiles Table
    console.log('\n👤 Test 2: Profiles Table Access');
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .limit(5);

        if (error) {
            console.log('   ❌ FAILED:', error.message);
            console.log('   ⚠️  ACTION REQUIRED: Run fix_profiles_and_auth.sql in Supabase SQL Editor');
            allPassed = false;
        } else {
            console.log('   ✅ PASSED: Profiles table accessible');
            console.log('   📊 Found', data.length, 'profile(s)');
            if (data.length > 0) {
                console.log('   👥 Profiles:');
                data.forEach(profile => {
                    console.log(`      - ${profile.email} ${profile.is_admin ? '(ADMIN)' : ''}`);
                });
            }
        }
    } catch (err) {
        console.log('   ❌ FAILED:', err.message);
        allPassed = false;
    }

    // Test 3: Admin User
    console.log('\n🔐 Test 3: Admin User Configuration');
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', 'sucfunec01@gmail.com')
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('   ❌ FAILED: Admin user not found in profiles table');
                console.log('   ⚠️  ACTION REQUIRED: Run fix_profiles_and_auth.sql');
            } else {
                console.log('   ❌ FAILED:', error.message);
            }
            allPassed = false;
        } else {
            if (data.is_admin) {
                console.log('   ✅ PASSED: Admin user configured correctly');
                console.log('   👤 Admin:', data.email);
            } else {
                console.log('   ⚠️  WARNING: User exists but is not marked as admin');
                console.log('   ⚠️  ACTION REQUIRED: Run fix_profiles_and_auth.sql');
                allPassed = false;
            }
        }
    } catch (err) {
        console.log('   ❌ FAILED:', err.message);
        allPassed = false;
    }


    // Test 5: Authentication System
    console.log('\n🔑 Test 5: Authentication System');
    try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
            console.log('   ❌ FAILED:', error.message);
            allPassed = false;
        } else {
            console.log('   ✅ PASSED: Auth system functional');
            if (data.session) {
                console.log('   👤 Active session:', data.session.user.email);
            } else {
                console.log('   ℹ️  No active session (this is normal if not logged in)');
            }
        }
    } catch (err) {
        console.log('   ❌ FAILED:', err.message);
        allPassed = false;
    }

    // Test 6: RLS Policies
    console.log('\n🛡️  Test 6: Row Level Security Policies');
    try {
        // Try to read from all main tables
        const tables = ['gallery', 'books'];
        let rlsPassed = true;

        for (const table of tables) {
            const { error } = await supabase
                .from(table)
                .select('count', { count: 'exact', head: true });

            if (error) {
                console.log(`   ❌ ${table}: ${error.message}`);
                rlsPassed = false;
            } else {
                console.log(`   ✅ ${table}: Public read access working`);
            }
        }

        if (!rlsPassed) {
            console.log('   ⚠️  ACTION REQUIRED: Run supabase_rls_policies.sql');
            allPassed = false;
        }
    } catch (err) {
        console.log('   ❌ FAILED:', err.message);
        allPassed = false;
    }

    // Final Summary
    console.log('\n═══════════════════════════════════════════════════════');
    if (allPassed) {
        console.log('  ✅ ALL TESTS PASSED!');
        console.log('  🎉 Your Supabase backend is properly connected!');
    } else {
        console.log('  ❌ SOME TESTS FAILED');
        console.log('  📋 ACTION REQUIRED:');
        console.log('     1. Open Supabase Dashboard: https://app.supabase.com');
        console.log('     2. Go to SQL Editor');
        console.log('     3. Run fix_profiles_and_auth.sql');
        console.log('     4. Run this verification script again');
    }
    console.log('═══════════════════════════════════════════════════════\n');
}

verifyBackend();
