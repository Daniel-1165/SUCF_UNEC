import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CountdownTimer = ({ targetDate, title }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDate) - +new Date();
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

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        timerComponents.push(
            <div key={interval} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 glass-card flex items-center justify-center rounded-2xl mb-2">
                    <span className="text-2xl md:text-3xl font-bold text-primary-green">
                        {String(timeLeft[interval]).padStart(2, '0')}
                    </span>
                </div>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-gray-500">{interval}</span>
            </div>
        );
    });

    return (
        <div className="py-12 bg-light-green/30 backdrop-blur-sm relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-64 h-64 bg-vibrant-green/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-primary-green/5 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border border-green-100 mb-6"
                >
                    <span className="w-2 h-2 bg-vibrant-green animate-pulse rounded-full"></span>
                    <span className="text-[10px] font-bold text-primary-green tracking-widest uppercase">Upcoming Fellowship</span>
                </motion.div>

                <h2 className="text-2xl md:text-3xl font-serif text-primary-green font-bold mb-10 text-center">
                    {title || "Next Sunday Service"}
                </h2>

                <div className="flex gap-4 md:gap-8 justify-center">
                    {timerComponents.length ? timerComponents : (
                        <span className="text-xl font-bold text-primary-green">Join us now! We are live.</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;
