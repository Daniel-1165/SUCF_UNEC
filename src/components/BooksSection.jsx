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
        <section className="py-20 bg-white relative">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Recommended For You</h2>
                        <p className="text-slate-400 font-medium">Top picks for your spiritual growth.</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                            <FiArrowRight className="rotate-180" />
                        </button>
                        <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-all">
                            <FiArrowRight />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-slate-50 animate-pulse rounded-3xl border border-slate-100"></div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {books.length > 0 ? (
                            books.map((book, index) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white border border-slate-100 rounded-[2rem] p-4 flex flex-col sm:flex-row gap-6 hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100 transition-all group"
                                >
                                    {/* Book Image */}
                                    <div className="w-full sm:w-40 h-48 sm:h-auto shrink-0 rounded-2xl overflow-hidden bg-slate-100 relative">
                                        {book.image_url ? (
                                            <img
                                                src={book.image_url}
                                                alt={book.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-200">
                                                <FiBook size={40} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-grow flex flex-col justify-center py-2 pr-4">
                                        <div className="mb-auto">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2 block">Trending</span>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{book.title}</h3>
                                            <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">{book.author || "SUCF UNEC"}</p>
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <a
                                                href={book.file_url}
                                                download
                                                className="text-slate-900 font-bold text-sm flex items-center gap-2 group/link hover:text-emerald-600 transition-colors"
                                            >
                                                Read Now <FiArrowRight className="group-hover/link:translate-x-1 transition-transform" />
                                            </a>

                                            {/* Admin Actions */}
                                            {user?.isAdmin && (
                                                <button
                                                    onClick={(e) => { e.preventDefault(); handleDelete(book.id); }}
                                                    className="text-red-400 hover:text-red-600 p-2"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
                                <FiBook className="text-4xl text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-500 font-medium italic">No recommended books found in the library yet.</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-20 text-center">
                    <Link
                        to="/library"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl"
                    >
                        View Full Library <FiArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BooksSection;
