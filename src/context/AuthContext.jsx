
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Safety Timeout: Force app to load if Supabase hangs
        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth: Safety timeout triggered!");
                setLoading(false);
            }
        }, 5000); // Reduced to 5 seconds for snappier experience

        const fetchAdminStatus = async (userId) => {
            if (!userId) return false;
            console.log(`Auth: Fetching admin status for ${userId}...`);
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', userId)
                    .single();

                if (error) {
                    if (error.code !== 'PGRST116') {
                        console.warn("Auth: Admin status check failed:", error.message);
                    } else {
                        console.log("Auth: No profile found for admin check.");
                    }
                    return false;
                }
                console.log("Auth: Admin status fetched:", data.is_admin);
                return data.is_admin || false;
            } catch (err) {
                console.error("Auth: Exception in admin fetch:", err);
                return false;
            }
        };

        const updateAuthState = async (session) => {
            if (!mounted) return;

            if (!session?.user) {
                console.log("Auth: No session detected.");
                setUser(null);
                setLoading(false);
                return;
            }

            console.log("Auth: Session found, verifying identity...");

            // Fetch admin status BEFORE clearing loading flag
            try {
                const isAdmin = await fetchAdminStatus(session.user.id);
                if (mounted) {
                    setUser({ ...session.user, isAdmin });
                    console.log(`Auth: Verification complete. Admin: ${isAdmin}`);
                    setLoading(false);
                }
            } catch (err) {
                console.error("Auth: Verification failed:", err);
                if (mounted) {
                    setUser(session.user);
                    setLoading(false);
                }
            }
        };

        // Check active session
        const getSession = async () => {
            console.log("Auth: Initial session check...");
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                await updateAuthState(session);
            } catch (error) {
                console.error("Auth: GetSession Exception:", error);
                if (mounted) setLoading(false);
            } finally {
                clearTimeout(safetyTimer);
            }
        };

        getSession();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth: Event fired ->", event);
            await updateAuthState(session);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, []);

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: async () => {
            console.log("Auth: Sign out triggered. Clearing local state first.");
            setUser(null); // Clear immediately to fix UI hang
            try {
                // Attempt Supabase sign out, but don't hang if it's slow
                const { error } = await supabase.auth.signOut();
                if (error) console.error("Auth: Supabase sign out error:", error.message);
                return { error };
            } catch (err) {
                console.error("Auth: Sign out exception:", err);
                return { error: err };
            }
        },
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
