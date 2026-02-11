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
        <div className="pt-32 pb-20 min-h-screen bg-[#F0F7F4] transition-colors duration-700 selection:bg-emerald-500/30 selection:text-emerald-900">
            <SEO
                title="Edifying Reads"
                description="Explore deep spiritual insights, testimonies, and academic exhortations from the SUCF UNEC community."
            />
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="text-center mb-16 md:mb-24 max-w-3xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-900 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Wisdom & Revelation
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-[#00211F] leading-none uppercase italic">
                        Edifying <span className="text-emerald-600">Reads.</span>
                    </h1>
                    <p className="text-[#00211F] opacity-40 text-lg md:text-xl font-medium leading-relaxed">
                        Articles, Testimonies, and Words of Exhortation to build your spirit.
                    </p>
                </header>

                {/* Search and Filter Section */}
                <div className="mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-emerald-600/40" />
                        <input
                            type="text"
                            placeholder="Search articles by title or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white border-2 border-gray-200 focus:border-emerald-600 outline-none transition-all text-[#00211F] font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <FiFilter className="text-emerald-600/60" />
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${selectedCategory === category
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <p className="text-center text-sm font-medium text-gray-500">
                        Showing <span className="font-black text-emerald-600">{filteredArticles.length}</span> {filteredArticles.length === 1 ? 'article' : 'articles'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                    {paginatedArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group"
                        >
                            {user?.isAdmin && !article.id.toString().startsWith('s') && (
                                <button
                                    onClick={(e) => handleDelete(e, article.id)}
                                    className="absolute top-6 right-6 z-20 p-3 bg-red-600/90 backdrop-blur-md text-white rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            )}
                            <Link
                                to={`/articles/${article.id}`}
                                className="zeni-card flex flex-row h-full group hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-700 overflow-hidden bg-white border-[#E8F3EF]"
                            >
                                <div className="w-1/3 md:w-1/3 overflow-hidden relative shrink-0">
                                    <img
                                        src={article.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-2 left-2 md:top-6 md:left-6 bg-emerald-500/90 backdrop-blur-md px-2 py-0.5 md:px-4 md:py-1.5 rounded-full text-[7px] md:text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                                        {article.category || 'Word'}
                                    </div>
                                </div>

                                <div className="p-4 md:p-10 flex-grow flex flex-col justify-center overflow-hidden">
                                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-[7px] md:text-[9px] font-black text-emerald-600 mb-2 md:mb-6 uppercase tracking-widest opacity-60">
                                        <span className="flex items-center gap-1 md:gap-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-emerald-50 rounded-md md:rounded-lg"><FiUser /> {article.author_name || 'Admin'}</span>
                                        <span className="flex items-center gap-1 md:gap-2 px-1.5 py-0.5 md:px-2 md:py-1 bg-emerald-50 rounded-md md:rounded-lg"><FiClock /> {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>

                                    <h2 className="text-sm md:text-2xl lg:text-4xl font-black text-[#00211F] mb-1 md:mb-4 group-hover:text-emerald-600 transition-colors leading-tight italic uppercase tracking-tight line-clamp-2 md:line-clamp-none break-words">
                                        {article.title}
                                    </h2>

                                    {article.excerpt && (
                                        <p className="hidden sm:block text-[#00211F] opacity-40 text-[10px] md:text-sm mb-3 md:mb-8 line-clamp-2 leading-relaxed font-medium">
                                            {article.excerpt}
                                        </p>
                                    )}

                                    <div className="mt-auto pt-2 md:pt-6 border-t border-[#F5F9F7] flex items-center gap-2 md:gap-3 text-emerald-700 font-black text-[7px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] group-hover:gap-5 transition-all">
                                        Read Deeply <FiArrowRight className="text-sm md:text-lg" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Ultra-Sleek Pagination */}
                {totalPages > 1 && (
                    <div className="mt-24 flex items-center justify-center gap-12">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 disabled:opacity-0 transition-all hover:text-emerald-600"
                        >
                            <FiArrowRight className="rotate-180 text-xl group-hover:-translate-x-2 transition-transform" />
                            Prev
                        </button>

                        <div className="flex gap-3">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentPage(i + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className={`h-1 rounded-full transition-all duration-700 ${currentPage === i + 1 ? 'w-12 bg-emerald-600 shadow-lg shadow-emerald-500/20' : 'w-3 bg-slate-200 hover:bg-emerald-200'}`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 disabled:opacity-0 transition-all hover:text-emerald-600"
                        >
                            Next
                            <FiArrowRight className="text-xl group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                )}

                {/* No Results Message */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiSearch className="text-4xl text-emerald-600/40" />
                        </div>
                        <h3 className="text-2xl font-black text-[#00211F] mb-3">No Articles Found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
