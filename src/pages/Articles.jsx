import React, { useState, useEffect } from 'react';
import { FiClock, FiUser, FiArrowRight, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

// Static fallback articles
const staticArticles = [
    {
        id: 's1',
        title: "Walking in Divine Purpose",
        excerpt: "Discovering God's plan for your life is the beginning of true fulfillment. Learn how to align your steps with His will.",
        author_name: "President",
        created_at: "2024-12-12",
        category: "Spiritual Growth",
        image_url: "https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 's2',
        title: "Balancing Academics and Faith",
        excerpt: "How do you maintain a 5.0 GPA while serving in the fellowship? Practical tips from successful students.",
        author_name: "Sister Grace",
        created_at: "2024-11-28",
        category: "Academic",
        image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 's3',
        title: "The Power of Corporate Prayer",
        excerpt: "When believers gather in unity, mountains move. Discover the transformative power of praying together.",
        author_name: "Prayer Secretary",
        created_at: "2024-11-15",
        category: "Prayer",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2670&auto=format&fit=crop"
    }
];

const Articles = () => {
    const { user } = useAuth();
    const [dbArticles, setDbArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const { data, error } = await supabase
                .from('articles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setDbArticles(data || []);
        } catch (error) {
            console.error("Error fetching articles:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this article?")) return;

        try {
            const { error } = await supabase.from('articles').delete().eq('id', id);
            if (error) throw error;
            setDbArticles(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    const allArticles = [...dbArticles, ...staticArticles];
    return (
        <div className="pt-32 pb-20 min-h-screen bg-[#1a1f1e] selection:bg-emerald-600 selection:text-white">
            <div className="container mx-auto px-6">
                <header className="text-center mb-24 max-w-3xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4A6741]/20 border border-[#4A6741]/30 text-[#8B7355] text-xs font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md"
                    >
                        <span className="w-1.5 h-1.5 bg-[#4A6741] rounded-full animate-pulse"></span>
                        Wisdom & Revelation
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tight text-[#F5F1E8] uppercase italic leading-[0.9]">
                        Edifying <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A6741] to-[#8B7355]">Reads</span>
                    </h1>
                    <p className="text-[#9CA3AF] text-lg md:text-xl font-light leading-relaxed">
                        Articles, Testimonies, and Words of Exhortation to build your spirit and strengthen your faith.
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative"
                        >
                            {user?.isAdmin && !article.id.toString().startsWith('s') && (
                                <button
                                    onClick={(e) => handleDelete(e, article.id)}
                                    className="absolute top-6 right-6 z-20 p-3 bg-red-600/90 hover:bg-red-600 text-white rounded-2xl shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete Article"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            )}
                            <Link
                                to={`/articles/${article.id}`}
                                className="bg-[#2C3E3A]/40 backdrop-blur-sm rounded-[2.5rem] overflow-hidden group hover:bg-[#2C3E3A]/60 transition-all duration-500 border border-[#4A6741]/20 flex flex-col h-full relative hover:shadow-[0_20px_60px_rgba(74,103,65,0.3)]"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={article.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 brightness-90 group-hover:brightness-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f1e] via-transparent to-transparent opacity-60"></div>
                                    <div className="absolute top-6 left-6 bg-[#4A6741] backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                                        {article.category || 'Word'}
                                    </div>
                                </div>

                                <div className="p-10 flex-grow flex flex-col">
                                    <div className="flex items-center gap-4 text-[10px] font-black text-[#8B7355] mb-6 uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><FiUser className="text-[#4A6741]" /> {article.author_name || 'Admin'}</span>
                                        <span className="w-1 h-1 bg-[#4A6741]/50 rounded-full"></span>
                                        <span className="flex items-center gap-2"><FiClock className="text-[#4A6741]" /> {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>

                                    <h2 className="text-3xl font-serif font-black text-[#F5F1E8] mb-4 group-hover:text-[#8B7355] transition-colors leading-tight italic uppercase">
                                        {article.title}
                                    </h2>

                                    <p className="text-[#9CA3AF] text-sm mb-8 line-clamp-3 leading-relaxed font-light">
                                        {article.excerpt || article.content?.substring(0, 150) + '...'}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-[#4A6741]/20 flex items-center gap-3 text-[#8B7355] font-black text-xs uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                                        Read Fully <FiArrowRight />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Articles;
