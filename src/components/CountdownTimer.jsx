import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus, FiTrash2, FiMapPin, FiClock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CountdownTimer = ({ targetDate: propTargetDate, title: propTitle }) => {
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Calculate fallback Sunday using UTC to ensure global consistency
    // Fellowship is Sunday 3:00 PM WAT (West Africa Time) = UTC+1
    // 15:00 WAT = 14:00 UTC
    const getNextSunday = () => {
        const now = new Date();
        const currentDay = now.getUTCDay(); // Sunday = 0
        const currentHour = now.getUTCHours();

        let daysUntilSunday = (7 - currentDay) % 7;

        // If it is Sunday (0), check if we passed 14:00 UTC (3 PM WAT)
        if (currentDay === 0 && currentHour >= 14) {
            daysUntilSunday = 7;
        }

        const nextSunday = new Date();
        nextSunday.setDate(now.getDate() + daysUntilSunday);
        // Set to 14:00 UTC (3:00 PM WAT)
        nextSunday.setUTCHours(14, 0, 0, 0);

        return nextSunday;
    };

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                // We want to verify against local time? No, ideally ISO string comparison works fine.
                // But let's stick to the simple query.
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
                        title: propTitle || "Next Sunday Service",
                        event_date: propTargetDate
                    });
                } else {
                    setEvent({
                        title: "Next Sunday Service",
                        event_date: getNextSunday().toISOString()
                    });
                }
            } catch (error) {
                console.error("Error fetching event:", error);
                setEvent({
                    title: "Next Sunday Service",
                    event_date: getNextSunday().toISOString()
                });
            } finally {
                setLoading(false);
            }
        };

        fetchNextEvent();
    }, [propTargetDate, propTitle]);

    const calculateTimeLeft = () => {
        if (!event?.event_date) return {};
        const difference = +new Date(event.event_date) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            // For weekly events, cap at 7 days
            timeLeft = {
                days: Math.min(days, 7)
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        if (!event?.event_date) return;

        // Run immediately to avoid 1s delay
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [event]);

    if (loading) return (
        <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs">Loading Fellowship Details...</p>
        </div>
    );

    const timerComponents = [];
    Object.keys(timeLeft).forEach((interval) => {
        timerComponents.push(
            <div key={interval} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 glass-card flex items-center justify-center rounded-xl mb-2 border border-slate-100 shadow-lg">
                    <span className="text-2xl md:text-3xl font-bold text-emerald-900 font-heading">
                        {String(timeLeft[interval]).padStart(2, '0')}
                    </span>
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">{interval}</span>
            </div>
        );
    });

    return (
        <div className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
            <div className="container mx-auto px-6 flex flex-col items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200 mb-12 shadow-sm"
                >
                    <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">Upcoming Fellowship</span>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-16 w-full max-w-6xl">
                    {/* Flyer Section - Minimalist & Sleek */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: -20 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative group">
                            {/* Subtle Shadow */}
                            <div className="absolute -inset-2 bg-slate-900/5 rounded-lg blur-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Main Flyer Container - Clean & Minimal */}
                            <div className="relative z-10 bg-white rounded-lg shadow-sm border border-slate-200/60 overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-slate-300/60">
                                <div className="w-full aspect-[4/5] bg-slate-50 flex items-center justify-center relative">
                                    {event?.flyer_url ? (
                                        <img
                                            src={event.flyer_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-300">
                                            <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center mb-3">
                                                <span className="text-3xl grayscale opacity-40">🖼️</span>
                                            </div>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Awaiting Flyer</p>
                                        </div>
                                    )}
                                </div>

                                {/* Admin Controls Overlay */}
                                {user?.isAdmin && (
                                    <div className={`absolute inset-0 bg-white/95 backdrop-blur-sm transition-all duration-300 flex items-center justify-center gap-3 ${event?.flyer_url ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                        <Link
                                            to="/admin?tab=events"
                                            className="w-11 h-11 bg-slate-900 text-white rounded-lg flex items-center justify-center hover:bg-emerald-600 transition-all shadow-sm"
                                            title={event?.flyer_url ? "Replace Flyer" : "Add Flyer"}
                                        >
                                            <FiPlus size={20} />
                                        </Link>
                                        {event?.flyer_url && (
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm("Are you sure you want to delete this event flyer?")) {
                                                        try {
                                                            const { error } = await supabase
                                                                .from('fellowship_events')
                                                                .delete()
                                                                .eq('id', event.id);
                                                            if (error) throw error;
                                                            window.location.reload();
                                                        } catch (err) {
                                                            alert("Failed to delete flyer: " + err.message);
                                                        }
                                                    }
                                                }}
                                                className="w-11 h-11 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-all shadow-sm"
                                                title="Delete Event"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Countdown Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left items-center lg:items-start"
                    >
                        <div className="mb-6">
                            <h2 className="text-3xl md:text-5xl font-heading text-slate-900 font-extrabold leading-none tracking-tight">
                                {event?.title}
                            </h2>
                            {event?.bible_reference && (
                                <p className="text-sm md:text-base text-emerald-600 font-semibold mt-2 italic">
                                    {event.bible_reference}
                                </p>
                            )}
                        </div>

                        {(event?.location || event?.event_time) && (
                            <div className="flex flex-wrap gap-3 mb-10 justify-center lg:justify-start">
                                {event.event_time && (
                                    <span className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                                        <FiClock /> {event.event_time}
                                    </span>
                                )}
                                {event.location && (
                                    <span className="px-4 py-2 bg-slate-50 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2">
                                        <FiMapPin /> {event.location}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 md:gap-6 justify-center lg:justify-start">
                            {timerComponents.length ? (
                                <div className="flex flex-col items-center">
                                    <div className="w-24 h-24 md:w-28 md:h-28 bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-center rounded-lg mb-3">
                                        <span className="text-4xl md:text-5xl font-bold text-white font-heading">
                                            {String(timeLeft.days || 0).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500">Days</span>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-6 bg-emerald-50 border border-emerald-100 rounded-lg"
                                >
                                    <p className="text-xl md:text-2xl font-bold text-emerald-800 uppercase tracking-tight mb-2">
                                        Happening Now!
                                    </p>
                                    <p className="text-sm text-emerald-600 font-medium">
                                        Join us live at the venue or connect online.
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-12 group cursor-pointer">
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

            {/* Enhanced Sliding Text - Professional Ticker Style */}
            <div className="w-full border-t border-b border-slate-100 bg-slate-50/50 py-3 mt-16 overflow-hidden relative">
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

                <motion.div
                    animate={{ x: [0, -2000] }}
                    transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    className="whitespace-nowrap flex gap-12 items-center"
                >
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center gap-4 opacity-70">
                            <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-[0.2em] flex items-center gap-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                Join us at Architecture Auditorium for a Life Changing Session in God's Presence
                            </span>
                            <span className="text-slate-300 px-4">|</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default CountdownTimer;
