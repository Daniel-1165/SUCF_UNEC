import React from 'react';
import { FiLinkedin, FiMail, FiInstagram, FiTwitter } from 'react-icons/fi';
import { motion } from 'framer-motion';

const executives = [
    { name: "Bro. Zuby Benjamin", role: "President", dept: "Surveying", img: "/assets/execs/president.jpg" },
    { name: "Sis. Onyiyechi Ogbonna", role: "Vice President", dept: "Medicine", img: "/assets/execs/ifunanya.jpg" },
    { name: "Sis. Fear God", role: "General Secretary", dept: "Nursing Science", img: "/assets/execs/blessing.jpg" },
    { name: "Bro. Wisdom Ogbonna", role: "Prayer Secretary", dept: "Architecture", img: "/assets/execs/emmanuel.jpg" },

];

const Executives = () => {
    return (
        <div className="min-h-screen pt-32 pb-20 zeni-mesh-gradient">
            <div className="container mx-auto px-6 text-center mb-24 max-w-2xl">
                <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="section-tag mb-6"
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    The Servants
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black text-[#00211F] mb-8 leading-none tracking-tighter">
                    The <span className="text-emerald-600 italic">Council.</span>
                </h1>

                <p className="text-[#00211F] text-xl font-medium opacity-40 leading-relaxed">
                    Standard bearers and visionaries upholding righteous standards for the 2025/2026 academic session.
                </p>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 max-w-7xl">
                {executives.map((exec, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative group pt-16"
                    >
                        {/* Zeni Style Card */}
                        <div className="zeni-card h-full p-8 pt-24 text-center group-hover:bg-white transition-all duration-500">
                            {/* Avatar - Floating above/within the card */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                                    <div className="w-44 h-44 rounded-full overflow-hidden border-8 border-[#F5F9F7] shadow-2xl relative z-10 group-hover:border-emerald-50 transition-all duration-500">
                                        <img
                                            src={exec.img}
                                            alt={exec.name}
                                            className="w-full h-full object-cover transition-all duration-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-full flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-[#00211F] mb-2 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                                        {exec.name}
                                    </h3>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                                        {exec.role}
                                    </p>
                                    <div className="h-px w-8 bg-emerald-100 mx-auto group-hover:w-12 transition-all" />
                                </div>

                                <p className="text-xs text-[#00211F] font-bold uppercase tracking-widest opacity-30 mb-8">
                                    {exec.dept}
                                </p>

                                {/* Social Icons - Zeni Style */}
                                <div className="mt-auto flex justify-center gap-4">
                                    {[FiInstagram, FiLinkedin, FiTwitter].map((Icon, i) => (
                                        <button
                                            key={i}
                                            className="w-10 h-10 rounded-xl bg-[#F5F9F7] text-emerald-900/40 flex items-center justify-center hover:bg-[#00211F] hover:text-white transition-all shadow-sm"
                                        >
                                            <Icon className="text-lg" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Note Section */}
            <div className="container mx-auto px-6 mt-40 max-w-5xl text-center">
                <div className="zeni-card p-12 bg-white/40 backdrop-blur-md border-emerald-100/50">
                    <p className="text-[#00211F] text-lg font-medium opacity-40 leading-relaxed italic">
                        "Leading a generation to uphold righteous standards, excelling in spirit and in truth."
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Executives;
