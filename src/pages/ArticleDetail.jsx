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
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="aspect-[21/9] w-full relative zeni-card !p-0 overflow-hidden border-[10px] border-white mb-16 shadow-2xl"
                    >
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover transition-all duration-1000"
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
