import React from 'react';
import { FiUsers, FiAward, FiTarget } from 'react-icons/fi';
import { motion } from 'framer-motion';

const About = () => {
    const executives = [
        { name: "Bro. Zuby Benjamin", role: "President", img: "/assets/execs/president.jpg" },
        { name: "Sis. Onyiyechi Ogbonna \n @Christlike", role: "Vice President", img: "/assets/execs/ifunanya.jpg" },
        { name: "Sis. Fear God", role: "General Secretary", img: "/assets/execs/blessing.jpg" },
        { name: "Bro. Wisdom Ogbonna", role: "Prayer Secretary", img: "/assets/execs/emmanuel.jpg" },
    ];

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white">
            {/* Header */}
            <section className="container mx-auto px-6 mb-24">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-6"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-xs font-bold text-emerald-900 tracking-widest uppercase">Our Story</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-serif text-emerald-900 font-bold mb-8 leading-tight">
                        Upholding Righteous Standards <br />
                        Since Inception.
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                        Scripture Union Campus Fellowship (SUCF) UNEC is a vibrant non-denominational family committed to raising balanced Christian students who excel both spiritually and academically.
                    </p>
                </div>
            </section>

            {/* Vision / Mission */}
            <section className="bg-gray-50 py-24 mb-24 overflow-hidden relative">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-800/5 -skew-x-12 translate-x-1/2 rounded-3xl" />

                <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-emerald-100 rounded-3xl -rotate-3" />
                        <img
                            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop"
                            alt="Fellowship Group"
                            className="rounded-2xl shadow-2xl relative z-10 w-full grayscale hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute -bottom-8 -right-8 bg-emerald-800 p-8 rounded-2xl shadow-xl max-w-sm hidden md:block z-20">
                            <p className="text-emerald-50 font-serif text-lg font-bold italic mb-2">"The Den"</p>
                            <p className="text-emerald-100 text-sm leading-relaxed">A sanctuary for spiritual growth and intellectual transformation in UNEC.</p>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 text-2xl shrink-0 shadow-sm">
                                <FiTarget />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
                                <p className="text-gray-600 leading-relaxed text-lg italic">"Children, youth and adults nurtured to Christian maturity following Jesus and transforming Nigeria."</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 text-2xl shrink-0 shadow-sm">
                                <FiUsers />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">Scripture Union (Nigeria) is committed to reaching children, young people and families, nurturing them through Bible engagement to become committed Christians of influence.</p>
                            </div>
                        </div>

                        <div className="flex gap-6">
                            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 text-2xl shrink-0 shadow-sm">
                                <FiAward />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Core Values</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">Integrity, Academic Stewardship, Servant Leadership, and Brotherly Love.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Executives Grid */}
            <section className="container mx-auto px-6 py-20 text-center">
                <div className="mb-20 max-w-2xl mx-auto">
                    <h2 className="text-4xl font-serif text-emerald-900 font-bold mb-6">Meet the Leadership</h2>
                    <p className="text-gray-600">The dedicated team serving "The Den" for the 2024/2025 academic session.</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-6xl mx-auto">
                    {executives.map((exec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group"
                        >
                            <div className="relative mb-6 inline-block">
                                <div className="absolute inset-0 bg-emerald-800 rounded-full scale-0 group-hover:scale-105 transition-transform duration-500 opacity-10" />
                                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10 group-hover:border-emerald-50 transition-all">
                                    <img src={exec.img} alt={exec.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-800 transition-colors uppercase tracking-tight whitespace-pre-line">{exec.name}</h3>
                            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{exec.role}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default About;
