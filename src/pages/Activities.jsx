import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiMapPin, FiCompass, FiArrowRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Activities = () => {
    const events = [
        {
            day: 'Sunday',
            title: 'Sunday Fellowship',
            time: '3:00 PM PROMPT',
            location: 'Architecture Auditorium Unec',
            icon: '✝️',
            color: 'from-emerald-800 to-emerald-600',
            details: ["Deep Worship", "Divine Exhortation", "Family Time"],
            image: '/assets/sunday_fellowship.jpg',
            tag: 'Main Event'
        },
        {
            day: 'Wednesday',
            title: 'Weekly Prayers',
            time: '6:00 PM PROMPT',
            location: 'Freedom Field (Opposite Mariere Hostel)',
            icon: '🔥',
            color: 'from-orange-600 to-red-600',
            image: '/assets/weekly_prayers.jpg',
            quote: '"...men ought always to pray and not to faint" - Luke 18:1',
            tag: 'Spiritual Fire'
        },
        {
            day: 'Thursday',
            title: 'Bible Study',
            time: '5:00 PM (Prep) | 6:00 PM (Main)',
            location: 'Architecture Auditorium (Opp. Medical Center)',
            icon: '📖',
            color: 'from-amber-600 to-yellow-600',
            image: '/assets/bible_study_flyer.jpg',
            breakdown: [
                { label: "Preparatory", time: "5:00 PM" },
                { label: "Main Session", time: "6:00 PM" }
            ],
            tag: 'Intellectual Growth'
        }
    ];

    const units = [
        {
            name: 'Evangelism Unit',
            description: 'Spreading the gospel and reaching out with the love of Christ',
            image: '/assets/evangelism_unit.jpg',
            icon: '📢',
            color: 'from-emerald-600 to-teal-600'
        },
        {
            name: 'Choral Unit',
            description: 'Lifting voices in worship and praise to glorify God',
            image: '/assets/choral_unit.jpg',
            icon: '🎵',
            color: 'from-purple-600 to-pink-600'
        },
        {
            name: 'Drama & Creativity',
            description: 'Expressing faith through creative arts and dramatic presentations',
            image: '/assets/drama_unit.jpg',
            icon: '🎭',
            color: 'from-orange-600 to-red-600'
        },
        {
            name: 'Media & Publicity',
            description: 'Capturing moments and sharing the fellowship story',
            image: '/assets/media_unit.jpg',
            icon: '📸',
            color: 'from-blue-600 to-cyan-600'
        }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 zeni-mesh-gradient">
            <header className="container mx-auto px-6 mb-24 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="section-tag mb-8"
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Weekly Gatherings
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black text-[#00211F] mb-8 leading-none tracking-tighter">
                    Join Our <span className="text-emerald-600 italic">Fellowship.</span>
                </h1>

                <p className="text-[#00211F] text-xl font-medium opacity-40 leading-relaxed mb-12 max-w-2xl">
                    We gather three times a week to grow, pray, and sharpen one another. Every student is welcome to the Den.
                </p>
            </header>

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-32 max-w-7xl">
                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                    >
                        <div className="zeni-card h-full flex flex-col relative z-10 overflow-hidden">
                            {/* Header Section with Image */}
                            <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F9F7]">
                                <img
                                    src={event.image}
                                    alt={event.day}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

                                {/* Tag Removed */}
                            </div>

                            <div className="p-10 flex-grow flex flex-col">
                                <h2 className="text-3xl font-black text-[#00211F] mb-1">{event.day}</h2>
                                <h3 className="text-lg font-bold text-emerald-600 mb-8 uppercase tracking-widest">{event.title}</h3>

                                <div className="space-y-6 mb-10 flex-grow">
                                    <div className="flex items-center gap-4 text-[#00211F]">
                                        <div className="w-10 h-10 rounded-xl bg-[#F5F9F7] flex items-center justify-center text-emerald-600">
                                            <FiClock className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-0.5">Time</p>
                                            <p className="font-bold">{event.time}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-[#00211F]">
                                        <div className="w-10 h-10 rounded-xl bg-[#F5F9F7] flex items-center justify-center text-emerald-600">
                                            <FiMapPin className="text-xl" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mb-0.5">Location</p>
                                            <p className="font-bold text-sm leading-tight">{event.location}</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-5 rounded-[1.5rem] bg-[#00211F] text-white font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/10">
                                    Get Directions <FiCompass className="text-lg" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Units Section */}
            <div className="container mx-auto px-6 mb-32 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="section-tag mb-8"
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    Fellowship Units
                </motion.div>

                <h2 className="text-4xl md:text-6xl font-black text-[#00211F] mb-6 leading-none tracking-tighter">
                    Serve in <span className="text-emerald-600 italic">Unity.</span>
                </h2>

                <p className="text-[#00211F] text-lg font-medium opacity-40 leading-relaxed mb-16 max-w-2xl">
                    Join one of our dynamic units and use your gifts to advance the Kingdom on campus.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {units.map((unit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                delay: index * 0.15,
                                duration: 0.6,
                                ease: "easeOut"
                            }}
                            className="group relative"
                        >
                            <div className="zeni-card h-full flex flex-col overflow-hidden">
                                {/* Image Section */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F9F7]">
                                    <img
                                        src={unit.image}
                                        alt={unit.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    {/* Gradient Overlay on Hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${unit.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-black text-[#00211F] mb-3 group-hover:text-emerald-600 transition-colors">
                                        {unit.name}
                                    </h3>
                                    <p className="text-[#00211F] opacity-40 text-sm leading-relaxed font-medium">
                                        {unit.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="container mx-auto px-6 max-w-7xl"
            >
                <div className="zeni-card-dark p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-emerald-400 tracking-[0.3em] uppercase">Weekly Note</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                            More than just <br />
                            <span className="text-emerald-400 italic">Gatherings.</span>
                        </h2>
                        <p className="text-white/60 text-lg font-medium leading-relaxed">
                            We also have other Weekly Wing Activities and special programs throughout the semester. Connect with us to stay updated.
                        </p>
                    </div>

                    <Link
                        to="/contact"
                        className="bg-emerald-500 text-[#00211F] px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shrink-0 relative z-10 shadow-2xl shadow-emerald-500/20"
                    >
                        Contact Wing Reps
                    </Link>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                </div>
            </motion.div>
        </div>
    );
};

export default Activities;
