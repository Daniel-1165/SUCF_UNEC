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
        <div className="pt-32 pb-20 min-h-screen bg-white">
            <div className="container mx-auto px-6 text-center mb-24 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 mb-6"
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase">The Servants</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-serif text-emerald-900 font-bold mb-4">Our Leadership</h1>
                <p className="text-gray-600 text-lg">Standard bearers and visionaries upholding righteous standards for the 2024/2025 academic session.</p>
            </div>

            <div className="container mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {executives.map((exec, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative group pt-12"
                    >
                        {/* Card Body */}
                        <div className="bg-gray-50 rounded-[2.5rem] p-8 pt-20 text-center border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                            {/* Avatar - Floating above the card */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-800 rounded-full scale-0 group-hover:scale-110 transition-transform duration-500 opacity-20 blur-xl" />
                                    <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-white shadow-xl relative z-10 group-hover:border-emerald-50 transition-all duration-500">
                                        <img src={exec.img} alt={exec.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-800 transition-colors uppercase tracking-tight">{exec.name}</h3>
                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">{exec.role}</p>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-tighter mb-6">{exec.dept}</p>

                            {/* Social Icons */}
                            <div className="flex justify-center gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <button className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                    <FiInstagram />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                    <FiLinkedin />
                                </button>
                                <button className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                                    <FiTwitter />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Executives;
