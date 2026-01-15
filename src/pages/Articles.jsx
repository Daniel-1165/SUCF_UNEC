import React, { useState, useEffect } from 'react';
import { FiClock, FiUser, FiArrowRight, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
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
        author_name: "Anonymous",
        created_at: "2024-12-12",
        category: "Spiritual Growth",
        image_url: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 's2',
        title: "Balancing Academics and Faith",
        excerpt: "How do you maintain a 5.0 GPA while serving in the fellowship? Practical tips from successful students.",
        author_name: "Anonymous",
        created_at: "2024-11-28",
        category: "Academic",
        image_url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2673&auto=format&fit=crop"
    },
    {
        id: 's3',
        title: "The Power of Corporate Prayer",
        excerpt: "When believers gather in unity, mountains move. Discover the transformative power of praying together.",
        author_name: "Prayer Secretary",
        created_at: "2024-11-15",
        category: "Prayer",
        image_url: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=2574&auto=format&fit=crop"
    }
];

const Articles = () => {
    const { user } = useAuth();
    const [dbArticles, setDbArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Spiritual Growth', 'Academic', 'Prayer', 'Testimony'];

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

    // Filter and search logic
    const allArticles = [...dbArticles, ...staticArticles];
    const filteredArticles = allArticles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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

                {/* Search and Filter Section */}
                <div className="mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-emerald-600/40" />
                        <input
                            type="text"
                            placeholder="Search articles by title or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-6 py-5 rounded-[2rem] bg-white border-2 border-gray-200 focus:border-emerald-600 outline-none transition-all text-[#00211F] font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <FiFilter className="text-emerald-600/60" />
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${selectedCategory === category
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                                    : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-600 hover:text-emerald-600'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Results Count */}
                    <p className="text-center text-sm font-medium text-gray-500">
                        Showing <span className="font-black text-emerald-600">{filteredArticles.length}</span> {filteredArticles.length === 1 ? 'article' : 'articles'}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative group"
                        >
                            {user?.isAdmin && !article.id.toString().startsWith('s') && (
                                <button
                                    onClick={(e) => handleDelete(e, article.id)}
                                    className="absolute top-6 right-6 z-20 p-3 bg-red-600/90 backdrop-blur-md text-white rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:scale-110"
                                >
                                    <FiTrash2 size={18} />
                                </button>
                            )}
                            <Link
                                to={`/articles/${article.id}`}
                                className="zeni-card flex flex-col h-full group hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-700 overflow-hidden bg-white border-[#E8F3EF]"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={article.image_url || 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=2670&auto=format&fit=crop'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute top-6 left-6 bg-emerald-500/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                                        {article.category || 'Word'}
                                    </div>
                                </div>

                                <div className="p-10 flex-grow flex flex-col">
                                    <div className="flex items-center gap-4 text-[9px] font-black text-emerald-600 mb-6 uppercase tracking-widest opacity-60">
                                        <span className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-lg"><FiUser /> {article.author_name || 'Admin'}</span>
                                        <span className="flex items-center gap-2 px-2 py-1 bg-emerald-50 rounded-lg"><FiClock /> {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-black text-[#00211F] mb-4 group-hover:text-emerald-600 transition-colors leading-tight italic uppercase tracking-tighter">
                                        {article.title}
                                    </h2>

                                    <p className="text-[#00211F] opacity-40 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                                        {article.excerpt || article.content?.replace(/<[^>]*>/g, '').substring(0, 150) + '...'}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-[#F5F9F7] flex items-center gap-3 text-emerald-700 font-black text-[10px] uppercase tracking-[0.3em] group-hover:gap-5 transition-all">
                                        Read Deeply <FiArrowRight className="text-lg" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* No Results Message */}
                {filteredArticles.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FiSearch className="text-4xl text-emerald-600/40" />
                        </div>
                        <h3 className="text-2xl font-black text-[#00211F] mb-3">No Articles Found</h3>
                        <p className="text-gray-500 font-medium">Try adjusting your search or filter criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Articles;
