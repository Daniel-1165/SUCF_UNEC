import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiShare2, FiTag, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

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

                <div className="grid lg:grid-cols-12 gap-16">
                    {/* Main Content Area */}
                    <article className="lg:col-span-8">
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

                        {/* Rich Content - Enhanced Paragraph Styling */}
                        <div
                            className="prose prose-xl md:prose-2xl max-w-none text-black leading-relaxed font-sans prose-emerald prose-p:mb-8 prose-p:leading-[1.8] prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-a:text-emerald-600"
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
                    <aside className="lg:col-span-4">
                        <div className="sticky top-40 space-y-12">
                            <div>
                                <h3 className="text-xl font-black uppercase italic mb-8 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-black" />
                                    More Stories
                                </h3>
                                <div className="space-y-8">
                                    {otherNews.map((news) => (
                                        <Link to={isNews ? `/news/${news.id}` : `/articles/${news.id}`} key={news.id} className="group block">
                                            <div className="flex gap-4">
                                                {news.image_url && (
                                                    <div className="w-20 h-20 shrink-0 bg-white grayscale group-hover:grayscale-0 transition-all overflow-hidden rounded-lg">
                                                        <img src={news.image_url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                                <div className="flex flex-col justify-center">
                                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">{news.category || 'Update'}</span>
                                                    <h4 className="text-sm font-black uppercase leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                        {news.title}
                                                    </h4>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Minimalist CTA */}
                            <div className="bg-white border border-black/5 p-8 rounded-2xl shadow-sm">
                                <h4 className="text-lg font-black uppercase italic mb-4">Stay Connected</h4>
                                <p className="text-sm text-black/60 mb-6">Never miss a word from the unique fellowship.</p>
                                <Link to="/contact" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-emerald-600 transition-all">
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
