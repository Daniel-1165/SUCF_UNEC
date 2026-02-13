import React, { useState, useEffect } from 'react';
import { FiClock, FiArrowRight, FiTrash2, FiSearch, FiShare2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const News = () => {
    const { user } = useAuth();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Fewer items per page for a vertical feed

    const categories = ['All', 'Announcement', 'Event', 'Update', 'Featured'];

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const { data, error } = await supabase
                .from('news')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNews(data || []);
        } catch (error) {
            console.error("Error fetching news:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm("Delete this news update?")) return;

        try {
            const { error } = await supabase.from('news').delete().eq('id', id);
            if (error) throw error;
            setNews(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    // Filter and search logic
    const filteredNews = news.filter(item => {
        const matchesSearch = (item.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (item.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
            <SEO
                title="News & Updates"
                description="Announcements, events, and latest updates from SUCF UNEC."
            />

            <div className="container mx-auto px-4 md:px-6 max-w-3xl">
                {/* Minimalist Header */}
                <header className="mb-16 border-b-4 border-black pb-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-4 font-serif">
                        NEWS.
                    </h1>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">
                            Updates & Announcements
                        </p>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-widest">
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`transition-colors ${selectedCategory === category ? 'text-emerald-700 underline underline-offset-4' : 'text-gray-400 hover:text-black'}`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Feed Layout */}
                <div className="flex flex-col gap-16">
                    {paginatedNews.map((item, index) => (
                        <motion.article
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="group border-b border-gray-200 pb-16 last:border-0"
                        >
                            <Link to={`/news/${item.id}`} className="block">
                                {/* Meta Data */}
                                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3">
                                    <span>{item.category || 'Update'}</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="text-gray-500">{new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>

                                {/* Title - Forbes Style */}
                                <h2 className="text-2xl md:text-4xl font-bold font-serif text-gray-900 mb-4 leading-tight group-hover:text-emerald-800 transition-colors">
                                    {item.title}
                                </h2>

                                {/* Image Section - FULL DISPLAY (No Cropping) */}
                                {item.image_url && (
                                    <div className="w-full my-6 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            className="w-full h-auto object-contain block" // h-auto + w-full ensures aspect ratio is preserved
                                        />
                                    </div>
                                )}

                                {/* Excerpt */}
                                <p className="text-gray-600 text-lg leading-relaxed mb-6 font-serif">
                                    {item.content?.replace(/<[^>]*>/g, '').substring(0, 180)}...
                                </p>

                                {/* Footer */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] border-b-2 border-black pb-1 group-hover:border-emerald-700 group-hover:text-emerald-700 transition-all">
                                        Read Full Story <FiArrowRight />
                                    </span>

                                    {user?.isAdmin && (
                                        <button
                                            onClick={(e) => handleDelete(e, item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </Link>
                        </motion.article>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-20 pt-8 border-t-2 border-black flex justify-between items-center">
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.max(1, p - 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === 1}
                            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-emerald-700 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => {
                                setCurrentPage(p => Math.min(totalPages, p + 1));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={currentPage === totalPages}
                            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-emerald-700 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}

                {filteredNews.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-xl font-bold text-gray-900">No updates found.</h3>
                        <p className="text-gray-500 mt-2">Check back later for news.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default News;
