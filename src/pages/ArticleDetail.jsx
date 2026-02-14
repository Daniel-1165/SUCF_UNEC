import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowLeft, FiCalendar, FiUser, FiClock, FiFileText } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedArticles, setRelatedArticles] = useState([]);
    const [readingTime, setReadingTime] = useState(0);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const calculateReadingTime = (text) => {
        if (!text) return 1;
        const wordsPerMinute = 200;
        const strippedText = text.replace(/<[^>]*>/g, '');
        const noOfWords = strippedText.split(/\s+/).filter(word => word.length > 0).length;
        return Math.ceil(noOfWords / wordsPerMinute);
    };

    const fetchArticle = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setArticle(data);

            if (data?.content) {
                setReadingTime(calculateReadingTime(data.content));
            }

            // Fetch related articles
            if (data) {
                const { data: related } = await supabase
                    .from('articles')
                    .select('*')
                    .neq('id', id)
                    .eq('category', data.category)
                    .order('created_at', { ascending: false })
                    .limit(3);

                setRelatedArticles(related || []);
            }
        } catch (error) {
            console.error('Error fetching article:', error);
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
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
                <div className="text-6xl mb-4 opacity-20">📝</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
                <p className="text-slate-600 mb-6">The article youre looking for doesnt exist.</p>
                <Link to="/articles" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                    Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <SEO
                title={`${article.title} - SUCF UNEC`}
                description={article.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
            />

            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link
                        to="/articles"
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-[0.25em] transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Explore Articles
                    </Link>
                </motion.div>

                {/* Article Header */}
                <header className="mb-16">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="px-4 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                            {article.category || 'Article'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-10 leading-[1.1] tracking-tight">
                        {article.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-x-10 gap-y-6 text-slate-400">
                        <div className="flex items-center gap-2">
                            <FiCalendar className="text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">{formatDate(article.created_at)}</span>
                        </div>
                        {article.author && (
                            <div className="flex items-center gap-2">
                                <FiUser className="text-emerald-500" />
                                <span className="text-xs font-bold uppercase tracking-widest">{article.author}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <FiClock className="text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-widest">{readingTime} min read</span>
                        </div>
                    </div>
                </header>

                {/* Featured Image */}
                {article.image_url && (
                    <div className="mb-16 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 max-w-[90%] md:max-w-none mx-auto">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-auto object-cover max-h-[400px] md:max-h-[600px]"
                        />
                    </div>
                )}

                {/* Article Content */}
                <div
                    className="article-body-content text-slate-700 text-lg md:text-xl leading-[1.85] w-full break-words whitespace-normal"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Related Section */}
                {relatedArticles.length > 0 && (
                    <div className="mt-32 pt-16 border-t border-slate-100">
                        <h2 className="text-4xl font-black text-slate-900 mb-16 tracking-tight">More to read</h2>
                        <div className="grid md:grid-cols-3 gap-12">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.id}
                                    to={`/articles/${related.id}`}
                                    className="group"
                                >
                                    <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-50 mb-8 relative">
                                        {related.image_url ? (
                                            <img
                                                src={related.image_url}
                                                alt={related.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                                                <FiFileText size={48} />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 block">{related.category || 'Article'}</span>
                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                                        {related.title}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleDetail;
