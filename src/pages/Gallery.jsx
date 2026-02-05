import React, { useState, useEffect } from 'react';
import { FiX, FiZoomIn, FiTrash2, FiFilter, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';
import ImageLightbox from '../components/ImageLightbox';

const galleryCategories = ['All', 'Events', 'Worship', 'Fellowship', 'Outreach'];

// Static fallback images
const staticImages = [
    { id: 's1', title: 'Worship Session', category: 'Worship', image_url: '/assets/gallery/img1.jpg', size: 'large' },
    { id: 's2', title: 'Sunday Fellowship', category: 'Fellowship', image_url: '/assets/gallery/img2.jpg', size: 'medium' },
    { id: 's3', title: 'Bible Study', category: 'Events', image_url: '/assets/gallery/img3.jpg', size: 'small' },
    { id: 's4', title: 'Street Outreach', category: 'Outreach', image_url: '/assets/gallery/img4.jpg', size: 'medium' },
    { id: 's5', title: 'Praise Night', category: 'Worship', image_url: '/assets/gallery/img5.jpg', size: 'large' },
];

const Gallery = () => {
    const { user } = useAuth();
    const [filter, setFilter] = useState('All');
    const [dbImages, setDbImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const { data, error } = await supabase
                .from('gallery')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setDbImages(data);
        } catch (error) {
            console.error('Error fetching gallery:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Delete this image?')) {
            try {
                const { error } = await supabase
                    .from('gallery')
                    .delete()
                    .eq('id', id);
                if (error) throw error;
                setDbImages(dbImages.filter(img => img.id !== id));
            } catch (error) {
                alert('Error deleting image: ' + error.message);
            }
        }
    };

    const displayImages = filter === 'All'
        ? [...dbImages, ...staticImages]
        : [...dbImages, ...staticImages].filter(img => img.category === filter);

    const getMasonryClass = (index) => {
        const pattern = [
            'md:col-span-2 md:row-span-2', // Large
            'md:col-span-1 md:row-span-1', // Small
            'md:col-span-1 md:row-span-2', // Tall
            'md:col-span-1 md:row-span-1', // Small
            'md:col-span-2 md:row-span-1', // Wide
        ];
        return pattern[index % pattern.length];
    };

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative selection:bg-emerald-500 selection:text-white">
            <SEO
                title="Captured Moments - SUCF UNEC"
                description="Explore our visual journey of worship, fellowship, and outreach at the University of Nigeria, Enugu Campus."
            />

            {/* Lightbox Integration */}
            <ImageLightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                images={displayImages.map(img => img.image_url)}
                initialIndex={lightboxIndex}
            />

            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-900/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        Captured Moments
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-[0.9] mb-8"
                    >
                        Our visual <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">journey.</span>
                    </motion.h1>

                    {/* Filter Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 md:gap-3"
                    >
                        {galleryCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${filter === cat
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-square bg-white/5 animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[300px] gap-4 md:gap-6">
                        <AnimatePresence mode="popLayout">
                            {displayImages.map((img, index) => {
                                const spanClass = getMasonryClass(index);
                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        key={img.id}
                                        onClick={() => openLightbox(index)}
                                        className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 hover:border-emerald-500/50 transition-all duration-500 ${spanClass}`}
                                    >
                                        {/* Image */}
                                        <img
                                            src={img.image_url}
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2 block">
                                                        {img.category}
                                                    </span>
                                                    <h3 className="text-xl font-black italic uppercase leading-none text-white">
                                                        {img.title}
                                                    </h3>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                                                    <FiZoomIn className="text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Admin Delete */}
                                        {user?.isAdmin && (
                                            <button
                                                onClick={(e) => handleDelete(img.id, e)}
                                                className="absolute top-4 right-4 p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl backdrop-blur-md border border-red-500/20 transition-all opacity-0 group-hover:opacity-100 z-30"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
