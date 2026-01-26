import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiFileText, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const FeaturedNewsCard = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group relative h-[400px] md:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 cursor-pointer"
        >
            {/* Background Image */}
            {item.image_url ? (
                <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <FiFileText className="text-6xl text-slate-700" />
                </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10 text-white z-10">
                <span className="inline-block px-3 py-1 mb-4 bg-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">
                    {item.category || 'Featured'}
                </span>
                <h3 className="text-2xl md:text-4xl font-bold mb-4 leading-tight group-hover:text-emerald-400 transition-colors">
                    {item.title}
                </h3>
                <div className="flex items-center justify-between mt-6 border-t border-white/20 pt-6">
                    <span className="text-sm text-slate-300 font-medium opacity-80">{formattedDate}</span>
                    <span className="text-sm font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                        Read Story <FiArrowRight />
                    </span>
                </div>
            </div>

            {/* Clickable Overlay Link */}
            <Link to={`/articles/${item.id}`} className="absolute inset-0 z-20" />
        </motion.div>
    );
};

const NewsListItem = ({ item }) => {
    // Calculate relative time (e.g., "14 minutes ago", "2 hours ago")
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-4 group relative pl-6 border-l-2 border-slate-100 hover:border-emerald-500 transition-colors"
        >
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-200 border-2 border-white group-hover:bg-emerald-500 transition-colors" />

            <div className="flex-1 pb-8 border-b border-slate-100 group-last:border-0 group-last:pb-0">
                <Link to={`/articles/${item.id}`} className="block group-hover:translate-x-1 transition-transform">
                    <h4 className="text-lg font-bold text-slate-800 leading-snug mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title}
                    </h4>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-red-500/80 uppercase tracking-wide">
                            {getRelativeTime(item.created_at)}
                        </span>
                        <FiChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = async () => {
        setLoading(true);
        try {
            // Fetch 4 items: 1 Featured + 3 List items
            const { data, error } = await supabase
                .from('news') // Or 'articles' if you handle them dynamically, sticking to 'news' for now based on context
                .select('*')
                .order('created_at', { ascending: false })
                .limit(4);

            if (error) throw error;
            setNews(data || []);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const featuredPost = news[0];
    const recentPosts = news.slice(1);

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-3xl opacity-50 z-0" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-red-500 uppercase tracking-widest">Live Updates</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                            Latest <span className="text-emerald-600">News.</span>
                        </h2>
                    </div>
                    <Link to="/articles" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                        View All Archives <FiArrowRight />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 h-[400px] bg-slate-100 animate-pulse rounded-[2.5rem]" />
                        <div className="lg:col-span-5 space-y-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 animate-pulse rounded-xl" />)}
                        </div>
                    </div>
                ) : news.length > 0 ? (
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                        {/* Featured Column */}
                        <div className="lg:col-span-7">
                            {featuredPost && <FeaturedNewsCard item={featuredPost} />}
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-5 flex flex-col pt-2">
                            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <span className="w-8 h-1 bg-red-500 rounded-full" />
                                Recent Headlines
                            </h3>
                            <div className="space-y-6">
                                {recentPosts.length > 0 ? (
                                    recentPosts.map((item) => (
                                        <NewsListItem key={item.id} item={item} />
                                    ))
                                ) : (
                                    <p className="text-slate-400 italic">No other recent news.</p>
                                )}
                            </div>

                            <Link to="/articles" className="mt-8 md:hidden flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                                View All Archives <FiArrowRight />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                        <FiFileText className="text-6xl text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No News Yet</h3>
                        <p className="text-slate-500">Check back later for updates from the fellowship.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;
