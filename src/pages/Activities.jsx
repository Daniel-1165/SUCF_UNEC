import React from 'react';
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

    return (
        <div className="pt-32 pb-16 min-h-screen bg-gray-50/50">
            <header className="container mx-auto px-6 mb-24 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-6"
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    <span className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase">Weekly Gatherings</span>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-serif text-emerald-900 font-bold mb-6">Join Our Fellowship</h1>
                <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">We gather three times a week to grow, pray, and sharpen one another. Every student is welcome to the Den.</p>
            </header>

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
                {events.map((event, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative"
                    >
                        {/* Background Design */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${event.color} rounded-[3rem] blur-2xl opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />

                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col relative z-10">
                            {/* Day Badge */}
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${event.color} flex items-center justify-center text-3xl shadow-lg ring-8 ring-gray-50`}>
                                    {event.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${index === 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : index === 1 ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                    {event.tag}
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold font-serif text-gray-900 mb-2">{event.day}</h2>
                            <h3 className="text-xl font-medium text-gray-500 mb-8">{event.title}</h3>

                            {/* Image Preview */}
                            <div className="mb-8 rounded-[2rem] overflow-hidden aspect-[4/3] shadow-inner bg-gray-50 border border-gray-100">
                                <img src={event.image} alt={event.day} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                            </div>

                            {/* Info */}
                            <div className="space-y-4 mb-8 flex-grow">
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm">
                                        <FiClock />
                                    </div>
                                    <span className="font-bold text-sm tracking-tight">{event.time}</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-sm">
                                        <FiMapPin />
                                    </div>
                                    <span className="font-medium text-xs leading-tight">{event.location}</span>
                                </div>
                            </div>

                            {/* Action / Detail */}
                            <button className="w-full py-4 rounded-2xl bg-gray-50 text-gray-800 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-emerald-800 group-hover:text-white transition-all duration-300">
                                Get Directions <FiCompass />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="container mx-auto px-6 text-center"
            >
                <div className="inline-flex flex-col md:flex-row items-center gap-6 bg-emerald-900 text-white px-10 py-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    {/* Background Shine */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <p className="text-lg font-medium relative z-10">
                        <span className="font-bold text-emerald-400">Note:</span> We also have other Weekly Wing Activities and special programs throughout the semester.
                    </p>
                    <button className="bg-white text-emerald-900 px-8 py-3 rounded-full font-bold text-sm hover:bg-emerald-100 transition-colors shrink-0 relative z-10">
                        Contact Wing Reps
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Activities;
