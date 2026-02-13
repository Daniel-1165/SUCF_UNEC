import React, { useState, useEffect } from 'react';
import { FiClock, FiArrowRight, FiTrash2, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const Articles = () => {
    const { user } = useAuth();
    const [dbArticles, setDbArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const categories = ['All', 'Spiritual Growth', 'Academic', 'Prayer', 'Testimony'];

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDbArticles(data || []);
        } catch (error) {
            console.error("Error fetching articles:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this article?")) return;

        try {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (error) throw error;
            setDbArticles(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    // Filter and search logic
    const filteredArticles = dbArticles.filter(article => {
        const matchesSearch = (article.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (article.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (article.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const paginatedArticles = filteredArticles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white">
            <SEO
                title="Articles"
                description="Deep spiritual insights and academic exhortations from SUCF UNEC."
            />

            <div className="container mx-auto px-6 md:px-12 max-w-screen-xl">
                {/* Header Section */}
                <header className="mb-20 border-b border-black pb-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
                                EDITORIAL.
                            </h1>
                            <p className="text-lg md:text-xl font-medium text-slate-500 max-w-md leading-relaxed">
                                — Curated writings on spiritual growth, academics, and life.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-6">
                            {/* Simple Search */}
                            <div className="relative w-full md:w-64">
                                <FiSearch className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search archive..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-6 pr-0 py-2 border-b border-slate-200 focus:border-black outline-none bg-transparent placeholder:text-slate-300 transition-colors"
                                />
                            </div>

                            {/* Categories */}
                            <div className="flex flex-wrap justify-end gap-x-6 gap-y-2 text-sm font-bold uppercase tracking-widest">
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
                    </div>
                </header>

                {/* Article Grid - Clean & Minimal */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
                    {paginatedArticles.map((article, index) => {
                        // First article layout prominence (on first page)
                        const isFeatured = index === 0 && currentPage === 1;
                        const colSpan = isFeatured ? 'lg:col-span-2' : '';

                        return (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className={`group ${colSpan} flex flex-col`}
                            >
                                <Link to={`/articles/${article.id}`} className="block h-full cursor-pointer">
                                    <div className="relative overflow-hidden bg-slate-50 mb-6 aspect-[4/3]">
                                        {article.image_url ? (
                                            <img
                                                src={article.image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100/50 text-slate-200">
                                                <span className="font-heading font-black text-6xl opacity-10">SUCF</span>
                                            </div>
                                        )}

                                        {/* Minimal Tag */}
                                        <div className="absolute top-0 left-0 bg-white px-4 py-2 border-r border-b border-slate-100">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
                                                {article.category || 'Read'}
                                            </span>
                                        </div>

                                        {user?.isAdmin && (
                                            <button
                                                onClick={(e) => handleDelete(e, article.id)}
                                                className="absolute top-4 right-4 bg-white/90 p-2 text-black hover:text-red-600 transition-colors rounded-full z-20"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        )}
                                    </div>

                                    <div className="pr-4">
                                        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                                            <span className="text-emerald-600">—</span>
                                            <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                        </div>

                                        <h2 className={`font-bold leading-[1.1] mb-3 group-hover:underline decoration-2 underline-offset-4 ${isFeatured ? 'text-3xl md:text-5xl' : 'text-xl md:text-2xl'}`}>
                                            {article.title}
                                        </h2>

                                        <p className="text-slate-500 leading-relaxed line-clamp-3 text-sm md:text-base">
                                            {article.excerpt}
                                        </p>
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

export default Articles;
