import React, { useState, useEffect } from 'react';
import { FiClock, FiUser, FiArrowRight, FiTrash2, FiSearch, FiFilter, FiFileText, FiCalendar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';


const News = () => {
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const categories = ['All', 'Announcement', 'Event', 'Update', 'Featured'];

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
            console.error("Error fetching news:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this news update?")) return;

        try {
            const { error } = await supabase.from('news').delete().eq('id', id);
            if (error) throw error;
            setNews(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    // Filter and search logic
    const filteredNews = news.filter(item => {
        const matchesSearch = (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (item.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="pt-24 md:pt-32 pb-20 min-h-screen bg-white selection:bg-emerald-600 selection:text-white">
            <SEO
                title="Latest News & Updates"
                description="Stay informed with the latest updates, announcements, and events from SUCF UNEC."
            />
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <header className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-900 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Fresh Updates
                    </motion.div>
                    <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter text-slate-900 leading-none uppercase italic">
                        Latest <span className="text-emerald-600">News.</span>
                    </h1>
                    <p className="text-slate-500 text-base md:text-xl font-medium leading-relaxed">
                        Stay up to date with everything happening in the Unique Fellowship.
                    </p>
                </header>

                {/* Search and Filter Section */}
                <div className="mb-10 md:mb-12 space-y-4 md:space-y-6">
                    <div className="relative max-w-2xl mx-auto">
                        <FiSearch className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-lg md:text-2xl text-emerald-600/40" />
                        <input
                            type="text"
                            placeholder="Search news updates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-5 rounded-full md:rounded-[2rem] bg-white border-2 border-slate-100 focus:border-emerald-600 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-sm text-sm md:text-base"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-wider transition-all ${selectedCategory === category
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                    {paginatedNews.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-gray-100 hover:border-emerald-200 group transition-all hover:shadow-xl hover:shadow-emerald-900/5"
                        >
                            <Link to={`/news/${item.id}`} className="block h-full flex flex-col">
                                <div className="relative h-48 md:h-56 overflow-hidden bg-gray-100 shrink-0">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <FiFileText className="text-4xl text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                        <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">{item.category || 'Update'}</span>
                                    </div>
                                    {user?.isAdmin && (
                                        <button
                                            onClick={(e) => handleDelete(e, item.id)}
                                            className="absolute top-3 right-3 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    )}
                                </div>

                                <div className="p-5 md:p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                                        <FiCalendar className="text-emerald-600" />
                                        <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2">
                                        {item.title}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                                        {item.content?.replace(/<[^>]*>/g, '')}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-[10px] md:text-xs uppercase tracking-widest group-hover:translate-x-1 transition-all">
                                            Read More <FiArrowRight />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-3 md:gap-4">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-50 hover:text-emerald-600 hover:border-emerald-600 transition-all shadow-sm"
                        >
                            <FiArrowRight className="rotate-180 text-sm md:text-base" />
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl font-bold text-sm md:text-base transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-white text-slate-400 border border-slate-200 hover:border-emerald-600'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="p-3 md:p-4 rounded-xl md:rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-50 hover:text-emerald-600 hover:border-emerald-600 transition-all shadow-sm"
                        >
                            <FiArrowRight className="text-sm md:text-base" />
                        </button>
                    </div>
                )}

                {filteredNews.length === 0 && (
                    <div className="text-center py-20 md:py-24">
                        <FiFileText className="text-5xl md:text-6xl text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2">No News Updates Found</h3>
                        <p className="text-slate-500 text-sm md:text-base">Check back later for fresh updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
