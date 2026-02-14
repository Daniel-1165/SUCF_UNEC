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

    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        const strippedText = text.replace(/<[^>]*>/g, '');
        return strippedText.length > maxLength
            ? strippedText.substring(0, maxLength) + '...'
            : strippedText;
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
                                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                            >
                                {/* Article Image */}
                                <Link to={`/articles/${article.id}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                    {article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <FiUser size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {/* Category Badge */}
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                                            {article.category || 'Article'}
                                        </span>
                                    </div>
                                </Link>

                                {/* Article Content */}
                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                                        <div className="flex items-center gap-1">
                                            <FiCalendar size={12} />
                                            <span>{formatDate(article.created_at)}</span>
                                        </div>
                                        {article.author && (
                                            <div className="flex items-center gap-1">
                                                <FiUser size={12} />
                                                <span>{article.author}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <Link to={`/articles/${article.id}`}>
                                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                    </Link>

                                    {/* Excerpt */}
                                    <p className="text-sm text-slate-600 mb-4 line-clamp-3 flex-1">
                                        {truncateText(article.content, 120)}
                                    </p>

                                    {/* Read More Link */}
                                    <Link
                                        to={`/articles/${article.id}`}
                                        className="inline-flex items-center gap-2 text-emerald-600 font-bold text-sm uppercase tracking-wider hover:gap-3 transition-all group"
                                    >
                                        Read More
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
