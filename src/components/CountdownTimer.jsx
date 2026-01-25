import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CountdownTimer = ({ targetDate: propTargetDate, title: propTitle }) => {
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Calculate fallback Sunday
    const getNextSunday = () => {
        const now = new Date();
        const nextSunday = new Date();
        nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
        if (now.getDay() === 0 && now.getHours() >= 15) {
            nextSunday.setDate(nextSunday.getDate() + 7);
        }
        nextSunday.setHours(15, 0, 0, 0);
        return nextSunday;
    };

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
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
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState({});

    useEffect(() => {
        if (!event?.event_date) return;

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
                <div className="w-16 h-16 md:w-20 md:h-20 glass-card flex items-center justify-center rounded-2xl mb-2">
                    <span className="text-2xl md:text-3xl font-bold text-emerald-900">
                        {String(timeLeft[interval]).padStart(2, '0')}
                    </span>
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500">{interval}</span>
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
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200 mb-8"
                >
                    <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full"></span>
                    <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">Upcoming Fellowship</span>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-16 w-full max-w-6xl">
                    {/* Flyer Section - Always Visible */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, x: -20 }}
                        whileInView={{ opacity: 1, scale: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="w-full lg:w-1/2"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-700"></div>
                            <div className="relative tech-card p-0 aspect-square group-hover:shadow-xl transition-all duration-700 bg-slate-50 flex items-center justify-center overflow-hidden">
                                {event?.flyer_url ? (
                                    <img
                                        src={event.flyer_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform group-hover:scale-[1.05] transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-300">
                                        <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                                            <span className="text-4xl">🖼️</span>
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-widest">No Flyer Available</p>
                                    </div>
                                )}

                                {/* Admin Controls Overlay */}
                                {user?.isAdmin && (
                                    <div className={`absolute inset-0 bg-white/80 transition-all duration-300 flex items-center justify-center gap-4 ${event?.flyer_url ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
                                        <Link
                                            to="/admin"
                                            className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 hover:scale-110 transition-all shadow-lg"
                                            title={event?.flyer_url ? "Replace Flyer" : "Add Flyer"}
                                        >
                                            <FiPlus size={24} />
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
                                                className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-lg"
                                                title="Delete Event"
                                            >
                                                <FiTrash2 size={24} />
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
                        className="w-full lg:w-1/2 flex flex-col justify-center"
                    >
                        <h2 className="text-4xl md:text-6xl font-heading text-slate-900 font-extrabold mb-4 leading-none tracking-tighter uppercase">
                            {event?.title}
                        </h2>

                        {(event?.location || event?.event_time) && (
                            <div className="flex flex-wrap gap-4 mb-10 overflow-hidden">
                                {event.event_time && (
                                    <span className="px-5 py-2 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                        {event.event_time}
                                    </span>
                                )}
                                {event.location && (
                                    <span className="px-5 py-2 bg-white text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                                        {event.location}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex gap-4 md:gap-6 justify-start">
                            {timerComponents.length ? (
                                timerComponents.map((comp, idx) => (
                                    <div key={idx} className="flex flex-col items-center">
                                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-slate-200 shadow-sm flex items-center justify-center rounded-2xl mb-2">
                                            <span className="text-2xl md:text-3xl font-bold text-slate-900">
                                                {comp.props.children[0].props.children}
                                            </span>
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400">{comp.key}</span>
                                    </div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-2xl font-bold text-emerald-600 italic uppercase tracking-tighter"
                                >
                                    Join us now! We are live.
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-12 group cursor-pointer">
                            <Link to="/contact" className="inline-flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border border-slate-200 text-slate-900 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                    <FiArrowRight className="text-xl" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Need Directions?</span>
                                    <span className="block text-sm font-bold text-slate-900 underline underline-offset-4 decoration-slate-200 group-hover:decoration-emerald-500 transition-all">Get Location Info</span>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sliding Text Message - Transparent Background & Black Text */}
            <div className="w-full overflow-hidden py-6 mt-20">
                <motion.div
                    animate={{ x: [1000, -1500] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="whitespace-nowrap flex gap-20 items-center"
                >
                    <span className="text-2xl md:text-3xl font-serif italic text-black/60 tracking-tight font-medium">
                        Join us at Architecture Auditorium for a Life Changing Session in God's Presence
                    </span>
                    <span className="text-2xl md:text-3xl font-serif italic text-black/60 tracking-tight font-medium">
                        Join us at Architecture Auditorium for a Life Changing Session in God's Presence
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

export default CountdownTimer;
