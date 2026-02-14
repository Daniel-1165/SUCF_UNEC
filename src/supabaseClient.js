
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Enhanced logging for debugging
if (import.meta.env.DEV) {
    console.log("🔧 Supabase Configuration:");
    console.log("  URL:", supabaseUrl);
    console.log("  Key:", supabaseAnonKey ? "✅ Loaded" : "❌ Missing");
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("❌ Missing Supabase environment variables!");
    console.error("Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file");
}

// Create Supabase client with enhanced configuration
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            // Add timeout to prevent hanging
            flowType: 'pkce'
        },
        global: {
            headers: {
                'x-client-info': 'supabase-js-web'
            }
        },
        db: {
            schema: 'public'
        },
        // Add realtime configuration
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    })
    : {
        // Fallback mock client if credentials are missing
        auth: {
            getSession: () => {
                console.warn("⚠️ Using mock Supabase client - credentials not configured");
                return Promise.resolve({ data: { session: null }, error: { message: "Supabase not initialized" } });
            },
            onAuthStateChange: () => ({
                data: {
                    subscription: {
                        unsubscribe: () => { }
                    }
                }
            }),
            signInWithPassword: () => Promise.resolve({ data: null, error: { message: "Supabase not initialized" } }),
            signUp: () => Promise.resolve({ data: null, error: { message: "Supabase not initialized" } }),
            signOut: () => Promise.resolve({ error: { message: "Supabase not initialized" } })
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: { message: "Supabase not initialized" } })
                })
            })
        })
    };

// Test connection on initialization (only in dev mode)
if (import.meta.env.DEV && supabaseUrl && supabaseAnonKey) {
    supabase.from('gallery')
        .select('count', { count: 'exact', head: true })
        .then(({ error }) => {
            if (error) {
                console.error("❌ Supabase connection test failed:", error.message);
                console.error("Please check:");
                console.error("  1. Your internet connection");
                console.error("  2. Supabase project is active");
                console.error("  3. RLS policies are configured correctly");
            } else {
                console.log("✅ Supabase connected successfully!");
            }
        })
        .catch(err => {
            console.error("❌ Supabase connection error:", err);
        });
}
