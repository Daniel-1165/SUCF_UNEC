import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowRight, FiClock, FiUser, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

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
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['All', 'Faith', 'Campus Life', 'Testimonies', 'Events', 'Other'];

    const filteredArticles = selectedCategory === 'All'
        ? articles
        : articles.filter(article => article.category === selectedCategory);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-32 pb-20">
            <SEO
                title="Articles - SUCF UNEC"
                description="Read inspiring articles, testimonies, and faith-based content from the SUCF UNEC community."
            />

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-6"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Articles & Insights</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 mb-4"
                    >
                        Inspiring <span className="text-emerald-600">Articles</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-600 max-w-2xl mx-auto"
                    >
                        Explore faith-building content, testimonies, and insights from our community
                    </motion.p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${selectedCategory === category
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Articles Grid */}
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
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4 opacity-20">📝</div>
                        <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">
                            No articles found in this category
                        </p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article, index) => (
                            <motion.article
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-row md:flex-col h-auto md:h-full border border-slate-50"
                            >
                                {/* Article Image */}
                                <Link
                                    to={`/articles/${article.id}`}
                                    className="relative w-[120px] sm:w-[150px] md:w-full aspect-square md:aspect-[16/10] overflow-hidden bg-slate-100 shrink-0"
                                >
                                    {article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <FiUser size={24} className="md:hidden" />
                                            <FiUser size={48} className="hidden md:block" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2 md:top-4 md:left-4">
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-500 text-white text-[8px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                                            {article.category || 'Article'}
                                        </span>
                                    </div>
                                </Link>

                                {/* Article Content */}
                                <div className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col justify-center md:justify-start overflow-hidden">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-[8px] md:text-xs text-slate-400 mb-1 md:mb-3">
                                        <div className="flex items-center gap-1.5">
                                            <FiCalendar size={12} className="text-emerald-500" />
                                            <span>{formatDate(article.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <Link to={`/articles/${article.id}`}>
                                        <h3 className="text-sm sm:text-base md:text-xl font-black text-slate-900 mb-1 md:mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                                            {article.title}
                                        </h3>
                                    </Link>

                                    {/* Excerpt - ONLY if explicitly provided */}
                                    {article.excerpt && (
                                        <p className="text-[10px] md:text-sm text-slate-500 mb-2 md:mb-4 line-clamp-2 flex-1 font-serif italic italic text-slate-400">
                                            {article.excerpt}
                                        </p>
                                    )}

                                    {/* Read More Link */}
                                    <Link
                                        to={`/articles/${article.id}`}
                                        className="inline-flex items-center gap-2 text-[8px] md:text-sm text-emerald-600 font-bold uppercase tracking-wider hover:gap-3 transition-all group"
                                    >
                                        Full Article
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

export default Articles;
