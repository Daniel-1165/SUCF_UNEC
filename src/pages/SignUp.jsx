import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiBook, FiLayers, FiAward, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const SignUp = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        school: '',
        department: '',
        level: ''
    });
    const navigate = useNavigate();

    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrorMsg(''); // Clear error on typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            // 1. Sign Up the User (Minimal Request)
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (signUpError) throw signUpError;

            // 2. Manual Profile Creation
            if (data?.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            id: data.user.id,
                            full_name: formData.fullName,
                            school: formData.school,
                            department: formData.department,
                            level: formData.level
                        }
                    ]);

                if (profileError) {
                    console.error("Profile creation warning:", profileError);
                }
            }

            // Success UI
            alert(`Success! Confirmation email sent to ${formData.email}. Please verify and then log in.`);
            navigate('/signin');

        } catch (error) {
            console.error("Signup Error Details:", error);
            setErrorMsg(error.message || "An unexpected error occurred.");
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
                    <h2 className="text-3xl font-serif font-bold text-emerald-900 mb-2">Join the Family</h2>
                    <p className="text-gray-500 text-sm">Create your account to access the Den.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div className="relative group">
                        <FiUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-6 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                            onChange={handleChange}
                        />
                    </div>

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

                    {/* School */}
                    <div className="relative group">
                        <FiBook className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                            type="text"
                            name="school"
                            placeholder="School / Institution"
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-6 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Department (Optional) */}
                    <div className="relative group">
                        <FiLayers className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                            type="text"
                            name="department"
                            placeholder="Department (Optional)"
                            className="w-full bg-gray-50 border-2 border-transparent focus:bg-white focus:border-emerald-500 rounded-2xl py-3 pl-12 pr-6 outline-none transition-all font-medium text-gray-900 placeholder-gray-400"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Level (Optional) */}
                    <div className="relative group">
                        <FiAward className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
                        <input
                            type="text"
                            name="level"
                            placeholder="Level (Optional)"
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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                        {!loading && <FiArrowRight />}
                    </button>
                    {errorMsg && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold mt-4 text-center border border-red-100">
                            {errorMsg}
                        </div>
                    )}
                </form>

                <p className="text-center mt-8 text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-emerald-700 font-bold hover:underline">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default SignUp;
