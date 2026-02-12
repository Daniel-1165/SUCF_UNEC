import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus, FiTrash2, FiMapPin, FiClock, FiX, FiCalendar, FiShare2, FiInfo } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CountdownTimer = ({ targetDate: propTargetDate, title: propTitle }) => {
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    // Helper: Get next Sunday at 3:00 PM
    const getNextFellowshipDate = () => {
        const now = new Date();
        const nextSunday = new Date();

        // Sunday is 0. Calculate days to add: (7 - now.getDay()) % 7
        let daysToAdd = (7 - now.getDay()) % 7;

        nextSunday.setDate(now.getDate() + daysToAdd);
        nextSunday.setHours(15, 0, 0, 0); // 3:00 PM

        // If today is Sunday and it's already past 3 PM, move to next week Sunday
        if (now.getDay() === 0 && now > nextSunday) {
            nextSunday.setDate(nextSunday.getDate() + 7);
        }

        return nextSunday;
    };

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                // Fetch the nearest future event from DB
                const { data, error } = await supabase
                    .from('fellowship_events')
                    .select('*')
                    .gte('event_date', new Date().toISOString())
                    .order('event_date', { ascending: true })
                    .limit(1)
                    .single();

                console.log("Fetched Event Data:", data);
                console.log("Fetch Error:", error);

                if (data) {
                    setEvent(data);
                } else if (propTargetDate) {
                    setEvent({
                        title: propTitle || "Sunday Fellowship",
                        event_date: propTargetDate,
                        bible_reference: "Hebrews 10:25",
                        description: "Join us for a time of refreshing in God's presence."
                    });
                } else {
                    // Fallback to automatic weekly calculation
                    setEvent({
                        title: "Weekly Fellowship Service",
                        event_date: getNextFellowshipDate().toISOString(),
                        bible_reference: "Matthew 18:20",
                        description: "For where two or three are gathered together in my name, there am I in the midst of them."
                    });
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                setEvent({
                    title: "Fellowship Service",
                    event_date: getNextFellowshipDate().toISOString(),
                    bible_reference: "Psalm 122:1",
                    description: "I was glad when they said unto me, Let us go into the house of the LORD."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchNextEvent();
    }, [propTargetDate, propTitle]);

    const [isLive, setIsLive] = useState(false);

    // Filter for live status: Sunday 3:00 PM to 5:00 PM
    const checkIfLive = () => {
        const now = new Date();
        const day = now.getDay(); // 0 is Sunday
        const hours = now.getHours();
        const minutes = now.getMinutes();

        if (day === 0) {
            const timeInMinutes = hours * 60 + minutes;
            const startLive = 15 * 60; // 15:00 (3:00 PM)
            const endLive = 17 * 60;   // 17:00 (5:00 PM)
            return timeInMinutes >= startLive && timeInMinutes <= endLive;
        }
        return false;
    };

    // Countdown Logic - Strictly Weekly (0-7 days)
    useEffect(() => {
        const timer = setInterval(() => {
            setIsLive(checkIfLive());

            const now = new Date();
            // We always target the next upcoming Sunday 3PM for the weekly rhythm
            const targetDate = getNextFellowshipDate();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // If loading, we still show the section with default values to prevent layout shift
    // but we can add a subtle loading indicator if desired.
    // if (loading) return null; 


    return (
        <div className="py-20 md:pt-32 pb-0 bg-white relative overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">

                    {/* LEFT: Flyer Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-5/12 mx-auto"
                    >
                        {/* Tag above flyer */}
                        <div className="flex justify-center lg:justify-start mb-6">
                            <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full border border-emerald-100">
                                Upcoming Fellowship
                            </div>
                        </div>

                        <div
                            className="relative group cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="absolute inset-0 bg-emerald-900 rounded-2xl transform rotate-2 scale-[0.98] opacity-10 transition-all duration-500 group-hover:rotate-4 group-hover:scale-100"></div>

                            {/* Main Flyer Container */}
                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)] border border-slate-100 aspect-[4/5] flex items-center justify-center">
                                {event?.flyer_url ? (
                                    <>
                                        <img src={event.flyer_url} alt="Flyer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl">
                                                <FiInfo className="text-xl text-emerald-900" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🖼️</div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tap for details</p>
                                    </div>
                                )}

                                {/* Admin Edit Shortcut */}
                                {user?.isAdmin && (
                                    <Link
                                        to="/admin?tab=events"
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-4 right-4 w-10 h-10 bg-white/95 text-emerald-900 rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100"
                                        title="Manage Events"
                                    >
                                        <FiPlus />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* RIGHT: Content & Countdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="w-full lg:w-7/12 text-center lg:text-left"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tight mb-6 font-heading">
                            {event?.title}
                        </h2>

                        {/* Bible Reference */}
                        {event?.bible_reference && (
                            <div className="mb-8 relative inline-flex items-center">
                                <span className="absolute -left-2 top-0 text-3xl text-emerald-200 font-serif opacity-40">"</span>
                                <p className="text-lg md:text-xl text-slate-500 font-serif italic pl-4 pr-4">
                                    {event.bible_reference}
                                </p>
                            </div>
                        )}

                        {/* Weekly Countdown Grid or LIVE Status */}
                        {isLive ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-12 flex flex-col items-center lg:items-start"
                            >
                                <div className="flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-2xl shadow-xl shadow-red-600/20 animate-pulse">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                    <span className="text-xl font-black uppercase tracking-widest leading-none">Fellowship is Live!</span>
                                </div>
                                <p className="mt-4 text-slate-500 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                    Join us now at the Architecture Auditorium
                                </p>
                            </motion.div>
                        ) : (
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
                                {[
                                    { label: 'Days', value: timeLeft.days },
                                    { label: 'Hours', value: timeLeft.hours },
                                    { label: 'Minutes', value: timeLeft.minutes },
                                    { label: 'Seconds', value: timeLeft.seconds }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg mb-2 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                            <span className="text-xl md:text-3xl font-bold text-white font-mono relative z-10">
                                                {String(item.value).padStart(2, '0')}
                                            </span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Former Style Contact Link */}
                        <div className="group cursor-pointer">
                            <Link to="/contact" className="inline-flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-slate-200 text-slate-900 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                    <FiArrowRight className="text-xl" />
                                </div>
                                <div className="text-left">
                                    <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Need Directions?</span>
                                    <span className="block text-sm font-bold text-slate-900 underline underline-offset-4 decoration-slate-200 group-hover:decoration-emerald-500 transition-all">Get Location Info</span>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Text Slider / Ticker */}
            <div className="w-full border-t border-b border-slate-100 bg-slate-50/50 py-4 mt-24 overflow-hidden relative flex">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50/50 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50/50 to-transparent z-10"></div>

                <motion.div
                    animate={{ x: [0, -1000] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="flex items-center whitespace-nowrap"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="flex items-center mx-8 flex-shrink-0">
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                Join us at Architecture Auditorium for a Life Changing Session in God's Presence
                            </span>
                            <span className="text-slate-300 ml-8">|</span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Event Detail Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedEvent(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative"
                        >
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all backdrop-blur"
                            >
                                <FiX />
                            </button>

                            {/* Image Side */}
                            <div className="w-full md:w-1/2 bg-slate-100 h-64 md:h-auto relative overflow-hidden">
                                {selectedEvent.flyer_url ? (
                                    <img src={selectedEvent.flyer_url} alt={selectedEvent.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                        <FiCalendar className="text-6xl mb-4 opacity-30" />
                                        <p className="font-bold uppercase text-xs tracking-widest">Weekly Service</p>
                                    </div>
                                )}
                            </div>

                            {/* Info Side */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                                    Service Information
                                </span>

                                <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedEvent.title}</h3>
                                {selectedEvent.bible_reference && <p className="text-emerald-600 font-serif italic mb-6">{selectedEvent.bible_reference}</p>}

                                <div className="space-y-6 mb-10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0">
                                            <FiClock />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Weekly Schedule</p>
                                            <p className="text-sm text-slate-500">Every Sunday • 3:00 PM Prompt</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0">
                                            <FiMapPin />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Venue</p>
                                            <p className="text-sm text-slate-500">{selectedEvent.location || "Architecture Auditorium, UNEC"}</p>
                                        </div>
                                    </div>

                                    {selectedEvent.description && (
                                        <div className="pt-4 border-t border-slate-100">
                                            <p className="text-slate-600 leading-relaxed text-sm">
                                                {selectedEvent.description}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Link to="/contact" className="flex-1 py-4 bg-slate-900 text-white rounded-xl text-center font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wide">
                                        Get Directions
                                    </Link>
                                    <button className="px-5 py-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-colors">
                                        <FiShare2 />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CountdownTimer;
