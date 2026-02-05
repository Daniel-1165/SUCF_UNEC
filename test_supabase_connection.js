import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rwfihokueijosudunhta.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Zmlob2t1ZWlqb3N1ZHVuaHRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyODE0OTMsImV4cCI6MjA4MTg1NzQ5M30.ywu9wwGDUpQplx37d2MnWKWfvbMw-uWrQ8-PGlaxYq0';

console.log('Testing Supabase Connection...');
console.log('URL:', supabaseUrl);
console.log('Key present:', !!supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        console.log('\n1. Testing basic connection...');
        const { data, error } = await supabase
            .from('news')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Connection failed:', error);
        } else {
            console.log('✅ Connection successful!');
        }

        console.log('\n2. Testing data fetch...');
        const { data: newsData, error: newsError } = await supabase
            .from('news')
            .select('*')
            .limit(5);

        if (newsError) {
            console.error('❌ Data fetch failed:', newsError);
        } else {
            console.log('✅ Data fetch successful! Found', newsData?.length || 0, 'news items');
            console.log('Sample data:', newsData?.[0]);
        }

        console.log('\n3. Testing authentication...');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('❌ Auth check failed:', sessionError);
        } else {
            console.log('✅ Auth check successful!');
            console.log('Session:', sessionData.session ? 'Active' : 'No active session');
        }

        console.log('\n4. Testing profiles table...');
        const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('count', { count: 'exact', head: true });

        if (profilesError) {
            console.error('❌ Profiles table check failed:', profilesError);
        } else {
            console.log('✅ Profiles table accessible!');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

testConnection();
