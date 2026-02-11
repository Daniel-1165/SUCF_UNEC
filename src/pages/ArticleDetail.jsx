import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiShare2, FiTag, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import '../styles/quill-content.css';

const ArticleDetail = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [otherNews, setOtherNews] = useState([]);
    const [isNews, setIsNews] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                // Try fetching from articles first
                let { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    // Try fetching from news table
                    const { data: newsData, error: newsError } = await supabase
                        .from('news')
                        .select('*')
                        .eq('id', id)
                        .single();

                    if (newsData) {
                        data = newsData;
                        setIsNews(true);
                    } else {
                        throw newsError || new Error("Not found");
                    }
                }

                setItem(data);

                // Fetch other news/articles for "More News" section
                const targetTable = isNews ? 'news' : 'articles';
                const { data: moreData } = await supabase
                    .from(targetTable)
                    .select('*')
                    .neq('id', id)
                    .order('created_at', { ascending: false })
                    .limit(4);

                setOtherNews(moreData || []);

            } catch (error) {
                console.error("Error fetching content:", error.message);
                setItem(null);
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
        window.scrollTo(0, 0);
    }, [id, isNews]);

    if (loading) {
        return (
            <div className="pt-40 pb-20 min-h-screen bg-white text-center text-black flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-[1px] border-black/20 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="text-black font-medium tracking-[0.2em] text-[10px] uppercase">Loading Content...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="pt-40 pb-20 min-h-screen bg-white text-center text-black flex flex-col items-center justify-center font-serif">
                <h1 className="text-4xl font-black italic uppercase mb-8">Content Not Found</h1>
                <Link to="/" className="px-10 py-4 bg-black text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 md:pt-32 pb-20 min-h-screen bg-white selection:bg-black selection:text-white">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Minimalist Editorial Navigation */}
                <div className="flex justify-between items-center mb-16 py-4 border-y border-black/5">
                    <Link
                        to={isNews ? "/news" : "/articles"}
                        className="inline-flex items-center gap-2 text-black hover:text-emerald-600 transition-all font-bold text-[9px] uppercase tracking-[0.2em] group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> {isNews ? "Archive" : "Editorial"}
                    </Link>
                    <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest opacity-40">
                        <span>{new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    {/* Header Section - Inspired by Shanghai Editorial */}
                    <header className="text-center mb-16 w-full max-w-3xl">
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-emerald-600 mb-6 block"
                        >
                            {item.category || (isNews ? 'Fellowship News' : 'Spiritual Insight')}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-serif text-black leading-[1.1] mb-8 tracking-tight font-light"
                        >
                            {item.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col items-center gap-4 mt-10"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                <FiUser size={18} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Article By: <span className="text-black">{item.author_name || 'SUCF UNEC Admin'}</span></span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">— {new Date(item.created_at).getFullYear()} —</span>
                        </motion.div>
                    </header>

                    {/* Featured Image - No more grayscale, cleaner fit */}
                    {item.image_url && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full relative overflow-hidden bg-slate-50 mb-20 shadow-2xl rounded-sm"
                        >
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="w-full h-auto object-cover"
                            />
                        </motion.div>
                    )}

                    {/* Main Content Area */}
                    <article className="w-full max-w-2xl">
                        {/* Rich Content - Enhanced Serif Typography */}
                        <style>{`
                            .article-content {
                                font-family: 'Playfair Display', serif;
                            }
                            .article-content p {
                                font-family: 'Playfair Display', serif;
                                font-size: 1.15rem;
                                line-height: 1.8;
                                color: #1a1a1a;
                                margin-bottom: 2rem;
                                text-align: justify;
                            }
                            .article-content h2, .article-content h3 {
                                font-family: 'Playfair Display', serif;
                                font-weight: 700;
                                font-style: italic;
                                color: #000;
                                margin-top: 3rem;
                                margin-bottom: 1.5rem;
                            }
                            .article-content blockquote {
                                font-family: 'Playfair Display', serif;
                                border-left: 1px solid #000;
                                padding-left: 2rem;
                                font-style: italic;
                                font-size: 1.5rem;
                                margin: 3rem 0;
                                color: #444;
                            }
                            @media (max-width: 768px) {
                                .article-content p {
                                    font-size: 1.05rem;
                                    text-align: left;
                                }
                            }
                        `}</style>
                        <div
                            className="article-content prose prose-lg max-w-none text-slate-900 leading-relaxed break-words"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />

                        {/* Share & Tags Section */}
                        <div className="mt-24 pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-10">
                            <div className="flex flex-wrap gap-3">
                                {(item.tags || []).length > 0 ? (item.tags.map(tag => (
                                    <span key={tag} className="px-4 py-1.5 bg-slate-50 text-[9px] font-bold uppercase tracking-widest text-slate-500 rounded-full border border-slate-100">
                                        #{tag}
                                    </span>
                                ))) : (
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-300 italic">No Tags</span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied!");
                                }}
                                className="flex items-center gap-3 px-8 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all rounded-full shadow-lg shadow-black/10"
                            >
                                <FiShare2 /> Share Editorial
                            </button>
                        </div>
                    </article>

                    {/* Bottom More Stories Strip */}
                    <div className="mt-32 w-full border-t border-black/5 pt-16">
                        <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] mb-12 text-center text-slate-400 italic">Continue Reading</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
                            {otherNews.map((news) => (
                                <Link to={isNews ? `/news/${news.id}` : `/articles/${news.id}`} key={news.id} className="group block">
                                    <div className="flex gap-6 items-start">
                                        {news.image_url && (
                                            <div className="w-20 h-20 shrink-0 bg-slate-50 overflow-hidden rounded-sm group-hover:scale-105 transition-all duration-700 font-serif font-black italic uppercase italic">
                                                <img src={news.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[8px] font-bold text-emerald-600 uppercase tracking-widest mb-2">{news.category || 'More Reading'}</span>
                                            <h4 className="text-[14px] font-serif italic font-bold leading-[1.4] group-hover:text-emerald-600 transition-colors">
                                                {news.title}
                                            </h4>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
