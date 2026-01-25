import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiDownload, FiBook, FiArrowRight, FiTrash2, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


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
        <section className="py-32 relative overflow-hidden bg-white">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="section-tag mb-8 !bg-emerald-50 !border-emerald-100 !text-emerald-600"
                        >
                            Curated Knowledge
                        </motion.div>
                        <h2 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tight mb-10 uppercase italic">
                            Wisdom <br />
                            <span className="text-emerald-600">Archived.</span>
                        </h2>
                        <p className="text-slate-500 text-xl font-medium max-w-sm leading-relaxed">Spiritual nourishment through literature, handpicked for your growth.</p>
                    </div>

                    <Link to="/library" className="group flex items-center gap-4">
                        <div className="text-right">
                            <span className="block text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Explore More</span>
                        </div>
                        <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center text-xl text-white group-hover:bg-white group-hover:text-[#022c22] transition-all transform group-hover:rotate-12">
                            <FiArrowRight />
                        </div>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-12">
                        {[1, 2].map(i => (
                            <div key={i} className="h-[400px] bg-white/5 animate-pulse rounded-[3rem] border border-white/10"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-16 lg:gap-24">
                        {books.map((book, index) => (
                            <motion.div
                                key={book.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: 0.8,
                                    delay: index * 0.2,
                                    ease: [0.22, 1, 0.36, 1]
                                }}
                                className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-20 group"
                            >
                                {/* Admin Controls - Repositioned */}
                                {user?.isAdmin && (
                                    <div className="absolute top-0 right-0 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-all p-4">
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleDelete(book.id); }}
                                            className="w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                        >
                                            <FiTrash2 />
                                        </button>
                                        <Link
                                            to="/admin"
                                            className="w-12 h-12 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-all"
                                        >
                                            <FiPlus />
                                        </Link>
                                    </div>
                                )}

                                {/* Book Image Section - Now MUCH larger */}
                                <motion.div
                                    whileHover={{ y: -15, rotate: 2 }}
                                    className="w-full lg:w-[400px] shrink-0"
                                >
                                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10 bg-white border border-slate-100 group-hover:border-emerald-500/30 transition-colors">
                                        {book.image_url ? (
                                            <img
                                                src={book.image_url}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center">
                                                <FiBook className="text-9xl text-emerald-100" />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                {/* Content Section */}
                                <div className="flex-grow space-y-4 md:space-y-8 max-w-2xl text-center lg:text-left">
                                    <div>
                                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                                            <span className="h-[1px] w-8 bg-emerald-500 hidden lg:block"></span>
                                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-[0.3em]">
                                                {book.author || "SUCF UNEC Publication"}
                                            </p>
                                        </div>
                                        <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-[1.1] uppercase italic tracking-tighter">
                                            {book.title}
                                        </h3>
                                        <p className="text-sm md:text-xl text-slate-500 font-medium leading-relaxed">
                                            {book.description || "A transformative spiritual resource curated specifically for our fellowship members."}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
                                        <a
                                            href={book.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-10 py-5 bg-emerald-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/10 flex items-center gap-4 group/btn active:scale-95"
                                        >
                                            <FiDownload className="text-lg group-hover/btn:translate-y-1 transition-transform" />
                                            Acquire Resource
                                        </a>
                                        <div className="flex flex-col items-center lg:items-start opacity-30">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Semester</span>
                                            <span className="text-sm font-bold text-white">Alpha Session</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default BooksSection;
