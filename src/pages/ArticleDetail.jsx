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
        <div className="pt-24 md:pt-32 pb-20 min-h-screen bg-[#F0F7F4] selection:bg-black selection:text-white">
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
                    {/* Header Section - Modern Forbes Style */}
                    <header className="mb-8 w-full max-w-3xl">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                                {item.category || (isNews ? 'News' : 'Article')}
                            </span>
                            <span className="text-gray-300">|</span>
                            <span className="text-xs font-medium text-gray-500">
                                {new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>

                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.15] mb-6 tracking-tight font-sans"
                        >
                            {item.title}
                        </motion.h1>

                        <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                                <FiUser size={16} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">{item.author_name || 'SUCF UNEC Admin'}</span>
                                <span className="text-xs text-gray-500">Editorial Team</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image - Reasonable Size */}
                    {item.image_url && (
                        <div className="w-full max-w-4xl mb-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="relative overflow-hidden rounded-lg bg-gray-100 aspect-video md:aspect-[21/9] max-h-[500px]"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>
                            <p className="mt-3 text-xs text-gray-500 italic">
                                {item.title}
                            </p>
                        </div>
                    )}

                    {/* Main Content Area */}
                    <article className="w-full max-w-3xl">
                        <style>{`
                            .article-content {
                                font-family: 'Georgia', 'Merriweather', serif;
                                color: #2d2d2d;
                            }
                            .article-content p {
                                font-size: 1.125rem;
                                line-height: 1.8;
                                margin-bottom: 2rem;
                            }
                            .article-content h2 {
                                font-family: system-ui, -apple-system, sans-serif;
                                font-size: 1.8rem;
                                font-weight: 700;
                                color: #111;
                                margin-top: 3rem;
                                margin-bottom: 1rem;
                                line-height: 1.3;
                            }
                            .article-content h3 {
                                font-family: system-ui, -apple-system, sans-serif;
                                font-size: 1.4rem;
                                font-weight: 700;
                                color: #111;
                                margin-top: 2.5rem;
                                margin-bottom: 1rem;
                            }
                            .article-content blockquote {
                                border-left: 3px solid #059669;
                                padding-left: 1.5rem;
                                font-style: italic;
                                font-size: 1.25rem;
                                color: #4b5563;
                                margin: 2.5rem 0;
                            }
                            .article-content ul, .article-content ol {
                                margin-bottom: 2rem;
                                padding-left: 1.5rem;
                            }
                            .article-content li {
                                margin-bottom: 0.5rem;
                                font-size: 1.125rem;
                            }
                            @media (max-width: 768px) {
                                .article-content p {
                                    font-size: 1.05rem;
                                    line-height: 1.7;
                                }
                                .article-content h2 {
                                    font-size: 1.5rem;
                                }
                            }
                        `}</style>
                        <div
                            className="article-content"
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
