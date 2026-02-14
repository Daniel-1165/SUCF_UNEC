import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowLeft, FiCalendar, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const NewsDetail = () => {
    const { id } = useParams();
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedNews, setRelatedNews] = useState([]);

    useEffect(() => {
        fetchNews();
    }, [id]);

    const fetchNews = async () => {
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setNewsItem(data);

            // Fetch related news
            if (data) {
                const { data: related } = await supabase
                    .from('news')
                    .select('*')
                    .neq('id', id)
                    .order('created_at', { ascending: false })
                    .limit(3);

                setRelatedNews(related || []);
            }
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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!newsItem) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <div className="text-6xl mb-4 opacity-20">📰</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">News Not Found</h2>
                <p className="text-slate-600 mb-6">The news item you're looking for doesn't exist.</p>
                <Link to="/news" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all">
                    Back to News
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 pt-32 pb-20">
            <SEO
                title={`${newsItem.title} - SUCF UNEC`}
                description={newsItem.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
            />

            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/news"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm uppercase tracking-wider transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to News
                    </Link>
                </motion.div>

                {/* News Article */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl"
                >
                    {/* Featured Image */}
                    {newsItem.image_url && (
                        <div className="aspect-[21/9] overflow-hidden bg-slate-100">
                            <img
                                src={newsItem.image_url}
                                alt={newsItem.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* News Content */}
                    <div className="p-8 md:p-12">
                        {/* News Badge */}
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                News Update
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            {newsItem.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-slate-200">
                            <div className="flex items-center gap-2 text-slate-600">
                                <FiCalendar size={16} />
                                <span className="text-sm font-medium">{formatDate(newsItem.created_at)}</span>
                            </div>
                        </div>

                        {/* News Body */}
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:font-bold prose-headings:text-slate-900
                                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                                prose-li:text-slate-700 prose-li:mb-2
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600
                                prose-img:rounded-2xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: newsItem.content }}
                        />
                    </div>
                </motion.article>

                {/* Related News */}
                {relatedNews.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">More News</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedNews.map((related) => (
                                <Link
                                    key={related.id}
                                    to={`/news/${related.id}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
                                >
                                    {related.image_url && (
                                        <div className="aspect-video overflow-hidden bg-slate-100">
                                            <img
                                                src={related.image_url}
                                                alt={related.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-2">{formatDate(related.created_at)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewsDetail;
