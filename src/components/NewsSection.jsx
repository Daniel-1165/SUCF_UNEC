import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiFileText, FiChevronRight, FiClock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
        case 'event': return 'bg-purple-600';
        case 'announcement': return 'bg-blue-600';
        case 'academic': return 'bg-amber-500';
        case 'spiritual': return 'bg-emerald-600';
        default: return 'bg-emerald-600';
    }
};

const FeaturedNewsCard = ({ item }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative h-[400px] sm:h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 cursor-pointer border border-white/20"
        >
            {/* Background Image */}
            {item.image_url ? (
                <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <FiFileText className="text-8xl text-emerald-500/20" />
                </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-500 pointer-events-none" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10">
                <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg ${getCategoryColor(item.category)}`}>
                        {item.category || 'Featured'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1">
                        <FiClock className="inline" /> 5 min read
                    </span>
                </div>

                <h3 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 leading-tight group-hover:text-emerald-400 transition-colors">
                    <span className="bg-gradient-to-r from-white to-white bg-[length:0%_2px] bg-no-repeat bg-left-bottom group-hover:bg-[length:100%_2px] transition-all duration-500">
                        {item.title}
                    </span>
                </h3>

                <p className="text-slate-300 line-clamp-2 md:line-clamp-3 mb-6 max-w-xl text-sm md:text-base opacity-90 leading-relaxed font-light">
                    {item.content?.replace(/<[^>]*>/g, '').substring(0, 150)}...
                </p>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-sm text-slate-300 font-medium opacity-80">{formattedDate}</span>
                    <motion.span
                        whileHover={{ x: 5 }}
                        className="text-sm font-bold flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-emerald-600 hover:text-white transition-all backdrop-blur-sm"
                    >
                        Read Story <FiArrowRight />
                    </motion.span>
                </div>
            </div>

            <Link to={`/news/${item.id}`} className="absolute inset-0 z-20" />
        </motion.div>
    );
};

const NewsListItem = ({ item }) => {
    // Calculate relative time
    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return "Just now";
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ x: 5 }}
            className="flex-1 group relative transition-colors"
        >
            <div className="flex-1 pb-6 md:pb-8 border-b border-slate-100 group-last:border-0 group-last:pb-0">
                <Link to={`/news/${item.id}`} className="block">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white uppercase tracking-wider ${getCategoryColor(item.category)}`}>
                            {item.category || 'Update'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1">
                            <FiClock size={10} /> {getRelativeTime(item.created_at)}
                        </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-slate-800 leading-snug mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {item.title}
                    </h4>

                    <div className="flex items-center justify-end">
                        <span className="text-xs font-bold text-emerald-600 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex items-center gap-1">
                            Read <FiArrowRight />
                        </span>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchNews();
    }, [page]);

    const fetchNews = async () => {
        try {
            const { data, error, count } = await supabase
                .from('news')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

            if (error) throw error;
            if (data) {
                if (page === 1) {
                    setNews(data);
                } else {
                    setNews(prev => [...prev, ...data]);
                }
                setHasMore(news.length + data.length < count);
            }
        } catch (error) {
            console.error('Error fetching news:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    const featuredPost = news[0];
    const recentPosts = news.slice(1, 5);

    return (
        <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-3xl opacity-60 z-0 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60 z-0 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-4">
                    <div>
                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-3 block">Latest Updates</span>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                            Fellowship <span className="text-emerald-600 relative inline-block">
                                News
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-emerald-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5 L 100 10 L 0 10 Z" fill="currentColor" />
                                </svg>
                            </span>
                        </h2>
                    </div>
                    <Link to="/news" className="group flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-full text-sm font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm hover:shadow-lg">
                        View All News <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading && page === 1 ? (
                    <div className="grid lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 h-[500px] bg-slate-200 animate-pulse rounded-[2.5rem]" />
                        <div className="lg:col-span-5 space-y-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 animate-pulse rounded-xl" />)}
                        </div>
                    </div>
                ) : news.length > 0 ? (
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        {/* Featured Column */}
                        <div className="lg:col-span-7">
                            {featuredPost && <FeaturedNewsCard item={featuredPost} />}
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-5 flex flex-col pt-2 bg-white/50 backdrop-blur-sm p-6 rounded-[2rem] border border-white/50 shadow-xl shadow-slate-100/50">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-emerald-500 rounded-full" />
                                Recent Headlines
                            </h3>
                            <div className="space-y-8">
                                {recentPosts.length > 0 ? (
                                    recentPosts.map((item, idx) => (
                                        <div key={item.id} className="flex gap-5 items-start">
                                            <span className="text-3xl font-black text-slate-200 mt-[-8px] select-none font-heading">
                                                {(idx + 1).toString().padStart(2, '0')}
                                            </span>
                                            <NewsListItem item={item} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-slate-500 italic">No other recent news.</p>
                                )}
                            </div>

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="mt-10 text-center">
                                    <button
                                        onClick={handleLoadMore}
                                        className="w-full px-6 py-4 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-widest border border-slate-200 hover:border-emerald-200"
                                    >
                                        Load More Updates
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200">
                        <FiFileText className="mx-auto text-5xl text-slate-300 mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No news available</h3>
                        <p className="text-slate-500">Check back later for updates from the fellowship.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;
