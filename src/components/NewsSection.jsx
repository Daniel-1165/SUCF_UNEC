import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiCalendar, FiArrowRight, FiFileText, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NewsCard = ({ item, index }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="rounded-[2.5rem] overflow-hidden flex flex-col group h-full bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500"
        >
            <div className="relative aspect-[16/10] overflow-hidden border-b border-white/5">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                    />
                ) : (
                    <div className="w-full h-full bg-[#001a14] flex items-center justify-center">
                        <FiFileText className="text-5xl text-emerald-800" />
                    </div>
                )}
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#022c22] via-transparent to-transparent opacity-60" />

                <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-black/50 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                        {item.category || 'Latest'}
                    </span>
                </div>
            </div>

            <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-3 text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest mb-6">
                    <FiCalendar className="text-xs" />
                    <span>{formattedDate}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-emerald-400 transition-colors uppercase tracking-tight line-clamp-2">
                    {item.title}
                </h3>
                <p className="text-white/40 text-sm font-medium mb-10 line-clamp-3 leading-relaxed">
                    {item.content?.replace(/<[^>]*>/g, '')}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5">
                    <button className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 flex items-center gap-3 group/btn hover:text-white transition-all">
                        Read Full Story <FiArrowRight className="text-lg group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 3;

    useEffect(() => {
        fetchNews();
    }, [currentPage]);

    const fetchNews = async () => {
        setLoading(true);
        try {
            // Get total count
            const { count } = await supabase
                .from('news')
                .select('*', { count: 'exact', head: true });

            setTotalCount(count || 0);

            // Get paginated data
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false })
                .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

            if (error) throw error;
            setNews(data || []);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);
    const canGoPrev = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <section className="py-24 bg-slate-50 relative border-t border-slate-200">
            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="section-tag mb-6 !bg-white !border-slate-200 !text-slate-600">Updates</div>
                        <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-none tracking-tighter">
                            Fellowship <span className="text-emerald-600 italic">News.</span>
                        </h2>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5"></div>
                        ))}
                    </div>
                ) : news.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            {news.map((item, index) => (
                                <NewsCard key={item.id} item={item} index={index} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    disabled={!canGoPrev}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${canGoPrev
                                        ? 'bg-transparent border border-white/20 text-white hover:bg-emerald-600 hover:border-emerald-600'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    <FiChevronLeft className="text-xl" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${currentPage === page
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-110'
                                                : 'bg-transparent border border-white/20 text-white hover:border-emerald-600 hover:text-emerald-500'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={!canGoNext}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${canGoNext
                                        ? 'bg-transparent border border-white/20 text-white hover:bg-emerald-600 hover:border-emerald-600'
                                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    <FiChevronRight className="text-xl" />
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/10 border-dashed">
                        <FiFileText className="text-6xl text-white/20 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Updates Yet</h3>
                        <p className="text-white/40">Check back later for the latest news and announcements.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default NewsSection;
