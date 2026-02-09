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
            <div className="pt-40 pb-20 min-h-screen bg-[#F0F0F0] text-center text-black flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-black font-black uppercase tracking-[0.2em] text-xs">Loading Content...</p>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="pt-40 pb-20 min-h-screen bg-[#F0F0F0] text-center text-black flex flex-col items-center justify-center">
                <h1 className="text-4xl font-serif font-black italic uppercase mb-8">Content Not Found</h1>
                <Link to="/" className="px-10 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#F0F0F0] selection:bg-black selection:text-white">
            <div className="container mx-auto px-6 max-w-6xl">
                {/* Minimalist Navigation */}
                <div className="flex justify-between items-center mb-12 py-4 border-b border-black/10">
                    <Link
                        to={isNews ? "/news" : "/articles"}
                        className="inline-flex items-center gap-2 text-black hover:text-emerald-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> {isNews ? "Back to News" : "Back to Articles"}
                    </Link>
                    <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-40">
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{item.category || (isNews ? 'News' : 'Article')}</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 xl:gap-16">
                    {/* Main Content Area */}
                    <article className="lg:col-span-8 overflow-hidden">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-black leading-none mb-10 tracking-tighter uppercase italic"
                        >
                            {item.title}
                        </motion.h1>

                        {/* Metadata Strip */}
                        <div className="flex flex-wrap items-center gap-6 mb-12 pb-8 border-b border-black/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
                                    <FiUser size={14} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest">{item.author_name || 'SUCF UNEC'}</span>
                            </div>
                            <div className="flex items-center gap-3 opacity-60">
                                <FiCalendar size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{new Date(item.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-sm">
                                    {item.category || (isNews ? 'News' : 'Article')}
                                </span>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {item.image_url && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full relative overflow-hidden bg-white mb-16 shadow-xl grayscale hover:grayscale-0 transition-all duration-1000"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    className="w-full h-auto object-cover"
                                />
                            </motion.div>
                        )}

                        {/* Rich Content - Enhanced Typography with Full Quill Support */}
                        <style>{`
                            .article-content .ql-size-small { font-size: 0.875rem; }
                            .article-content .ql-size-large { font-size: 1.25rem; }
                            .article-content .ql-size-huge { font-size: 1.5rem; }
                            .article-content .ql-align-center { text-align: center; }
                            .article-content .ql-align-right { text-align: right; }
                            .article-content .ql-align-justify { text-align: justify; }
                        `}</style>
                        <div
                            className="article-content prose prose-lg md:prose-xl max-w-none text-slate-900 leading-relaxed
                                prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
                                prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                                prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-7
                                prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
                                prose-p:mb-6 prose-p:leading-[1.8] prose-p:text-slate-700
                                prose-a:text-emerald-600 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-em:text-slate-700 prose-em:italic
                                prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                                prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                                prose-li:mb-2 prose-li:text-slate-700
                                prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600 prose-blockquote:my-6
                                prose-code:bg-slate-100 prose-code:text-emerald-600 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                                prose-pre:bg-slate-900 prose-pre:text-white prose-pre:p-4 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-6
                                prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                                break-words"
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />

                        {/* Share & Tags */}
                        <div className="mt-20 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex flex-wrap gap-2">
                                {(item.tags || []).map(tag => (
                                    <span key={tag} className="px-4 py-1 border border-black/10 text-[9px] font-black uppercase tracking-widest">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied!");
                                }}
                                className="flex items-center gap-2 px-8 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all rounded-full"
                            >
                                <FiShare2 /> Share Details
                            </button>
                        </div>
                    </article>

                    {/* Sidebar / More News Area */}
                    <aside className="lg:col-span-4 w-full">
                        <div className="lg:sticky lg:top-40 space-y-12">
                            <div>
                                <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-black" />
                                    More Stories
                                </h3>
                                <div className="space-y-6 bg-white border-2 border-slate-900/5 p-6 rounded-[2rem]">
                                    {otherNews.map((news) => (
                                        <Link to={isNews ? `/news/${news.id}` : `/articles/${news.id}`} key={news.id} className="group block last:border-0 border-b border-slate-100 pb-4 last:pb-0">
                                            <div className="flex gap-4">
                                                {news.image_url && (
                                                    <div className="w-16 h-16 shrink-0 bg-white grayscale group-hover:grayscale-0 transition-all overflow-hidden rounded-xl">
                                                        <img src={news.image_url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col justify-center">
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">{news.category || 'Update'}</span>
                                                    <h4 className="text-[13px] font-black uppercase leading-[1.3] group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                        {news.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white border-2 border-slate-900/5 p-8 rounded-[2rem] shadow-sm">
                                <h4 className="text-lg font-black uppercase italic mb-4">Stay Connected</h4>
                                <p className="text-sm text-black/60 mb-6">Never miss a word from the unique fellowship.</p>
                                <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white px-6 py-3 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
                                    Join Our Community <FiChevronRight />
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
