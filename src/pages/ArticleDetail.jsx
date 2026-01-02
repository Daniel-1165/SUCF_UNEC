import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiUser, FiShare2, FiTag } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';

// Static fallback articles data
const staticArticles = {
    's1': {
        id: 's1',
        title: "Walking in Divine Purpose",
        content: `<p>Discovering God's plan for your life is the beginning of true fulfillment. When we align our steps with His divine will, we experience peace, joy, and purpose that transcends our understanding.</p>
        
        <h2>Understanding God's Call</h2>
        <p>Every believer has a unique calling and purpose. It's not about what we can achieve in our own strength, but about surrendering to His perfect plan for our lives.</p>
        
        <h2>Steps to Discovery</h2>
        <p>Through prayer, studying the Word, and fellowship with other believers, we can discern God's voice and direction for our lives. The journey may not always be easy, but it is always worth it.</p>
        
        <p>Remember, God's plans for you are plans for good and not for evil, to give you a future and a hope (Jeremiah 29:11).</p>`,
        author_name: "President",
        created_at: "2024-12-12",
        category: "Spiritual Growth",
        image_url: "https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop",
        tags: ["Purpose", "Faith", "Guidance"]
    },
    's2': {
        id: 's2',
        title: "Balancing Academics and Faith",
        content: `<p>As students, we face the constant challenge of balancing our academic pursuits with our spiritual growth. But these two aspects of our lives don't have to be in conflict.</p>
        
        <h2>Practical Tips</h2>
        <p>Start your day with prayer and devotion. This sets the tone for everything else. Remember that God cares about every aspect of your life, including your studies.</p>
        
        <h2>Time Management</h2>
        <p>Create a schedule that includes time for studies, fellowship activities, and personal devotion. Discipline is key to maintaining balance.</p>
        
        <p>Trust that when you seek first the kingdom of God, all other things will be added unto you (Matthew 6:33).</p>`,
        author_name: "Sister Grace",
        created_at: "2024-11-28",
        category: "Academic",
        image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop",
        tags: ["Academic", "Balance", "Time Management"]
    },
    's3': {
        id: 's3',
        title: "The Power of Corporate Prayer",
        content: `<p>When believers gather together in prayer, something supernatural happens. The Bible tells us that where two or three are gathered in His name, He is there in the midst of them.</p>
        
        <h2>Unity in Prayer</h2>
        <p>Corporate prayer creates a powerful atmosphere of faith and unity. It's not just about individual requests, but about coming together with one heart and one mind.</p>
        
        <h2>Testimonies</h2>
        <p>We've seen countless testimonies of answered prayers during our Wednesday prayer meetings. From academic breakthroughs to healing and deliverance, God moves when His people pray together.</p>
        
        <p>Join us every Wednesday at 6:00 PM for our prayer meeting and experience the power of corporate prayer.</p>`,
        author_name: "Prayer Secretary",
        created_at: "2024-11-15",
        category: "Prayer",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2670&auto=format&fit=crop",
        tags: ["Prayer", "Unity", "Fellowship"]
    }
};

const ArticleDetail = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            // Check static first
            if (staticArticles[id]) {
                setArticle(staticArticles[id]);
                setLoading(false);
                return;
            }

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
        <div className="pt-40 pb-20 min-h-screen bg-[#1a1f1e] selection:bg-emerald-600 selection:text-white">
            <div className="container mx-auto px-6 max-w-5xl">
                <Link
                    to="/articles"
                    className="inline-flex items-center gap-2 text-[#8B7355] hover:text-[#4A6741] transition-all mb-12 font-black text-xs uppercase tracking-[0.2em] group"
                >
                    <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Back to Articles
                </Link>

                <article className="relative">
                    {/* Featured Image */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="aspect-[21/9] w-full relative rounded-[3rem] overflow-hidden border border-[#4A6741]/30 mb-16 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
                    >
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover hover:scale-105 transition-all duration-1000 brightness-90"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f1e] via-[#1a1f1e]/20 to-transparent" />
                        <div className="absolute top-10 left-10">
                            <span className="bg-[#4A6741] text-white px-6 py-2 rounded-full text-[10px] font-black shadow-2xl uppercase tracking-[0.2em]">
                                {article.category}
                            </span>
                        </div>
                    </motion.div>

                    <div className="max-w-3xl mx-auto">
                        {/* Meta Header */}
                        <div className="flex flex-wrap items-center gap-8 mb-12 pb-12 border-b border-[#4A6741]/20">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#4A6741]/20 border border-[#4A6741]/30 flex items-center justify-center text-[#8B7355]">
                                    <FiUser size={24} />
                                </div>
                                <div>
                                    <p className="text-[#8B7355]/70 text-[10px] uppercase font-black tracking-widest mb-1">Author</p>
                                    <p className="text-[#F5F1E8] font-serif italic text-lg">{article.author_name || 'Admin'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-[#4A6741]/20 border border-[#4A6741]/30 flex items-center justify-center text-[#8B7355]">
                                    <FiClock size={24} />
                                </div>
                                <div>
                                    <p className="text-[#8B7355]/70 text-[10px] uppercase font-black tracking-widest mb-1">Published</p>
                                    <p className="text-[#F5F1E8] font-serif italic text-lg">
                                        {new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                            <button className="ml-auto w-14 h-14 rounded-2xl bg-[#4A6741]/20 border border-[#4A6741]/30 flex items-center justify-center text-[#8B7355] hover:bg-[#4A6741] hover:text-white transition-all shadow-xl group">
                                <FiShare2 className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </div>

                        {/* Content */}
                        <motion.h1
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-7xl font-serif font-black text-[#F5F1E8] italic uppercase leading-[0.9] mb-16 tracking-tight"
                        >
                            {article.title}
                        </motion.h1>

                        <div
                            className="prose prose-lg prose-invert max-w-none text-[#9CA3AF] leading-relaxed font-light"
                            style={{
                                '--tw-prose-headings': '#F5F1E8',
                                '--tw-prose-links': '#8B7355',
                                '--tw-prose-bold': '#F5F1E8',
                                '--tw-prose-quotes': '#8B7355',
                                '--tw-prose-quote-borders': '#4A6741'
                            }}
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />

                        {/* Tags */}
                        {article.tags && (
                            <div className="mt-20 pt-12 border-t border-[#4A6741]/20 flex flex-wrap gap-3">
                                {article.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center gap-2 px-6 py-2 bg-[#4A6741]/20 text-[#8B7355] rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#4A6741] hover:text-white cursor-default border border-[#4A6741]/30">
                                        <FiTag /> {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </article>

                {/* Footer Action */}
                <div className="mt-24 p-12 rounded-[3rem] bg-[#2C3E3A]/40 backdrop-blur-sm border border-[#4A6741]/30 flex flex-col md:flex-row justify-between items-center gap-8 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A6741]/10 blur-[100px] -z-10 rounded-full" />
                    <div>
                        <h4 className="text-[#F5F1E8] text-2xl font-serif font-black italic uppercase mb-2">Share this article</h4>
                        <p className="text-[#8B7355] font-light italic">Help a brother or sister find their way today.</p>
                    </div>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Article link copied to clipboard!");
                        }}
                        className="px-12 py-5 bg-[#4A6741] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-[0_20px_40px_rgba(74,103,65,0.3)] hover:bg-[#8B7355] transition-all whitespace-nowrap"
                    >
                        Copy Link
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArticleDetail;
