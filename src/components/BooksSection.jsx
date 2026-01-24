import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiDownload, FiBook, FiArrowRight, FiTrash2, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BookCard = ({ book, isAdmin, onDelete, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
            }}
            className="flex flex-col gap-6 group"
        >
            {/* Admin Controls */}
            {isAdmin && (
                <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                        onClick={(e) => { e.preventDefault(); onDelete(book.id); }}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center shadow-lg transition-all"
                    >
                        <FiTrash2 />
                    </button>
                    <Link
                        to="/admin"
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center shadow-lg transition-all"
                    >
                        <FiPlus />
                    </Link>
                </div>
            )}

            {/* Book Cover with Overlay Button */}
            <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl"
            >
                {book.image_url ? (
                    <img
                        src={book.image_url}
                        alt={book.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                        <FiBook className="text-8xl text-white/30" />
                    </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Semester Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                    <span className="text-[9px] font-black uppercase tracking-wider text-white">
                        {book.semester || "2026/1"}
                    </span>
                </div>

                {/* Download Button Overlay */}
                <a
                    href={book.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 bg-white/95 backdrop-blur-md rounded-full font-bold text-sm text-[#00211F] hover:bg-white hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                >
                    <FiDownload className="text-base" />
                    Read
                </a>
            </motion.div>

            {/* Glassmorphic Info Card */}
            <div className="bg-white/40 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white/60 shadow-lg">
                <p className="text-xs font-bold text-emerald-600/70 uppercase tracking-wider mb-2">
                    {book.semester || "Semester Read"}
                </p>
                <h3 className="text-xl font-bold text-[#00211F] mb-1 line-clamp-1">
                    {book.title}
                </h3>
                <p className="text-sm text-[#00211F]/60 font-medium">
                    {book.author || "SUCF UNEC"}
                </p>
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
                            Books for the Session to Deepen your <span className="text-emerald-600 italic">Walk.</span>
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="aspect-[3/5] bg-white/50 animate-pulse rounded-[3rem] border border-[#E8F3EF]"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {books.length > 0 ? (
                            <div className="grid grid-cols-2 gap-8">
                                {books.slice(0, 2).map((book, index) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        isAdmin={user?.isAdmin}
                                        onDelete={handleDelete}
                                        index={index}
                                    />
                                ))}
                                {books.length === 3 && (
                                    <div className="col-span-2 flex justify-center">
                                        <div className="w-full sm:w-1/2">
                                            <BookCard
                                                book={books[2]}
                                                isAdmin={user?.isAdmin}
                                                onDelete={handleDelete}
                                                index={2}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-24 zeni-card border-dashed border-2 border-emerald-500/20">
                                <FiBook className="text-6xl text-emerald-500/20 mx-auto mb-6" />
                                {user?.isAdmin ? (
                                    <>
                                        <p className="text-[#00211F] font-bold uppercase tracking-widest text-xs opacity-40 mb-6">The library is empty.</p>
                                        <Link to="/admin" className="inline-flex p-4 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all">Add First Resource</Link>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-[#00211F] font-bold uppercase tracking-widest text-xs opacity-40 mb-2">Library Coming Soon</p>
                                        <p className="text-[#00211F] text-sm opacity-30 max-w-md mx-auto">Our leadership is curating spiritual resources for this semester. Check back soon!</p>
                                    </>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default BooksSection;
