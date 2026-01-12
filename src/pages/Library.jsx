import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiDownload, FiBook, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Library = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (book.author && book.author.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen pt-32 pb-20 zeni-mesh-gradient">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full mb-8"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-black text-emerald-900 tracking-[0.2em] uppercase">Spiritual Archives</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black text-[#00211F] mb-8 leading-none tracking-tighter"
                    >
                        The <span className="text-emerald-600 italic">Word.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#00211F] text-xl font-medium opacity-40 leading-relaxed mb-12 max-w-2xl mx-auto"
                    >
                        Explore our growing collection of spiritual resources, curated specifically for your growth and academic excellence.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative max-w-2xl mx-auto"
                    >
                        <div className="zeni-card flex items-center p-2 bg-white/80 backdrop-blur-xl border-[#D1E8E0] shadow-2xl shadow-emerald-900/5">
                            <div className="w-14 h-14 flex items-center justify-center text-[#00211F] opacity-30 text-2xl">
                                <FiSearch />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by title or author..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-grow bg-transparent border-none outline-none text-lg font-bold text-[#00211F] placeholder:opacity-20 px-2"
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[3/4] bg-white/50 rounded-[3rem] border border-[#E8F3EF] animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredBooks.map((book) => (
                            <motion.div
                                key={book.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10 }}
                                className="zeni-card flex flex-col group h-full overflow-hidden"
                            >
                                {/* Cover Image Section */}
                                <div className="relative aspect-[4/5] overflow-hidden bg-[#F5F9F7]">
                                    {book.image_url ? (
                                        <img
                                            src={book.image_url}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                                            <FiBook className="text-8xl mb-4" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00211F]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                        <a
                                            href={book.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-white text-[#00211F] py-4 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all scale-95 group-hover:scale-100"
                                        >
                                            <FiDownload /> Download Word
                                        </a>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4">
                                        {book.semester || "Semester Read"}
                                    </div>
                                    <h3 className="text-xl font-bold text-[#00211F] mb-2 leading-tight line-clamp-2">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm font-medium text-[#00211F] opacity-40 mb-6">
                                        By {book.author || "SUCF UNEC"}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-[#F5F9F7]">
                                        <a
                                            href={book.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-4 transition-all"
                                        >
                                            View Reader <FiDownload className="text-lg" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 zeni-card border-dashed border-2 border-emerald-500/20">
                        <FiBook className="text-7xl text-emerald-500/20 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-[#00211F] opacity-40">No books found matching your search.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
