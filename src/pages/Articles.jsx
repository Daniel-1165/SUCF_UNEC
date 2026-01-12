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
        <div className="pt-32 pb-20 min-h-screen zeni-mesh-gradient selection:bg-emerald-600 selection:text-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="text-center mb-16 md:mb-24 max-w-3xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-900 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Wisdom & Revelation
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-[#00211F] leading-none uppercase italic">
                        Edifying <span className="text-emerald-600">Reads.</span>
                    </h1>
                    <p className="text-[#00211F] opacity-40 text-lg md:text-xl font-medium leading-relaxed">
                        Articles, Testimonies, and Words of Exhortation to build your spirit.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative group"
                        >
                            {user?.isAdmin && !article.id.toString().startsWith('s') && (
                                <button
                                    onClick={(e) => handleDelete(e, article.id)}
                                    className="absolute top-6 right-6 z-20 p-3 bg-red-600 text-white rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            )}
                            <Link
                                to={`/articles/${article.id}`}
                                className="zeni-card flex flex-col h-full group hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-700 overflow-hidden"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={article.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-[#00211F] uppercase tracking-widest shadow-sm">
                                        {article.category || 'Word'}
                                    </div>
                                </div>

                                <div className="p-10 flex-grow flex flex-col">
                                    <div className="flex items-center gap-4 text-[9px] font-black text-emerald-600 mb-6 uppercase tracking-widest opacity-60">
                                        <span className="flex items-center gap-2"><FiUser /> {article.author_name || 'Admin'}</span>
                                        <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-30"></span>
                                        <span className="flex items-center gap-2"><FiClock /> {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-black text-[#00211F] mb-4 group-hover:text-emerald-600 transition-colors leading-tight italic uppercase tracking-tighter">
                                        {article.title}
                                    </h2>

                                    <p className="text-[#00211F] opacity-40 text-sm mb-8 line-clamp-2 leading-relaxed font-medium">
                                        {article.excerpt || article.content?.substring(0, 100) + '...'}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-[#F5F9F7] flex items-center gap-3 text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] group-hover:gap-5 transition-all">
                                        Read Fully <FiArrowRight className="text-lg" />
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
