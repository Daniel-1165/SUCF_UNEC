import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiFileText } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewsCard = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 1, y: 0 }}
            whileHover={{ y: -10 }}
            className="zeni-card overflow-hidden flex flex-col group h-full bg-white border-[#E8F3EF]"
        >
            <div className="relative aspect-video overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                        <FiFileText className="text-4xl text-emerald-200" />
                    </div>
                )}
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {item.category || 'Latest'}
                    </span>
                </div>
            </div>

            <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-2 text-emerald-600/60 text-[10px] font-black uppercase tracking-widest mb-4">
                    <FiCalendar />
                    <span>{formattedDate}</span>
                </div>
                <h3 className="text-2xl font-black text-[#00211F] mb-4 leading-tight group-hover:text-emerald-600 transition-colors">
                    {item.title}
                </h3>
                <p className="text-[#00211F] opacity-40 text-sm font-medium mb-8 line-clamp-3 leading-relaxed">
                    {item.content}
                </p>
                <div className="mt-auto">
                    <button className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2 group/btn">
                        Read Story <FiArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data, error } = await supabase
                    .from('news')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) throw error;
                setNews(data || []);
            } catch (error) {
                console.error('Error fetching news:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    // if (!loading && news.length === 0) return null;

    return (
        <section className="py-24 bg-white/30 backdrop-blur-md">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="section-tag mb-6">Updates</div>
                        <h2 className="text-5xl md:text-6xl font-black text-[#00211F] leading-none tracking-tighter">
                            Fellowship <span className="text-emerald-600 italic">News.</span>
                        </h2>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/5] bg-emerald-50/50 animate-pulse rounded-[2.5rem] border border-[#E8F3EF]"></div>
                        ))}
                    </div>
                ) : news.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {news.map((item) => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-emerald-50/50 rounded-[3rem] border border-emerald-100 border-dashed">
                        <FiFileText className="text-6xl text-emerald-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-emerald-900 mb-2">No Updates Yet</h3>
                        <p className="text-emerald-900/40">Check back later for the latest news and announcements.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;
