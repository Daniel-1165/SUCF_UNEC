import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ArticlesSection = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) throw error;
            setArticles(data || []);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };



    if (!loading && articles.length === 0) return null;

    return (
        <section className="py-20 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full mb-4">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Featured Content</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            Latest <span className="text-emerald-600">Articles</span>
                        </h2>
                        <p className="text-slate-600 mt-2">Inspiring stories and faith-building insights</p>
                    </div>
                    <Link
                        to="/articles"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/30 group"
                    >
                        View All Articles
                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Articles Grid */}
                {loading ? (
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
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
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {articles.map((article, index) => (
                            <motion.article
                                key={article.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
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

                                    {/* Category Badge - Hidden on very small mobile for space */}
                                    <div className="absolute top-2 left-2 md:top-4 md:left-4">
                                        <span className="px-2 py-0.5 md:px-3 md:py-1 bg-emerald-500 text-white text-[8px] md:text-xs font-bold uppercase tracking-wider rounded-full">
                                            {article.category || 'Article'}
                                        </span>
                                    </div>
                                </Link>

                                {/* Article Content */}
                                <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-center md:justify-start overflow-hidden">
                                    {/* Meta Info */}
                                    <div className="flex items-center gap-4 text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-1 md:mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <FiCalendar size={10} className="text-emerald-500" />
                                            <span>{formatDate(article.created_at)}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <Link to={`/articles/${article.id}`}>
                                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 mb-1 md:mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight tracking-tight">
                                            {article.title}
                                        </h3>
                                    </Link>

                                    {/* Excerpt - ONLY show if explicitly exists */}
                                    {article.excerpt && (
                                        <p className="text-[10px] md:text-[13px] leading-relaxed text-slate-500 mb-2 md:mb-4 line-clamp-2 flex-1 font-serif italic text-slate-400">
                                            {article.excerpt}
                                        </p>
                                    )}

                                    {/* Read More Link */}
                                    <Link
                                        to={`/articles/${article.id}`}
                                        className="inline-flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 hover:gap-3 transition-all group"
                                    >
                                        Full Story
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ArticlesSection;
