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
        <div className="min-h-screen pt-32 pb-20 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100 mb-6"
                    >
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        <span className="text-sm font-black text-emerald-900 tracking-[0.15em] uppercase">Resource Center</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-serif font-black text-emerald-900 mb-6 uppercase italic italic"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Word Library</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 text-lg font-light leading-relaxed mb-10 max-w-2xl mx-auto"
                    >
                        Explore our collection of spiritual books, semester guides, and academic resources curated for your growth.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative max-w-xl mx-auto"
                    >
                        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                        <input
                            type="text"
                            placeholder="Search by title or author..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-2xl py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 transition-all shadow-sm text-lg"
                        />
                    </motion.div>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="h-[450px] bg-white rounded-[2rem] border border-gray-100 animate-pulse shadow-sm"></div>
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
                                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group"
                            >
                                {/* Cover Image Section */}
                                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                    {book.image_url ? (
                                        <img
                                            src={book.image_url}
                                            alt={book.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-emerald-200">
                                            <FiBook className="text-8xl mb-4 opacity-20" />
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-30">No Cover Available</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                        <a
                                            href={book.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-white text-emerald-900 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all scale-95 group-hover:scale-100"
                                        >
                                            <FiDownload /> Instant Download
                                        </a>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                                            {book.semester || "Semester Read"}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                        By {book.author || "SUCF UNEC"}
                                    </p>
                                    <p className="text-sm text-gray-500 line-clamp-2 font-light leading-relaxed mb-6">
                                        {book.description || "Building righteous standards through constant engagement with the Word and divine resources."}
                                    </p>
                                    <div className="mt-auto pt-6 border-t border-gray-50">
                                        <a
                                            href={book.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-700 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                                        >
                                            Download Reader <FiDownload />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
                        <FiBook className="text-6xl text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No books found matching your search.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Library;
