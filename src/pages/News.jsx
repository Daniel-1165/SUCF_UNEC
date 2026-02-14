import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const News = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNews(data || []);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-32 pb-20">
            <SEO
                title="News - SUCF UNEC"
                description="Stay updated with the latest news and announcements from SUCF UNEC."
            />

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6"
                    >
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Latest Updates</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 mb-4"
                    >
                        Fellowship <span className="text-blue-600">News</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Stay informed with the latest announcements and updates from our community
                    </motion.p>
                </div>

                {/* News Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                                <div className="aspect-[16/10] bg-slate-200"></div>
                                <div className="p-6 space-y-3">
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : news.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4 opacity-20">📰</div>
                        <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">
                            No news available at the moment
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {news.map((item, index) => (
                            <motion.article
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-row md:flex-col h-auto md:h-full border border-slate-50"
                            >
                                {/* News Image */}
                                <Link
                                    to={`/news/${item.id}`}
                                    className="relative w-[120px] sm:w-[150px] md:w-full aspect-square md:aspect-[16/10] overflow-hidden bg-slate-100 shrink-0"
                                >
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <FiClock size={24} className="md:hidden" />
                                            <FiClock size={48} className="hidden md:block" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"></div>

                                    {/* News Badge */}
                                    <div className="absolute top-2 left-2 md:top-4 md:left-4">
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-blue-500 text-white text-[8px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                                            News
                                        </span>
                                    </div>
                                </Link>

                                {/* News Content */}
                                <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-center md:justify-start overflow-hidden">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-2 text-[8px] md:text-xs text-slate-400 mb-1 md:mb-3">
                                        <FiCalendar size={12} className="text-blue-500" />
                                        <span>{formatDate(item.created_at)}</span>
                                    </div>

                                    {/* Title */}
                                    <Link to={`/news/${item.id}`}>
                                        <h3 className="text-sm sm:text-base md:text-xl font-black text-slate-900 mb-1 md:mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                                            {item.title}
                                        </h3>
                                    </Link>

                                    {/* Excerpt - ONLY if explicitly provided */}
                                    {item.excerpt && (
                                        <p className="text-[10px] md:text-sm text-slate-500 mb-2 md:mb-4 line-clamp-2 flex-1 font-serif italic italic text-slate-400">
                                            {item.excerpt}
                                        </p>
                                    )}

                                    {/* Read More Link */}
                                    <Link
                                        to={`/news/${item.id}`}
                                        className="inline-flex items-center gap-2 text-[8px] md:text-sm text-blue-600 font-bold uppercase tracking-wider hover:gap-3 transition-all group"
                                    >
                                        Full Story
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
