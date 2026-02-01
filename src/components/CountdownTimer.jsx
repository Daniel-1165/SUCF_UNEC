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

        // Set to next Sunday
        nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
        nextSunday.setHours(15, 0, 0, 0); // 3:00 PM

        // If today is Sunday and it's past 3 PM, move to next week
        if (now.getDay() === 0 && now > nextSunday) {
            nextSunday.setDate(nextSunday.getDate() + 7);
        }

        // If today is not Sunday, but calculate date resulted in today (e.g. earlier calculation quirk), ensure it is future.
        // Actually (7 - day) % 7 gives 0 if today is Sunday.
        // If today is Sunday 10am, (7-0)%7 = 0. nextSunday is today 3pm. OK.
        // If today is Sunday 4pm, nextSunday is today 3pm. (now > nextSunday) is true. Add 7 days. OK.

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
                // Fallback on error
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

    // Countdown Logic
    useEffect(() => {
        if (!event?.event_date) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(event.event_date).getTime();
            const difference = target - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                // If specific database event passed, maybe refresh? 
                // For now, stick to zeros
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [event]);

    if (loading) return null; // Or a skeleton

    return (
        <div className="py-20 md:py-32 bg-white relative overflow-hidden">
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 max-w-7xl mx-auto">

                    {/* LEFT: Flyer / Visual (Interactive) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-5/12 perspective-1000 mx-auto"
                    >
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="absolute inset-0 bg-emerald-900 rounded-2xl transform rotate-3 scale-[0.98] opacity-20 transition-all duration-500 group-hover:rotate-6 group-hover:scale-100"></div>
                            <div className="absolute inset-0 bg-emerald-500 rounded-2xl transform -rotate-2 scale-[0.98] opacity-20 transition-all duration-500 group-hover:-rotate-4 group-hover:scale-100"></div>

                            {/* Main Card */}
                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 group-hover:shadow-emerald-900/20 border border-slate-100 aspect-[4/5] flex items-center justify-center">
                                {event?.flyer_url ? (
                                    <>
                                        <img src={event.flyer_url} alt="Flyer" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                            <div className="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-xl">
                                                <FiInfo className="text-2xl text-emerald-900" />
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-8">
                                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">🗓️</div>
                                        <h3 className="text-emerald-900 font-bold uppercase tracking-widest text-sm">Save the Date</h3>
                                        <p className="text-slate-400 text-xs mt-2">Click for details</p>
                                    </div>
                                )}
                            </div>

                            {/* Admin Edit Button Floating */}
                            {user?.isAdmin && (
                                <Link
                                    to="/admin?tab=events"
                                    onClick={(e) => e.stopPropagation()}
                                    className="absolute -top-4 -right-4 w-12 h-12 bg-white text-emerald-900 rounded-full shadow-lg border border-slate-100 flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-all z-20 opacity-0 group-hover:opacity-100 duration-300"
                                    title="Manage Events"
                                >
                                    <FiPlus />
                                </Link>
                            )}
                        </div>
                    </motion.div>

                    {/* RIGHT: Content & Countdown */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        className="w-full lg:w-7/12 text-center lg:text-left"
                    >
                        <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full mb-6 border border-emerald-100">
                            Upcoming Fellowship
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tight mb-4 font-heading">
                            {event?.title}
                        </h2>

                        {/* Bible Reference */}
                        {event?.bible_reference && (
                            <div className="mb-8 relative inline-block">
                                <span className="absolute -left-4 -top-2 text-4xl text-emerald-200 font-serif opacity-50">"</span>
                                <p className="text-lg md:text-xl text-slate-500 font-serif italic pl-4 pr-4">
                                    {event.bible_reference}
                                </p>
                            </div>
                        )}

                        {/* Modern Countdown Grid */}
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                            {[
                                { label: 'Days', value: timeLeft.days },
                                { label: 'Hours', value: timeLeft.hours },
                                { label: 'Minutes', value: timeLeft.minutes },
                                { label: 'Seconds', value: timeLeft.seconds }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg mb-2 relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                        <span className="text-2xl md:text-3xl font-bold text-white font-mono relative z-10">
                                            {String(item.value).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start items-center">
                            <button
                                onClick={() => setSelectedEvent(event)}
                                className="px-8 py-4 bg-emerald-900 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 flex items-center gap-3 group"
                            >
                                <FiCalendar className="text-lg group-hover:scale-110 transition-transform" />
                                Event Details
                            </button>
                            <Link to="/contact" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-slate-50 transition-all flex items-center gap-3">
                                <FiMapPin /> Directions
                            </Link>
                        </div>
                    </motion.div>
                </div>
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
                            initial={{ scale: 0.9, y: 50, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 50, opacity: 0 }}
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
                                        <FiCalendar className="text-6xl mb-4 opacity-50" />
                                        <p className="font-bold uppercase text-xs tracking-widest">No Flyer Available</p>
                                    </div>
                                )}
                            </div>

                            {/* Info Side */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                                    Upcoming Event
                                </span>

                                <h3 className="text-3xl font-black text-slate-900 mb-2 leading-tight">{selectedEvent.title}</h3>
                                {selectedEvent.bible_reference && <p className="text-emerald-600 font-serif italic mb-6">{selectedEvent.bible_reference}</p>}

                                <div className="space-y-6 mb-8">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0">
                                            <FiClock />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Time</p>
                                            <p className="text-sm text-slate-500">
                                                {new Date(selectedEvent.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                <br />
                                                {selectedEvent.event_time || new Date(selectedEvent.event_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-emerald-600 shrink-0">
                                            <FiMapPin />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">Venue</p>
                                            <p className="text-sm text-slate-500">{selectedEvent.location || "Architecture Lecture Theatre (ALT), UNEC"}</p>
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
                                    <button className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors uppercase tracking-wide">
                                        Add to Calendar
                                    </button>
                                    <button className="px-4 py-3 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-200 transition-colors">
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
