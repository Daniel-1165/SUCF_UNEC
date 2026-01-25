import React from 'react';
import { motion } from 'framer-motion';

const AnthemSection = () => {
    return (
        <section className="py-24 bg-[#0F172A] text-amber-500 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/20 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em]">Our Heritage</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">The Anthem.</h2>
                    <div className="w-24 h-1 bg-amber-500/30 mx-auto rounded-full"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 md:p-16 rounded-[3rem] shadow-2xl relative"
                >
                    {/* Corner accents */}
                    <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
                    <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-amber-500/30 rounded-tr-2xl" />
                    <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-amber-500/30 rounded-bl-2xl" />
                    <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />

                    <div className="space-y-8 font-serif text-lg md:text-2xl leading-relaxed text-amber-50 italic">
                        <p>
                            <span className="text-amber-400 font-bold not-italic">SUCF the Unique Family</span><br />
                            We are marching on by His grace<br />
                            Following Jesus the author of our faith<br />
                            And the owner of our soul
                        </p>
                        <p>
                            We shall follow till we all see Him<br />
                            There is no time to sleep on the way
                        </p>
                        <p>
                            <span className="text-amber-400 font-bold not-italic">Jesus the answer, He is the way</span><br />
                            Jesus the truth and the life<br />
                            We shall follow righteousness<br />
                            We shall follow holiness<br />
                            Without which no eye shall see Him
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AnthemSection;
