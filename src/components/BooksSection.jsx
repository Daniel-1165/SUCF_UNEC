import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiDownload, FiBook, FiArrowRight, FiTrash2, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, isAdmin, onDelete }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col group relative"
        >
            {/* Admin Controls */}
            {isAdmin && (
                <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <button
                        onClick={() => onDelete(book.id)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white transition-all"
                        title="Delete Book"
                    >
                        <FiTrash2 />
                    </button>
                    <Link
                        to="/admin"
                        className="w-10 h-10 bg-white/90 backdrop-blur-md text-emerald-900 rounded-full flex items-center justify-center shadow-lg hover:bg-emerald-900 hover:text-white transition-all"
                        title="Go to Admin"
                    >
                        <FiPlus />
                    </Link>
                </div>
            )}

            {/* Cover Image Section */}
            <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                {book.image_url ? (
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-emerald-200">
                        <FiBook className="text-7xl mb-4 opacity-20" />
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-30">No Cover Image</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Info Section */}
            <div className="p-8 flex-grow flex flex-col text-center items-center">
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 px-3 py-1 bg-emerald-50 rounded-full">
                    {book.author || "SUCF UNEC"}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                    {book.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 font-light leading-relaxed mb-6">
                    {book.description || "Word for the semester."}
                </p>

                <a
                    href={book.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-900 text-white py-4 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-emerald-800 transition-all shadow-lg hover:shadow-emerald-900/30"
                >
                    <FiDownload className="text-sm" /> Download PDF
                </a>
            </div>
        </motion.div>
    );
};

const BooksSection = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBooks = async () => {
        try {
            const { data, error } = await supabase
                .from('books')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);

            if (error) throw error;
            setBooks(data || []);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book?")) return;
        try {
            const { error } = await supabase.from('books').delete().eq('id', id);
            if (error) throw error;
            fetchBooks();
        } catch (error) {
            alert(error.message);
        }
    };

    if (!loading && books.length === 0 && !user?.isAdmin) return null;

    return (
        <section className="py-24 bg-white relative overflow-hidden group/books">
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-emerald-900 rounded-full blur-[150px]"></div>
            </div>

            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-xl text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4"
                        >
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                            Spiritual Resources
                        </motion.div>
                        <h2 className="text-4xl md:text-5xl font-serif text-emerald-900 font-black italic uppercase italic tracking-tight mb-2">
                            Books for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">the Semester</span>
                        </h2>
                        <p className="text-gray-500 font-light max-w-md">Equipping you with the right tools for a victorious walk with God.</p>
                    </div>

                    <Link to="/library" className="group text-emerald-700 font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:text-emerald-900 transition-colors">
                        Explore Full Library
                        <div className="w-10 h-10 rounded-full border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-900 group-hover:text-white transition-all">
                            <FiArrowRight className="text-sm" />
                        </div>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[3/5] bg-gray-50 animate-pulse rounded-[2.5rem] border border-gray-100"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book} isAdmin={user?.isAdmin} onDelete={handleDelete} />
                            ))}
                        </div>
                        {books.length === 0 && user?.isAdmin && (
                            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-[3rem]">
                                <FiBook className="text-5xl text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No books published yet.</p>
                                <Link to="/admin" className="mt-4 inline-block text-emerald-600 font-black text-[10px] uppercase tracking-widest hover:text-emerald-800">Add first book →</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default BooksSection;
