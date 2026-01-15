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
            className="zeni-card overflow-hidden flex flex-col group h-full bg-white border-[#E8F3EF] hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500"
        >
            <div className="relative aspect-[16/10] overflow-hidden">
                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-emerald-50 flex items-center justify-center">
                        <FiFileText className="text-5xl text-emerald-200" />
                    </div>
                )}
                <div className="absolute top-5 left-5">
                    <span className="px-4 py-1.5 bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {item.category || 'Latest'}
                    </span>
                </div>
            </div>

            <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-3 text-emerald-600/60 text-[10px] font-black uppercase tracking-widest mb-6">
                    <FiCalendar className="text-xs" />
                    <span>{formattedDate}</span>
                </div>
                <h3 className="text-2xl font-black text-[#00211F] mb-4 leading-tight group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                    {item.title}
                </h3>
                <p className="text-[#00211F] opacity-40 text-sm font-medium mb-10 line-clamp-3 leading-relaxed">
                    {item.content}
                </p>
                <div className="mt-auto pt-6 border-t border-[#F5F9F7]">
                    <button className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 flex items-center gap-3 group/btn hover:gap-5 transition-all">
                        Read Full Story <FiArrowRight className="text-lg" />
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
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${canGoPrev
                                        ? 'bg-white border border-gray-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    <FiChevronLeft className="text-xl" />
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                                : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-600 hover:text-emerald-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={!canGoNext}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${canGoNext
                                        ? 'bg-white border border-gray-200 hover:bg-emerald-600 hover:text-white hover:border-emerald-600'
                                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                        }`}
                                >
                                    <FiChevronRight className="text-xl" />
                                </button>
                            </div>
                        )}
                    </>
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
