import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiSend, FiMessageSquare } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const firstName = e.target.elements.firstName.value;
        const lastName = e.target.elements.lastName.value;
        const email = e.target.elements.email.value;
        const message = e.target.elements.message.value;

        try {
            // 1. Save to Supabase (The "Site Mail")
            const { error: dbError } = await supabase
                .from('contact_messages')
                .insert([
                    {
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                        message: message,
                        status: 'unread'
                    }
                ]);

            if (dbError) throw dbError;

            // 2. Success State
            setIsSent(true);
            setIsSubmitting(false);

            // 3. Fallback: Open mailto as well (optional, but good for user records)
            // Uncomment if you want both
            /*
            const subject = encodeURIComponent(`Inquiry from ${firstName} ${lastName} via Website`);
            const body = encodeURIComponent(`From: ${firstName} ${lastName}\nSender Email: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:sucfunec01@gmail.com?subject=${subject}&body=${body}`;
            */

        } catch (err) {
            console.error('Submission error:', err);
            setError('Failed to send message. Please try again or use the links below.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 zeni-mesh-gradient">
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="max-w-4xl mb-12 md:mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="section-tag mb-6 md:mb-8"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Get in touch
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-[#00211F] mb-8 md:mb-10 leading-none tracking-tighter">
                        Connect with <br />
                        <span className="text-emerald-600 italic">The Den.</span>
                    </h1>

                    <p className="text-[#00211F] text-lg md:text-xl font-medium opacity-40 leading-relaxed max-w-2xl">
                        Have questions about our activities or want to share a testimony? Reach out to us below.
                    </p>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 md:gap-16">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-5">
                        <div className="space-y-6 md:space-y-8">
                            {/* Card 1: Phone */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="zeni-card-dark p-6 md:p-10 relative overflow-hidden group cursor-pointer"
                                onClick={() => window.location.href = 'tel:07069753310'}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                                <div className="flex items-start gap-4 md:gap-8 relative z-10">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-white/10 flex items-center justify-center text-2xl md:text-3xl">
                                        <FiPhone />
                                    </div>
                                    <div>
                                        <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2 md:mb-4">Call / WhatsApp</h3>
                                        <p className="text-xl md:text-2xl font-black mb-1 tracking-tight">07069753310</p>
                                        <p className="text-emerald-100/40 text-[10px] md:text-sm font-medium uppercase tracking-widest">Click to Call Directly</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2: Email */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="zeni-card p-6 md:p-10 group bg-white/60 backdrop-blur-xl border-emerald-100 cursor-pointer"
                                onClick={() => window.location.href = 'mailto:sucfunec01@gmail.com'}
                            >
                                <div className="flex items-start gap-4 md:gap-8">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform">
                                        <FiMail />
                                    </div>
                                    <div>
                                        <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2 md:mb-4">Email Address</h3>
                                        <p className="text-xl md:text-2xl font-black text-[#00211F] mb-1 tracking-tight break-all">sucfunec01@gmail.com</p>
                                        <p className="text-[#00211F] opacity-30 text-[10px] md:text-sm font-medium uppercase tracking-widest">Official Correspondence</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Socials Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { icon: <FiInstagram />, label: 'Instagram', link: "https://www.instagram.com/sucf.unec/" },
                                    { icon: <FiFacebook />, label: 'Facebook', link: "https://www.facebook.com/sucfunec" },
                                    { icon: <FiYoutube />, label: 'Youtube', link: "https://www.youtube.com/@sucfunec" }
                                ].map((social, i) => (
                                    <a
                                        key={i}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="zeni-card py-6 md:py-8 flex flex-col items-center justify-center gap-2 md:gap-4 hover:bg-white transition-all group bg-white/40"
                                    >
                                        <span className="text-xl md:text-2xl text-[#00211F] opacity-20 group-hover:opacity-100 group-hover:text-emerald-600 transition-all">{social.icon}</span>
                                        <span className="text-[9px] md:text-[10px] font-black text-[#00211F] opacity-40 uppercase tracking-widest">{social.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7"
                    >
                        <div className="zeni-card p-6 sm:p-10 md:p-16 bg-white shadow-2xl shadow-emerald-900/5 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {isSent ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="flex flex-col items-center justify-center py-20 text-center"
                                    >
                                        <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-5xl mb-8 animate-bounce">
                                            <FiSend />
                                        </div>
                                        <h2 className="text-4xl font-black text-[#00211F] mb-4">Message Sent!</h2>
                                        <p className="text-[#00211F] opacity-40 font-medium max-w-md mx-auto mb-10">
                                            Thank you for reaching out. Your message has been sent to our site mail and we will get back to you shortly.
                                        </p>
                                        <button
                                            onClick={() => setIsSent(false)}
                                            className="px-10 py-4 rounded-full bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-[#00211F] transition-all"
                                        >
                                            Send Another Message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-12">
                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-emerald-500/10 text-emerald-600 rounded-2xl md:rounded-[1.2rem] flex items-center justify-center text-2xl md:text-3xl">
                                                <FiMessageSquare />
                                            </div>
                                            <h2 className="text-2xl md:text-3xl font-black text-[#00211F] tracking-tight">Drop a Message</h2>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-10">
                                            <div className="grid md:grid-cols-2 gap-10">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/40 px-2">First Name</label>
                                                    <input type="text" name="firstName" required className="w-full px-8 py-5 rounded-[1.5rem] bg-[#F5F9F7] border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-[#00211F] placeholder:opacity-20" placeholder="Daniel" />
                                                </div>
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/40 px-2">Last Name</label>
                                                    <input type="text" name="lastName" required className="w-full px-8 py-5 rounded-[1.5rem] bg-[#F5F9F7] border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-[#00211F] placeholder:opacity-20" placeholder="Chime" />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/40 px-2">Email Address</label>
                                                <input type="email" name="email" required className="w-full px-8 py-5 rounded-[1.5rem] bg-[#F5F9F7] border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-[#00211F] placeholder:opacity-20" placeholder="your@email.com" />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/40 px-2">Your Message</label>
                                                <textarea name="message" required rows="6" className="w-full px-8 py-5 rounded-[2rem] bg-[#F5F9F7] border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 outline-none transition-all font-bold text-[#00211F] placeholder:opacity-20 resize-none" placeholder="I would like to enquire about..."></textarea>
                                            </div>

                                            {error && (
                                                <p className="text-red-500 text-xs font-bold px-2">{error}</p>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className={`w-full py-6 rounded-[2rem] bg-[#00211F] text-white font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 transition-all shadow-2xl shadow-emerald-900/20 active:scale-95 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600 hover:scale-[1.02]'}`}
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Message'} <FiSend className="text-lg" />
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
