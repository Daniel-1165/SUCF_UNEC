
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAdminStatus = async (userId, email) => {
        if (!userId) return false;

        // Primary Admin Failsafe: Instant check for core admin
        if (email === 'sucfunec01@gmail.com') return true;

        try {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Admin check timed out")), 3000)
            );

            const queryPromise = supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', userId)
                .single();

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

            if (error) {
                if (error.code !== 'PGRST116') {
                    console.warn("Auth: Admin status check failed:", error.message);
                }
                return false;
            }
            return data?.is_admin || false;
        } catch (err) {
            console.error("Auth: Exception in admin fetch:", err.message);
            return false;
        }
    };

    useEffect(() => {
        let mounted = true;

        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth: Safety timeout triggered! App forced to continue.");
                setLoading(false);
            }
        }, 8000);

        const updateAuthState = async (session) => {
            if (!mounted) return;

            if (!session?.user) {
                console.log("Auth: No session detected.");
                setUser(null);
                setLoading(false);
                clearTimeout(safetyTimer);
                return;
            }

            console.log("Auth: Session found for", session.user.email);

            try {
                // Determine Admin Status
                const isAdmin = await fetchAdminStatus(session.user.id, session.user.email);

                if (mounted) {
                    setUser({ ...session.user, isAdmin });
                    setLoading(false);
                    clearTimeout(safetyTimer);
                    console.log(`Auth: Identity verified. Admin: ${isAdmin}`);
                }
            } catch (err) {
                console.error("Auth: Verification error:", err);
                if (mounted) {
                    setUser(session.user);
                    setLoading(false);
                    clearTimeout(safetyTimer);
                }
            }
        };

        // Initial Session Retrieval
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;
                await updateAuthState(session);
            } catch (error) {
                console.error("Auth: Initialization error:", error.message);
                if (mounted) {
                    setLoading(false);
                    clearTimeout(safetyTimer);
                }
            }
        };

        initializeAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(`Auth: External event -> ${event}`);
            if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                await updateAuthState(session);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, []);

    // Subscription to profile changes for the current user
    useEffect(() => {
        if (!user?.id) return;

        const profileSubscription = supabase
            .channel(`public:profiles:id=eq.${user.id}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${user.id}` }, payload => {
                console.log("Auth: Profile update detected:", payload.new);
                if (payload.new.is_admin !== undefined) {
                    setUser(prev => prev ? { ...prev, isAdmin: payload.new.is_admin } : null);
                }
            })
            .subscribe();

        return () => {
            if (profileSubscription) supabase.removeChannel(profileSubscription);
        };
    }, [user?.id]);

    const refreshAdminStatus = async () => {
        if (!user) return false;
        const isAdmin = await fetchAdminStatus(user.id, user.email);
        setUser(prev => prev ? { ...prev, isAdmin } : null);
        return isAdmin;
    };

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn: (data) => supabase.auth.signInWithPassword(data),
        signOut: async () => {
            console.log("Auth: Signing out...");
            try {
                // Clear state immediately for UI responsiveness
                setUser(null);
                const { error } = await supabase.auth.signOut();
                if (error) throw error;
                return { success: true };
            } catch (err) {
                console.error("Auth: Sign out issue:", err.message);
                return { error: err };
            }
        },
        refreshAdminStatus,
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: !!user?.isAdmin
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
