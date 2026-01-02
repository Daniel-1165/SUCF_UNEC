import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiDownload, FiBook, FiArrowRight, FiTrash2, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, isAdmin, onDelete, isFeatured }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={`${isFeatured ? 'zeni-card-dark' : 'zeni-card'} overflow-hidden flex flex-col group relative h-full`}
        >
            {/* Admin Controls */}
            {isAdmin && (
                <div className="absolute top-6 right-6 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                    <button
                        onClick={(e) => { e.preventDefault(); onDelete(book.id); }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isFeatured ? 'bg-white/10 text-white hover:bg-red-500' : 'bg-white text-red-500 hover:bg-red-500 hover:text-white'}`}
                    >
                        <FiTrash2 />
                    </button>
                    <Link
                        to="/admin"
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isFeatured ? 'bg-white/10 text-white hover:bg-emerald-500' : 'bg-white text-emerald-900 hover:bg-emerald-900 hover:text-white'}`}
                    >
                        <FiPlus />
                    </Link>
                </div>
            )}

            {/* Cover Image Section */}
            <div className={`relative aspect-[4/5] overflow-hidden ${isFeatured ? 'bg-white/5' : 'bg-[#F5F9F7]'}`}>
                {book.image_url ? (
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center opacity-20">
                        <FiBook className="text-7xl mb-4" />
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Info Section */}
            <div className="p-8 flex-grow flex flex-col">
                <div className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isFeatured ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {book.semester || "Semester Read"}
                </div>
                <h3 className={`text-2xl font-bold leading-tight mb-2 line-clamp-2 ${isFeatured ? 'text-white' : 'text-[#00211F]'}`}>
                    {book.title}
                </h3>
                <p className={`text-sm mb-8 line-clamp-2 font-medium opacity-60 ${isFeatured ? 'text-white' : 'text-[#00211F]'}`}>
                    By {book.author || "SUCF UNEC"}
                </p>

                <div className="mt-auto">
                    <a
                        href={book.file_url}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${isFeatured
                            ? 'bg-white text-[#00211F] hover:bg-emerald-400'
                            : 'bg-[#00211F] text-white hover:bg-emerald-800 shadow-xl shadow-emerald-900/10'
                            }`}
                    >
                        <FiDownload /> Download Word
                    </a>
                </div>
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
        <section className="py-32 zeni-mesh-gradient relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                        >
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Spiritual Growth
                        </motion.div>
                        <h2 className="text-5xl md:text-6xl font-black text-[#00211F] leading-none tracking-tighter mb-6">
                            Deepen your <span className="text-emerald-600 italic">Walk.</span>
                        </h2>
                        <p className="text-[#00211F] text-lg font-medium opacity-40 max-w-sm leading-relaxed">Curated resources to nourish your spirit and sharpen your mind.</p>
                    </div>

                    <Link to="/library" className="group flex items-center gap-4">
                        <div className="text-right">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Explore More</span>
                            <span className="block text-sm font-bold text-[#00211F]">Full Library</span>
                        </div>
                        <div className="w-14 h-14 zeni-card flex items-center justify-center text-xl group-hover:bg-[#00211F] group-hover:text-white transition-all transform group-hover:rotate-12">
                            <FiArrowRight />
                        </div>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[3/5] bg-white/50 animate-pulse rounded-[3rem] border border-[#E8F3EF]"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {books.map((book, index) => (
                                <BookCard
                                    key={book.id}
                                    book={book}
                                    isAdmin={user?.isAdmin}
                                    onDelete={handleDelete}
                                    isFeatured={index === 1} // Feature the middle card
                                />
                            ))}
                        </div>
                        {books.length === 0 && user?.isAdmin && (
                            <div className="text-center py-24 zeni-card border-dashed border-2 border-emerald-500/20 mt-12">
                                <FiBook className="text-6xl text-emerald-500/20 mx-auto mb-6" />
                                <p className="text-[#00211F] font-bold uppercase tracking-widest text-xs opacity-40">The library is empty.</p>
                                <Link to="/admin" className="mt-6 inline-flex p-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">Add First Resource</Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default BooksSection;
