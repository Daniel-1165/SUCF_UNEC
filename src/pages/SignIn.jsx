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
        <div className="min-h-screen zeni-mesh-gradient flex items-center justify-center p-6 pt-32 selection:bg-emerald-600 selection:text-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="zeni-card p-12 relative overflow-hidden">
                    {/* Header */}
                    <div className="mb-10 text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                        >
                            <FiMail size={32} />
                        </motion.div>
                        <h1 className="text-4xl font-black text-[#00211F] italic uppercase tracking-tighter mb-2 leading-none">Welcome Back.</h1>
                        <p className="text-[#00211F] opacity-40 font-bold italic uppercase text-[10px] tracking-widest">Unique Fellowship on Campus</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium text-center border border-red-100">
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00211F] opacity-40 ml-4">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                onChange={handleChange}
                                className="w-full px-8 py-5 bg-emerald-50/30 border border-emerald-500/10 rounded-[2rem] text-[#00211F] font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00211F] opacity-40 ml-4">Secret Code</label>
                            <input
                                type="password"
                                name="password"
                                required
                                onChange={handleChange}
                                className="w-full px-8 py-5 bg-emerald-50/30 border border-emerald-500/10 rounded-[2rem] text-[#00211F] font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#00211F] text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/10 disabled:opacity-50 mt-4 group"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-1 h-1 bg-white rounded-full animate-bounce"></span>
                                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></span>
                                    <span className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></span>
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                                    Sign In <FiArrowRight size={14} />
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-[#F5F9F7] text-center">
                        <p className="text-[#00211F] opacity-60 text-[10px] font-black uppercase tracking-widest leading-loose">
                            New to the family? <br />
                            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 transition-colors">Apply for membership</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;
