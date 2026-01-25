import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiDownload, FiBook, FiSearch, FiFilter, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Library = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Semester Books', 'Spiritual Growth', 'Academic', 'Archive'];

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data, error } = await supabase
                    .from('books')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setBooks(data || []);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Filter Logic
    const filteredBooks = books.filter(book => {
        const matchesSearch = (book.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (book.author?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // Mock category logic since DB might not have exact 'category' column matching these.
        // We'll assume everything is 'All' or match primitive checks if columns exist, 
        // but for now let's just use Search for filtering mainly, and if 'semester' column exists, use it.
        // If the book table has a 'category' column, use it. If not, we iterate 'All'.
        // Checking previous code, 'semester' exists.

        const matchesCategory = selectedCategory === 'All'
            ? true
            : selectedCategory === 'Semester Books'
                ? book.semester
                : true; // For now, other categories show all unless we have data

        return matchesSearch && matchesCategory;
    });

    const featuredBooks = books.slice(0, 3); // Top 3 newest

    return (
        <div className="min-h-screen pt-32 pb-20 bg-[#F8FAFC] font-sans selection:bg-emerald-500 selection:text-white">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Header & Search Section */}
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3"
                            >
                                Digital Library
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
                            >
                                Discover <span className="text-emerald-600">Knowledge.</span>
                            </motion.h1>
                        </div>

                        {/* Search Bar - Floating Style */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-full md:w-96 relative z-20"
                        >
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <FiSearch className="text-slate-400 text-lg group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search title, author, isbn..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:shadow-xl focus:border-emerald-500 outline-none transition-all duration-300 placeholder:text-slate-400 text-slate-900 font-medium"
                                />
                                <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                                    <button className="p-2 bg-slate-100 rounded-xl text-slate-500 hover:bg-emerald-500 hover:text-white transition-colors">
                                        <FiFilter />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Categories - Horizontal Scroll */}
                    <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mask-gradient">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedCategory(cat)}
                                className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 ring-2 ring-emerald-600 ring-offset-2'
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Featured Section (Visible only when no search) */}
                {!searchTerm && selectedCategory === 'All' && !loading && books.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-16"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">Recommended For You</h2>
                            <div className="flex gap-2">
                                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-transparent transition-all">←</button>
                                <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-600 hover:text-white hover:border-transparent transition-all">→</button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredBooks.map((book, i) => (
                                <div key={book.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex gap-5 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="w-24 h-32 shrink-0 rounded-2xl overflow-hidden shadow-inner relative">
                                        <img
                                            src={book.image_url || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop'}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-between py-1">
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Trending</p>
                                            <h3 className="font-bold text-slate-900 leading-tight mb-1 line-clamp-2">{book.title}</h3>
                                            <p className="text-xs text-slate-500">{book.author || "Unknown Author"}</p>
                                        </div>
                                        <a href={book.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-black text-slate-900 flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read Now <FiChevronRight className="text-emerald-500" />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Main Grid */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">
                            {searchTerm ? `Search Results (${filteredBooks.length})` :
                                selectedCategory === 'All' ? 'Popular Books' : selectedCategory}
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="aspect-[2/3] bg-slate-200 rounded-3xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
                            {filteredBooks.length > 0 ? filteredBooks.map((book) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={book.id}
                                    className="group flex flex-col"
                                >
                                    <div className="relative aspect-[2/3] mb-4 rounded-3xl overflow-hidden shadow-md group-hover:shadow-2xl group-hover:shadow-emerald-900/20 transition-all duration-500 bg-emerald-50">
                                        {book.image_url ? (
                                            <img
                                                src={book.image_url}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                                                <FiBook className="text-4xl text-emerald-200 mb-2" />
                                                <span className="text-[10px] text-emerald-800/40 font-bold uppercase">No Cover</span>
                                            </div>
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <a
                                                href={book.file_url}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-colors shadow-lg"
                                            >
                                                <FiDownload /> Download
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-emerald-600 transition-colors">
                                            {book.title}
                                        </h3>
                                        <p className="text-xs font-medium text-slate-400 line-clamp-1">
                                            {book.author || "SUCF UNEC"}
                                        </p>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-20 text-center">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400 text-3xl">
                                        <FiBook />
                                    </div>
                                    <p className="text-slate-500 font-medium">No books found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Library;
