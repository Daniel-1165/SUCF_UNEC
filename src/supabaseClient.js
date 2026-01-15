
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Log status but don't leak full keys in production if possible (optional)
if (import.meta.env.DEV) {
    console.log("Supabase URL:", supabaseUrl);
    console.log("Supabase Key:", supabaseAnonKey ? "Loaded" : "Missing");
}

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables! The app will likely crash or hang. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
}

// Ensure the app doesn't crash during the module load phase even if variables are missing
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: { getSession: () => Promise.resolve({ data: { session: null }, error: null }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }) },
        from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: "Supabase not initialized" } }) }) }) })
    };
