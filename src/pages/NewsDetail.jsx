import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowLeft, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedNews, setRelatedNews] = useState([]);
    const [readingTime, setReadingTime] = useState(0);

    useEffect(() => {
        fetchNews();
    }, [id]);

    const calculateReadingTime = (text) => {
        if (!text) return 1;
        const wordsPerMinute = 200;
        const strippedText = text.replace(/<[^>]*>/g, '');
        const noOfWords = strippedText.split(/\s+/).filter(word => word.length > 0).length;
        return Math.ceil(noOfWords / wordsPerMinute);
    };

    const fetchNews = async () => {
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setNews(data);

            if (data?.content) {
                setReadingTime(calculateReadingTime(data.content));
            }

            // Fetch related news
            const { data: related } = await supabase
                .from('news')
                .select('*')
                .neq('id', id)
                .order('created_at', { ascending: false })
                .limit(3);

            setRelatedNews(related || []);
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <div className="text-6xl mb-4 opacity-20">📰</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">News Not Found</h2>
                <p className="text-slate-600 mb-6">The news update youre looking for doesnt exist.</p>
                <Link to="/" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Back Home
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <SEO
                title={`${news.title} - SUCF UNEC News`}
                description={news.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
            />

            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8 md:mb-12"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-[0.25em] transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Latest Updates
                    </button>
                </motion.div>

                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-y-12 lg:gap-20">
                    {/* Main Content - 70% */}
                    <article className="lg:col-span-8 w-full">
                        <header className="mb-8 md:mb-12">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-4 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                                    Announcement
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-6xl font-black text-slate-900 mb-4 md:mb-8 leading-[1.1] tracking-tight">
                                {news.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-slate-400 mb-8 md:mb-12">
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="text-blue-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{formatDate(news.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiClock className="text-blue-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{readingTime} min read</span>
                                </div>
                            </div>

                            {/* Featured Image - Centered and Prominent */}
                            {news.image_url && (
                                <div className="w-full h-auto max-h-[50vh] md:max-h-[60vh] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 mb-8 md:mb-12">
                                    <img
                                        src={news.image_url}
                                        alt={news.title}
                                        className="max-w-full max-h-full w-auto h-auto object-contain rounded-2xl"
                                    />
                                </div>
                            )}
                        </header>

                        {/* News Content */}
                        <div
                            className="news-body-content text-slate-700 text-lg md:text-xl leading-[1.85] w-full break-words whitespace-normal"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </article>

                    {/* Sidebar - 30% */}
                    <aside className="lg:col-span-4 space-y-12">
                        {relatedNews.length > 0 && (
                            <div className="sticky top-32">
                                <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight uppercase tracking-widest text-xs opacity-40">Previous Updates</h3>
                                <div className="grid gap-8">
                                    {relatedNews.map((related) => (
                                        <Link
                                            key={related.id}
                                            to={`/news/${related.id}`}
                                            className="group block"
                                        >
                                            <div className="aspect-video rounded-2xl overflow-hidden bg-slate-50 mb-4 border border-slate-100">
                                                {related.image_url ? (
                                                    <img
                                                        src={related.image_url}
                                                        alt={related.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                        <FiFileText size={32} />
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 block">News</span>
                                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                {related.title}
                                            </h4>
                                        </Link>
                                    ))}
                                </div>

                                <div className="mt-12 pt-8 border-t border-slate-100">
                                    <Link to="/news" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2">
                                        See All News <FiArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
