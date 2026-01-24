import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiShare2, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';


const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            // Fetch from Supabase
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setArticle(data);
            } catch (error) {
                console.error("Error fetching article:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="pt-40 pb-20 min-h-screen bg-black text-center text-white flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Loading Revelation...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="pt-40 pb-20 min-h-screen bg-black text-center text-white flex flex-col items-center justify-center">
                <h1 className="text-4xl font-serif font-black italic uppercase mb-8">Article Not Found</h1>
                <Link to="/articles" className="px-10 py-4 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                    Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-40 pb-20 min-h-screen zeni-mesh-gradient selection:bg-emerald-600 selection:text-white">
            <div className="container mx-auto px-6 max-w-5xl">
                <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-900 transition-all mb-12 font-black text-[10px] uppercase tracking-[0.2em] group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Back to Articles
                </Link>

                <article className="relative">
                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="aspect-video w-full relative zeni-card !p-0 overflow-hidden border-2 border-white mb-16 shadow-2xl"
                    >
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover object-center transition-all duration-1000"
                        />
                        <div className="absolute top-10 left-10">
                            <span className="bg-emerald-600 text-white px-6 py-2 rounded-full text-[9px] font-black shadow-lg uppercase tracking-[0.2em]">
                                {article.category}
                            </span>
                        </div>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {/* Meta Header */}
                        <div className="flex flex-wrap items-center gap-8 mb-12 pb-12 border-b border-[#F5F9F7]">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <FiUser size={24} />
                                </div>
                                <div>
                                    <p className="text-[#00211F] opacity-30 text-[9px] uppercase font-black tracking-widest mb-1">Author</p>
                                    <p className="text-[#00211F] font-black italic text-lg leading-none">{article.author_name || 'Admin'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                    <FiClock size={24} />
                                </div>
                                <div>
                                    <p className="text-[#00211F] opacity-30 text-[9px] uppercase font-black tracking-widest mb-1">Published</p>
                                    <p className="text-[#00211F] font-black italic text-lg leading-none">
                                        {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-7xl font-black text-[#00211F] italic uppercase leading-none mb-16 tracking-tighter"
                        >
                            {article.title}
                        </motion.h1>

                        <div
                            className="prose prose-lg max-w-none text-[#00211F] opacity-60 leading-relaxed font-medium"
                            style={{
                                '--tw-prose-headings': '#00211F',
                                '--tw-prose-links': '#10b981',
                                '--tw-prose-bold': '#00211F',
                                '--tw-prose-quotes': '#10b981',
                            }}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tags */}
                        {article.tags && (
                            <div className="mt-20 pt-12 border-t border-[#F5F9F7] flex flex-wrap gap-3">
                                {article.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                                        <FiTag /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </article>

                {/* Footer Action */}
                <div className="mt-24 zeni-card p-12 bg-white flex flex-col md:flex-row justify-between items-center gap-8 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h4 className="text-[#00211F] text-2xl font-black italic uppercase mb-2">Share this word</h4>
                        <p className="text-[#00211F] opacity-40 font-medium italic">Help a brother or sister find their way today.</p>
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Link copied!");
                        }}
                        className="px-12 py-5 bg-[#00211F] text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all whitespace-nowrap"
                    >
                        Copy Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
