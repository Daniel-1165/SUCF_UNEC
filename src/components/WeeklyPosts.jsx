import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiCalendar, FiClock, FiFileText } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const WeeklyPosts = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('weekly_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching weekly posts:', error);
                setPosts([]);
            } else {
                setPosts(data || []);
            }
        } catch (error) {
            console.error('Error:', error);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            const { error } = await supabase
                .from('weekly_posts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            fetchPosts();
        } catch (error) {
            alert('Error deleting post: ' + error.message);
        }
    };

    // If no posts, don't show section at all
    if (!loading && posts.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-emerald-50/30 relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-[10px] mb-2 block">Spiritual Nourishment</span>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Weekly <span className="text-emerald-600">Posts.</span></h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


                    {loading ? (
                        [1, 2].map(i => (
                            <div key={i} className="bg-slate-100 animate-pulse rounded-[2.5rem] min-h-[400px]" />
                        ))
                    ) : (
                        posts.map((post) => (
                            <motion.div
                                key={post.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                whileHover={{ y: -10 }}
                                className="zeni-card bg-white overflow-hidden group relative flex flex-col aspect-[4/5]"
                            >
                                {user?.isAdmin && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(post.id);
                                        }}
                                        className="absolute top-6 right-6 p-3 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg z-20"
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}

                                {post.image_url ? (
                                    <img
                                        src={post.image_url}
                                        alt="Weekly Post"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <FiFileText size={48} />
                                    </div>
                                )}

                                {/* Overlay gradient for better button visibility if needed */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default WeeklyPosts;
