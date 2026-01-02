import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // REACTIVE NAVIGATION: If user becomes authenticated (via events), redirect immediately
    useEffect(() => {
        if (user && !authLoading) {
            console.log("SignIn: User detected via Context, navigating home...");
            navigate('/');
        }
    }, [user, authLoading, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');
        console.log("SignIn: Attempting login for", formData.email);

        try {
            // PROMISE RACE: Don't let Supabase hang our UI for more than 4 seconds
            const authPromise = supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Sign-in request timed out. Please check your connection.")), 15000)
            );

            const { data, error } = await Promise.race([authPromise, timeoutPromise]);

            if (error) {
                console.error("SignIn Error:", error);
                throw error;
            }

            console.log("SignIn: Promise Resolved Successfully", data);
            // navigate('/') is handled by the useEffect above
        } catch (error) {
            console.error("SignIn Exception:", error.message);
            // Only show error if we aren't actually logging in (sometimes it times out but signs in anyway)
            if (!user) {
                setErrorMsg(error.message || "Failed to sign in");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100"
            >
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Sign in to access your account.</p>
                </div>

                {errorMsg && (
                    <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center border border-red-100">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div className="relative group">
                        <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-6 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-6 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full bg-emerald-900 text-white rounded-2xl py-4 font-bold uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                        {!loading && <FiArrowRight />}
                    </button>
                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-emerald-700 font-bold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignIn;
