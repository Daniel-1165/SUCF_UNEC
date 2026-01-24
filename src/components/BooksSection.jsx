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
        <section className="py-32 zeni-mesh-gradient relative overflow-hidden">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="section-tag mb-8 bg-emerald-100/50 border-emerald-200 text-emerald-700"
                        >
                            Curated Knowledge
                        </motion.div>
                        <h2 className="text-5xl md:text-8xl font-black text-[#00211F] leading-[0.85] tracking-tight mb-10 uppercase italic">
                            Wisdom <br />
                            <span className="text-emerald-600">Archived.</span>
                        </h2>
                        <p className="text-[#00211F] text-xl font-medium opacity-40 max-w-sm leading-relaxed">Spiritual nourishment through literature, handpicked for your growth.</p>
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
                    <div className="grid grid-cols-1 gap-12">
                        {[1, 2].map(i => (
                            <div key={i} className="h-[400px] bg-white/50 animate-pulse rounded-[3rem] border border-[#E8F3EF]"></div>
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
                                            className="w-12 h-12 rounded-2xl bg-white shadow-2xl text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                                        >
                                            <FiTrash2 />
                                        </button>
                                        <Link
                                            to="/admin"
                                            className="w-12 h-12 rounded-2xl bg-white shadow-2xl text-emerald-600 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
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
                                    <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,33,31,0.2)] bg-emerald-950 border-[6px] border-white">
                                        {book.image_url ? (
                                            <img
                                                src={book.image_url}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-800 to-[#00211F] flex items-center justify-center">
                                                <FiBook className="text-9xl text-white/5" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                                    </div>
                                </motion.div>

                                {/* Content Section */}
                                <div className="flex-grow space-y-8 max-w-2xl text-center lg:text-left">
                                    <div>
                                        <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                                            <span className="h-[2px] w-8 bg-emerald-500 hidden lg:block"></span>
                                            <p className="text-xs text-emerald-600 font-black uppercase tracking-[0.3em]">
                                                {book.author || "SUCF UNEC Publication"}
                                            </p>
                                        </div>
                                        <h3 className="text-4xl md:text-6xl font-black text-[#00211F] mb-6 leading-[0.9] uppercase italic tracking-tighter">
                                            {book.title}
                                        </h3>
                                        <p className="text-lg md:text-xl text-[#00211F] opacity-40 font-medium leading-relaxed italic">
                                            {book.description || "A transformative spiritual resource curated specifically for our fellowship members."}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-6">
                                        <a
                                            href={book.file_url}
                                            download
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-10 py-5 bg-[#00211F] text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-900/20 flex items-center gap-4 group/btn active:scale-95"
                                        >
                                            <FiDownload className="text-lg group-hover/btn:translate-y-1 transition-transform" />
                                            Acquire Resource
                                        </a>
                                        <div className="flex flex-col items-center lg:items-start opacity-30">
                                            <span className="text-[10px] font-black uppercase tracking-widest">Semester</span>
                                            <span className="text-sm font-bold text-[#00211F]">Alpha Session</span>
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
