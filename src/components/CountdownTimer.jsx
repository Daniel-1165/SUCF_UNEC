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
        <div className="py-24 bg-emerald-50/50 backdrop-blur-sm relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-emerald-900/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-emerald-100 mb-8"
                >
                    <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full"></span>
                    <span className="text-[10px] font-bold text-emerald-900 tracking-widest uppercase">Upcoming Fellowship</span>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-center gap-16 w-full max-w-6xl">
                    {/* Flyer Section */}
                    {event?.flyer_url && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, x: -20 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="w-full lg:w-1/2"
                        >
                            <div className="relative group">
                                <div className="absolute -inset-2 bg-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative zeni-card p-0 bg-white overflow-hidden rounded-2xl shadow-2xl border-white border-2 aspect-square">
                                    <img
                                        src={event.flyer_url}
                                        alt={event.title}
                                        className="w-full h-full object-cover transform group-hover:scale-[1.05] transition-transform duration-700 font-black text-emerald-900"
                                    />

                                    {/* Admin Controls Overlay */}
                                    {user?.isAdmin && (
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                                            <Link
                                                to="/admin"
                                                className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-400 hover:scale-110 transition-all shadow-lg"
                                                title="Add New Event"
                                            >
                                                <FiPlus size={24} />
                                            </Link>
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
                                                className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-400 hover:scale-110 transition-all shadow-lg"
                                                title="Delete Event"
                                            >
                                                <FiTrash2 size={24} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Countdown Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className={`w-full ${event?.flyer_url ? 'lg:w-1/2' : 'max-w-3xl text-center'} flex flex-col justify-center`}
                    >
                        <h2 className="text-4xl md:text-6xl font-serif text-emerald-900 font-extrabold mb-4 leading-none tracking-tighter uppercase italic">
                            {event?.title}
                        </h2>

                        {(event?.location || event?.event_time) && (
                            <div className="flex flex-wrap gap-4 mb-10 overflow-hidden">
                                {event.event_time && (
                                    <span className="px-5 py-2 bg-emerald-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                        {event.event_time}
                                    </span>
                                )}
                                {event.location && (
                                    <span className="px-5 py-2 bg-white text-emerald-900 border border-emerald-100 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                        {event.location}
                                    </span>
                                )}
                            </div>
                        )}

                        <div className={`flex gap-4 md:gap-6 ${event?.flyer_url ? '' : 'justify-center'}`}>
                            {timerComponents.length ? timerComponents : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-2xl font-black text-emerald-600 italic uppercase tracking-tighter"
                                >
                                    Join us now! We are live.
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-12 group cursor-pointer">
                            <Link to="/contact" className="inline-flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-900 text-white flex items-center justify-center group-hover:bg-emerald-800 transition-colors">
                                    <FiArrowRight className="text-xl" />
                                </div>
                                <div>
                                    <span className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest">Need Directions?</span>
                                    <span className="block text-sm font-bold text-emerald-900 underline underline-offset-4">Get Location Info</span>
                                </div>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
