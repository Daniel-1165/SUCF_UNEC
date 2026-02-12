import React, { useState, useEffect } from 'react';
import { FiClock, FiUser, FiArrowRight, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
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
    const itemsPerPage = 10;

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
    const allArticles = dbArticles;
    const filteredArticles = allArticles.filter(article => {
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
        <div className="pt-24 md:pt-32 pb-20 min-h-screen bg-white selection:bg-emerald-500/30 selection:text-emerald-900">
            <SEO
                title="Edifying Reads"
                description="Explore deep spiritual insights, testimonies, and academic exhortations from the SUCF UNEC community."
            />
            <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                <header className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-900 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Wisdom & Revelation
                    </motion.div>
                    <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 tracking-tighter text-[#00211F] leading-none uppercase italic">
                        Edifying <span className="text-emerald-600">Reads.</span>
                    </h1>
                    <p className="text-[#00211F] opacity-40 text-base md:text-xl font-medium leading-relaxed">
                        Articles, Testimonies, and Words of Exhortation to build your spirit.
                    </p>
                </header>

                {/* Search and Filter Section */}
                <div className="mb-10 md:mb-12 space-y-4 md:space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <FiSearch className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 text-lg md:text-2xl text-emerald-600/40" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 md:pl-16 pr-4 md:pr-6 py-3 md:py-5 rounded-full md:rounded-[2rem] bg-white border-2 border-gray-200 focus:border-emerald-600 outline-none transition-all text-[#00211F] font-medium placeholder:text-gray-400 text-sm md:text-base"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                        <FiFilter className="text-emerald-600/60 hidden md:block" />
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-[10px] md:text-xs uppercase tracking-wider transition-all ${selectedCategory === category
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <p className="text-center text-xs md:text-sm font-medium text-gray-500">
                        Showing <span className="font-black text-emerald-600">{filteredArticles.length}</span> {filteredArticles.length === 1 ? 'article' : 'articles'}
                    </p>
                </div>

                <div className="space-y-6 md:space-y-8">
                    {paginatedArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="relative group"
                        >
                            {user?.isAdmin && !article.id.toString().startsWith('s') && (
                                <button
                                    onClick={(e) => handleDelete(e, article.id)}
                                    className="absolute top-3 right-3 md:top-4 md:right-4 z-20 p-2 md:p-3 bg-red-600/90 backdrop-blur-md text-white rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110"
                                >
                                    <FiTrash2 size={14} className="md:w-4 md:h-4" />
                                </button>
                            )}
                            <Link
                                to={`/articles/${article.id}`}
                                className="block bg-white rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 border-b border-gray-100 pb-6"
                            >
                                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                                    {/* Image - Reasonable Size */}
                                    <div className="w-full md:w-1/3 aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-gray-100 shrink-0 relative">
                                        <img
                                            src={article.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop'}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-200">
                                            <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">{article.category || 'Word'}</span>
                                        </div>
                                    </div>

                                    {/* Content - Forbes Style */}
                                    <div className="flex-1 pr-6 md:pr-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                            <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>{article.author_name || 'Admin'}</span>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors leading-[1.3] tracking-tight">
                                            {article.title}
                                        </h2>

                                        {article.excerpt && (
                                            <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 line-clamp-2 font-serif antialiased">
                                                {article.excerpt}
                                            </p>
                                        )}

                                        <div className="mt-auto flex items-center gap-2 text-emerald-700 font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                                            Read Article <FiArrowRight />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Ultra-Sleek Pagination */}
                {totalPages > 1 && (
                    <div className="mt-16 md:mt-24 flex items-center justify-center gap-8 md:gap-12">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="group flex items-center gap-2 md:gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 disabled:opacity-0 transition-all hover:text-emerald-600"
                        >
                            <FiArrowRight className="rotate-180 text-lg md:text-xl group-hover:-translate-x-2 transition-transform" />
                            <span className="hidden md:inline">Prev</span>
                        </button>

                        <div className="flex gap-2 md:gap-3">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`h-1 rounded-full transition-all duration-700 ${currentPage === i + 1 ? 'w-8 md:w-12 bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'w-2 md:w-3 bg-slate-200 hover:bg-emerald-200'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="group flex items-center gap-2 md:gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 disabled:opacity-0 transition-all hover:text-emerald-600"
                        >
                            <span className="hidden md:inline">Next</span>
                            <FiArrowRight className="text-lg md:text-xl group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {/* No Results Message */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiSearch className="text-3xl md:text-4xl text-emerald-600/40" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-[#00211F] mb-3">No Articles Found</h3>
                        <p className="text-gray-500 font-medium text-sm md:text-base">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
