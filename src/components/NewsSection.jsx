import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowRight, FiCalendar, FiClock } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

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

    const currentNews = news.slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage);
    const totalPages = Math.ceil(news.length / itemsPerPage);

    if (!loading && news.length === 0) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-blue-600"></span>
                            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Updates</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter">
                            Latest <span className="italic font-serif text-blue-100/100" style={{ WebkitTextStroke: '1px #2563eb', color: 'transparent' }}>Fellowship</span> News
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                                    disabled={currentPage === 0}
                                    className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all group"
                                >
                                    <FiArrowRight className="rotate-180 group-active:scale-90" />
                                </button>
                                <div className="h-4 w-[1px] bg-slate-200"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                                    {currentPage + 1} <span className="opacity-30">/</span> {totalPages}
                                </span>
                                <div className="h-4 w-[1px] bg-slate-200"></div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={currentPage === totalPages - 1}
                                    className="p-3 rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all group"
                                >
                                    <FiArrowRight className="group-active:scale-90" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* News content grid */}
                <div className="grid lg:grid-cols-12 gap-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="lg:col-span-12 grid lg:grid-cols-12 gap-12"
                        >
                            {/* Hero News (Overlay Style) - Only for 1st item on 1st page */}
                            {currentPage === 0 ? (
                                <>
                                    <div className="lg:col-span-7">
                                        <Link to={`/news/${currentNews[0]?.id}`} className="group relative block aspect-[16/10] md:aspect-auto md:h-[500px] rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-2xl shadow-blue-900/10 transition-all duration-700 hover:-translate-y-2">
                                            {currentNews[0]?.image_url ? (
                                                <img
                                                    src={currentNews[0].image_url}
                                                    alt={currentNews[0].title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                                                    <FiClock size={80} />
                                                </div>
                                            )}

                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

                                            {/* Overlay Text Content */}
                                            <div className="absolute inset-x-0 bottom-0 p-8 md:p-12">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Top News</span>
                                                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{formatDate(currentNews[0]?.created_at)}</span>
                                                </div>
                                                <h3 className="text-2xl md:text-4xl font-black text-white mb-4 line-clamp-3 leading-[1.1] tracking-tight group-hover:text-blue-400 transition-colors">
                                                    {currentNews[0]?.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                                                    Read Full Story <FiArrowRight />
                                                </div>
                                            </div>
                                        </Link>
                                    </div>

                                    {/* Small List Items (Timeline Style) */}
                                    <div className="lg:col-span-5 flex flex-col justify-center space-y-12">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-lg shadow-red-600/40"></div>
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Latest Feed</h4>
                                        </div>
                                        <div className="relative pl-8 space-y-12 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100">
                                            {currentNews.slice(1).map((item) => (
                                                <Link key={item.id} to={`/news/${item.id}`} className="group relative block">
                                                    {/* Dot indicator */}
                                                    <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-slate-200 group-hover:bg-blue-600 group-hover:scale-125 transition-all"></div>

                                                    <div className="flex gap-6">
                                                        <div className="flex-1">
                                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 block">{formatDate(item.created_at)}</span>
                                                            <h5 className="text-lg font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors tracking-tight">
                                                                {item.title}
                                                            </h5>
                                                        </div>
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 shrink-0 shadow-sm">
                                                            {item.image_url && <img src={item.image_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />}
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}

                                            {/* History Link */}
                                            <Link to="/news" className="inline-flex items-center gap-3 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all group">
                                                See Full History <FiArrowRight className="group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Standard List for other pages */
                                <div className="lg:col-span-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {currentNews.map((item) => (
                                        <Link key={item.id} to={`/news/${item.id}`} className="group bg-slate-50 p-6 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500">
                                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-6 bg-slate-200">
                                                {item.image_url && <img src={item.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                                            </div>
                                            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 block">{formatDate(item.created_at)}</span>
                                            <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                                Full Update <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
