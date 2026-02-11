import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { FiUsers, FiAward, FiTarget, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import AnthemSection from '../components/AnthemSection';
import SEO from '../components/SEO';
import GPACalculator from '../components/GPACalculator';
import { FiCalculator } from 'react-icons/fi';

const About = () => {
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCalcOpen, setIsCalcOpen] = useState(false);

    const fetchExecutives = async () => {
        try {
            const { data, error } = await supabase
                .from('executives')
                .select('*')
                .order('created_at', { ascending: true })
                .limit(4);

            if (error) throw error;
            setExecutives(data || []);
        } catch (error) {
            console.error('Error fetching executives:', error);
            // Fallback default
            setExecutives([
                { name: "Bro. Zuby Benjamin", role: "President", img_url: "/assets/execs/president.jpg" },
                { name: "Sis. Onyiyechi Ogbonna", role: "Vice President", img_url: "/assets/execs/ifunanya.jpg" },
                { name: "Sis. Fear God", role: "General Secretary", img_url: "/assets/execs/blessing.jpg" },
                { name: "Bro. Wisdom Ogbonna", role: "Prayer Secretary", img_url: "/assets/execs/emmanuel.jpg" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExecutives();
    }, []);

    return (
        <div className="min-h-screen pt-32 pb-20 zeni-mesh-gradient">
            <SEO
                title="About Us"
                description="Learn about the history, vision, and mission of SSUCF UNEC - raising balanced Christian students at the University of Nigeria, Enugu Campus."
            />
            {/* Header */}
            <section className="container mx-auto px-6 mb-32 max-w-7xl">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="section-tag mb-8"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Our Story
                    </motion.div>

                    <h1 className="text-5xl md:text-8xl font-black text-[#00211F] mb-10 leading-none tracking-tighter">
                        Upholding <br />
                        <span className="text-emerald-600 italic">Standards.</span>
                    </h1>

                    <p className="text-[#00211F] text-xl font-medium opacity-40 leading-relaxed max-w-2xl">
                        Scripture Union Campus Fellowship (SUCF) UNEC is a vibrant non-denominational family committed to raising balanced Christian students who excel both spiritually and academically.
                    </p>
                </div>
            </section>

            <AnthemSection />

            {/* Vision / Mission / Values Section */}
            <section className="container mx-auto px-6 mb-40 max-w-7xl">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="zeni-card overflow-hidden aspect-square md:aspect-video lg:aspect-square"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2664&auto=format&fit=crop"
                                alt="Fellowship Group"
                                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#00211F]/60 via-transparent to-transparent" />

                            <div className="absolute bottom-10 left-10 right-10">
                                <p className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2">The Den</p>
                                <p className="text-white text-3xl font-black italic uppercase leading-none">Holy Ground.</p>
                            </div>
                        </motion.div>

                        {/* Decorative floating card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="absolute -bottom-10 -right-6 md:-right-10 zeni-card p-8 max-w-[280px] hidden md:block bg-white/90 backdrop-blur-xl border-emerald-100 shadow-2xl"
                        >
                            <p className="text-[#00211F] text-sm font-medium leading-relaxed italic">
                                "A sanctuary for spiritual growth and intellectual transformation in UNEC."
                            </p>
                        </motion.div>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                icon: <FiTarget />,
                                title: "Our Vision",
                                content: "Children, youth and adults nurtured to Christian maturity following Jesus and transforming Nigeria.",
                                color: "text-emerald-600",
                                bg: "bg-emerald-500/10"
                            },
                            {
                                icon: <FiUsers />,
                                title: "Our Mission",
                                content: "Upholding Scripture Union's commitment to reaching students and families through Bible engagement to become Christians of influence.",
                                color: "text-blue-600",
                                bg: "bg-blue-500/10"
                            },
                            {
                                icon: <FiAward />,
                                title: "Core Values",
                                content: "Integrity, Academic Stewardship, Servant Leadership, and Brotherly Love.",
                                color: "text-amber-600",
                                bg: "bg-amber-500/10"
                            }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="zeni-card p-8 flex gap-8 items-start hover:bg-white transition-all group"
                            >
                                <div className={`w-16 h-16 rounded-[1.5rem] ${item.bg} ${item.color} flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-[#00211F] mb-3 uppercase tracking-tight">{item.title}</h3>
                                    <p className="text-[#00211F] opacity-40 font-medium leading-relaxed">{item.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Leadership Section Preview */}
            <section className="container mx-auto px-6 py-20 text-center max-w-7xl">
                <div className="mb-24 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-tag mb-6"
                    >
                        Standard Bearers
                    </motion.div>
                    <h2 className="text-5xl md:text-6xl font-black text-[#00211F] mb-8 leading-none tracking-tighter">The <span className="text-emerald-600 italic">Leadership.</span></h2>
                    <p className="text-[#00211F] text-lg font-medium opacity-40">The Leadership for the 2025/2026 academic session.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {executives.map((exec, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="zeni-card p-8 flex flex-col group items-center text-center"
                        >
                            <div className="relative mb-8 pt-4">
                                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700" />
                                <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-[#F5F9F7] shadow-xl relative z-10 group-hover:border-emerald-50 transition-all">
                                    <img src={exec.img_url || exec.img} alt={exec.name} className="w-full h-full object-cover transition-all duration-700" />
                                </div>
                            </div>

                            <div className="flex-grow">
                                <h3 className="text-lg font-black text-[#00211F] mb-1 uppercase tracking-tight leading-tight whitespace-pre-line group-hover:text-emerald-600 transition-colors">
                                    {exec.name}
                                </h3>
                                <p className="text-[10px] font-black text-emerald-600/60 uppercase tracking-[0.2em]">
                                    {exec.role}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20">
                    <Link
                        to="/executives"
                        className="inline-flex items-center gap-4 group"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">View Full Executive Council</span>
                        <div className="w-12 h-12 zeni-card flex items-center justify-center text-xl group-hover:bg-[#00211F] group-hover:text-white transition-all transform group-hover:translate-x-2">
                            <FiArrowRight />
                        </div>
                    </Link>
                </div>
            </section>

            {/* Academic Growth Section */}
            <section className="container mx-auto px-6 py-32 max-w-7xl">
                <div className="zeni-card p-12 md:p-20 bg-[#00211F] relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -ml-48 -mb-48" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative z-10 max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-emerald-500/20">
                            <FiAward className="animate-bounce" /> Academic Excellence
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black text-white mb-10 leading-tight tracking-tighter italic uppercase">
                            Striving for <br />
                            <span className="text-emerald-500">Distinction.</span>
                        </h2>
                        <p className="text-emerald-50/60 text-lg md:text-xl font-medium mb-12 leading-relaxed">
                            We believe in raising balanced Christians who are not just spiritually sound, but academically outstanding. Our fellowship provides tools and support to help every member reach their full potential.
                        </p>

                        <button
                            onClick={() => setIsCalcOpen(true)}
                            className="group relative inline-flex items-center gap-6 px-10 py-6 bg-white rounded-[2rem] hover:bg-emerald-500 transition-all duration-500 shadow-2xl shadow-emerald-500/10"
                        >
                            <div className="w-14 h-14 bg-[#00211F] text-white rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                <FiCalculator />
                            </div>
                            <div className="text-left">
                                <p className="text-[#00211F] text-lg font-black uppercase tracking-tight leading-none group-hover:text-white transition-colors">Launch GPA Calculator</p>
                                <p className="text-[#00211F]/40 text-[10px] font-bold uppercase tracking-widest mt-1 group-hover:text-emerald-100 transition-colors">Plan your path to academic success</p>
                            </div>
                            <FiArrowRight className="text-2xl text-[#00211F] group-hover:text-white group-hover:translate-x-2 transition-all" />
                        </button>
                    </motion.div>
                </div>
            </section>

            <GPACalculator isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
        </div>
    );
};

export default About;
