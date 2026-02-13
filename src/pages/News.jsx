import React, { useState, useEffect } from 'react';
import { FiClock, FiArrowRight, FiTrash2, FiSearch } from 'react-icons/fi';
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
    const itemsPerPage = 8; // Even number for grid balance

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
        <div className="pt-32 pb-20 min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white">
            <SEO
                title="News & Updates"
                description="Announcements, events, and latest updates from SUCF UNEC."
            />

            <div className="container mx-auto px-6 md:px-12 max-w-screen-xl">
                {/* Minimalist Header */}
                <header className="mb-20 border-b border-black pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
                                NEWS.
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-slate-500 max-w-md leading-relaxed">
                                — Facilitating communication and creating opportunities for fellowship.
                            </p>
                        </div>

                        {/* Categories as simple links */}
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-widest">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`transition-colors hover:text-emerald-600 ${selectedCategory === category ? 'text-emerald-600 underline underline-offset-4' : 'text-slate-400'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Content Grid - Asymmetrical / Magazine Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-12 gap-y-20">
                    {paginatedNews.map((item, index) => {
                        // Layout logic: First item spans full width (hero), others are grid
                        const isHero = index === 0 && currentPage === 1;
                        const colSpan = isHero ? 'lg:col-span-12' : 'lg:col-span-6';

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`group ${colSpan} flex flex-col`}
                            >
                                <Link to={`/news/${item.id}`} className="block h-full">
                                    {/* Image Container */}
                                    <div className={`relative overflow-hidden bg-slate-100 mb-6 ${isHero ? 'aspect-[21/9]' : 'aspect-[4/3]'}`}>
                                        {item.image_url ? (
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                                <span className="font-black text-4xl opacity-20">IMAGE</span>
                                            </div>
                                        )}

                                        {/* Tag */}
                                        <div className="absolute top-0 left-0 bg-white px-4 py-2">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                                                {item.category || 'Update'}
                                            </span>
                                        </div>

                                        {user?.isAdmin && (
                                            <button
                                                onClick={(e) => handleDelete(e, item.id)}
                                                className="absolute top-4 right-4 bg-white/90 p-2 text-black hover:text-red-600 transition-colors rounded-full z-20"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex flex-col gap-3 pr-4 md:pr-12">
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                                            <FiClock className="text-emerald-600" />
                                            <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                        </div>

                                        <h2 className={`font-bold leading-tight group-hover:underline decoration-2 underline-offset-4 ${isHero ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                                            {item.title}
                                        </h2>

                                        <p className="text-slate-600 leading-relaxed line-clamp-3 md:line-clamp-4 text-base md:text-lg">
                                            {item.content?.replace(/<[^>]*>/g, '')}
                                        </p>

                                        <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black group-hover:gap-4 transition-all">
                                            Read Full Story <FiArrowRight />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Minimalist Pagination */}
                {totalPages > 1 && (
                    <div className="mt-32 border-t border-black pt-8 flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex gap-8">
                            <button
                                onClick={() => {
                                    setCurrentPage(p => Math.max(1, p - 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === 1}
                                className="text-sm font-black uppercase tracking-widest hover:text-emerald-600 disabled:opacity-20 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentPage(p => Math.min(totalPages, p + 1));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                disabled={currentPage === totalPages}
                                className="text-sm font-black uppercase tracking-widest hover:text-emerald-600 disabled:opacity-20 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
