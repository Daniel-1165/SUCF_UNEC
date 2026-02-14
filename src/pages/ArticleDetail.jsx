import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiArrowLeft, FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ArticleDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedArticles, setRelatedArticles] = useState([]);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setArticle(data);

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
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
                <div className="text-6xl mb-4 opacity-20">📝</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Article Not Found</h2>
                <p className="text-slate-600 mb-6">The article you're looking for doesn't exist.</p>
                <Link to="/articles" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">
                    Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-32 pb-20">
            <SEO
                title={`${article.title} - SUCF UNEC`}
                description={article.content?.replace(/<[^>]*>/g, '').substring(0, 160)}
            />

            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        to="/articles"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-bold text-sm uppercase tracking-wider transition-all group"
                    >
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to Articles
                    </Link>
                </motion.div>

                {/* Article Header */}
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl"
                >
                    {/* Featured Image */}
                    {article.image_url && (
                        <div className="aspect-[21/9] overflow-hidden bg-slate-100">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="p-8 md:p-12">
                        {/* Category Badge */}
                        <div className="mb-6">
                            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                {article.category || 'Article'}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                            {article.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-slate-200">
                            <div className="flex items-center gap-2 text-slate-600">
                                <FiCalendar size={16} />
                                <span className="text-sm font-medium">{formatDate(article.created_at)}</span>
                            </div>
                            {article.author && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <FiUser size={16} />
                                    <span className="text-sm font-medium">{article.author}</span>
                                </div>
                            )}
                        </div>

                        {/* Article Body */}
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:font-bold prose-headings:text-slate-900
                                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6
                                prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
                                prose-strong:text-slate-900 prose-strong:font-bold
                                prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
                                prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
                                prose-li:text-slate-700 prose-li:mb-2
                                prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-600
                                prose-img:rounded-2xl prose-img:shadow-lg"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>
                </motion.article>

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Articles</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedArticles.map((related) => (
                                <Link
                                    key={related.id}
                                    to={`/articles/${related.id}`}
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
                                        <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
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

export default ArticleDetail;
