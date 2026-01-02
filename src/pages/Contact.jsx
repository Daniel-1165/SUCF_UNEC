import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiInstagram, FiFacebook, FiYoutube, FiSend, FiMessageSquare } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Contact = () => {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-6">
                <header className="text-center mb-24 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 mb-6"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase">Get in touch</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-serif text-emerald-900 font-bold mb-4">Connect With The Den</h1>
                    <p className="text-gray-600">Have questions about our activities or want to share a testimony? Reach out to us below.</p>
                </header>

                <div className="grid lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-32 space-y-8">
                            {/* Card 1: Phone */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-emerald-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                                        <FiPhone />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-2">Call/WhatsApp</h3>
                                        <p className="text-xl font-bold mb-1">+234 816 570 7615</p>
                                        <p className="text-emerald-100/60 text-sm">President's Office</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2: Email */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-emerald-50 rounded-[2rem] p-8 text-emerald-900 border border-emerald-100 group"
                            >
                                <div className="flex items-start gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        <FiMail />
                                    </div>
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Email Address</h3>
                                        <p className="text-xl font-bold mb-1">sucfunec@gmail.com</p>
                                        <p className="text-emerald-900/60 text-sm">Official Correspondence</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Socials */}
                            <div className="flex flex-wrap gap-4 pt-4">
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
                                        className="flex-grow flex items-center justify-center gap-3 bg-white border border-gray-100 py-4 px-6 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
                                    >
                                        <span className="text-gray-400 group-hover:text-emerald-600 transition-colors uppercase text-[10px] font-black tracking-widest">{social.label}</span>
                                        <span className="text-xl text-emerald-700">{social.icon}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7 bg-white rounded-[3rem] p-8 md:p-12 border border-gray-100 shadow-xl"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xl">
                                <FiMessageSquare />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                        </div>

                        <form className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">First Name</label>
                                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-gray-900" placeholder="Daniel" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Last Name</label>
                                    <input type="text" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-gray-900" placeholder="Chime" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Email Address</label>
                                <input type="email" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-gray-900" placeholder="your@email.com" />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2">Your Message</label>
                                <textarea rows="5" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-medium text-gray-900 resize-none" placeholder="I would like to enquire about..."></textarea>
                            </div>

                            <button className="w-full py-5 rounded-2xl bg-emerald-800 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-200 transition-all group">
                                Send Message <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
