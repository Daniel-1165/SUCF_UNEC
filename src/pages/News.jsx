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
    const itemsPerPage = 8;

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
        <div className="pt-32 pb-20 min-h-screen bg-[#F0F7F4] selection:bg-emerald-600 selection:text-white">
            <SEO
                title="Latest News & Updates"
                description="Stay informed with the latest updates, announcements, and events from SUCF UNEC."
            />
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="text-center mb-16 md:mb-24 max-w-3xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-900 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Fresh Updates
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-slate-900 leading-none uppercase italic">
                        Latest <span className="text-emerald-600">News.</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
                        Stay up to date with everything happening in the Unique Fellowship.
                    </p>
                </header>

                {/* Search and Filter Section */}
                <div className="mb-12 space-y-6">
                    <div className="relative max-w-2xl mx-auto">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-emerald-600/40" />
                        <input
                            type="text"
                            placeholder="Search news updates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white border-2 border-slate-100 focus:border-emerald-600 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${selectedCategory === category
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedNews.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-50 group transition-all hover:translate-y-[-8px]"
                        >
                            <Link to={`/news/${item.id}`} className="block h-full flex flex-col">
                                <div className="aspect-video overflow-hidden relative">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <FiFileText className="text-4xl text-slate-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        {item.category || 'Update'}
                                    </div>
                                </div>

                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><FiCalendar /> {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 break-normal">
                                        {item.title}
                                    </h3>

                                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                                        {item.content?.replace(/<[^>]*>/g, '')}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                            Read More <FiArrowRight />
                                        </span>
                                        {user?.isAdmin && (
                                            <button
                                                onClick={(e) => handleDelete(e, item.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 flex items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-50 hover:text-emerald-600 hover:border-emerald-600 transition-all shadow-sm"
                        >
                            <FiArrowRight className="rotate-180" />
                        </button>

                        <div className="flex gap-2">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`w-12 h-12 rounded-2xl font-bold transition-all ${currentPage === i + 1 ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-white text-slate-400 border border-slate-200 hover:border-emerald-600'}`}
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
                            className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-400 disabled:opacity-50 hover:text-emerald-600 hover:border-emerald-600 transition-all shadow-sm"
                        >
                            <FiArrowRight />
                        </button>
                    </div>
                )}

                {filteredNews.length === 0 && (
                    <div className="text-center py-24">
                        <FiFileText className="text-6xl text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No News Updates Found</h3>
                        <p className="text-slate-500">Check back later for fresh updates.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
