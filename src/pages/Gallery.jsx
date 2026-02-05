import React, { useState, useEffect } from 'react';
import { FiX, FiZoomIn, FiTrash2, FiFilter, FiImage } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const galleryCategories = ['All', 'Events', 'Worship', 'Fellowship', 'Outreach'];

// Static fallback images
const staticImages = [
    { id: 's1', title: 'Worship Session', category: 'Worship', image_url: '/assets/gallery/img1.jpg', size: 'large' },
    { id: 's2', title: 'Fellowship', category: 'Fellowship', image_url: '/assets/gallery/img2.jpg', size: 'tall' },
    { id: 's3', title: 'Bible Study', category: 'Events', image_url: '/assets/gallery/img3.jpg', size: 'normal' },
    { id: 's4', title: 'Outreach', category: 'Outreach', image_url: '/assets/gallery/img4.jpg', size: 'wide' },
    { id: 's5', title: 'Prayer', category: 'Worship', image_url: '/assets/gallery/img5.jpg', size: 'normal' },
    { id: 's6', title: 'Welcome', category: 'Events', image_url: '/assets/gallery/img6.jpg', size: 'tall' },
    { id: 's7', title: 'Group Photo', category: 'Fellowship', image_url: '/assets/gallery/img7.jpg', size: 'large' },
    { id: 's8', title: 'Sunday Glory', category: 'Worship', image_url: '/assets/gallery/img8.jpg', size: 'wide' },
    { id: 's9', title: 'Evangelism', category: 'Outreach', image_url: '/assets/gallery/img9.jpg', size: 'normal' },
    { id: 's10', title: 'Mid-week', category: 'Worship', image_url: '/assets/gallery/img10.jpg', size: 'tall' },
];

const Gallery = () => {
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('All');
    const [dbImages, setDbImages] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setDbImages(data || []);
        } catch (error) {
            console.error("Error fetching gallery:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this image?")) return;

        try {
            const { error } = await supabase.from('gallery').delete().eq('id', id);
            if (error) throw error;
            setDbImages(prev => prev.filter(img => img.id !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    const allImages = [...dbImages, ...staticImages.filter(si => !dbImages.some(di => di.caption === si.title))];

    const displayImages = filter === 'All'
        ? allImages
        : allImages.filter(img => img.category === filter || (filter === 'Events' && !img.category));

    // Helper to get random span classes for dynamic look if not pre-assigned
    const getSpanClass = (index, size) => {
        if (size) {
            if (size === 'large') return 'md:col-span-2 md:row-span-2';
            if (size === 'wide') return 'md:col-span-2 md:row-span-1';
            if (size === 'tall') return 'md:col-span-1 md:row-span-2';
            return 'md:col-span-1 md:row-span-1';
        }
        // Fallback procedural generation
        const pattern = index % 10;
        if (pattern === 0) return 'md:col-span-2 md:row-span-2'; // Big Feature
        if (pattern === 3) return 'md:col-span-1 md:row-span-2'; // Tall
        if (pattern === 6) return 'md:col-span-2 md:row-span-1'; // Wide
        return 'md:col-span-1 md:row-span-1'; // Standard
    };

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative selection:bg-emerald-500 selection:text-white">
            <SEO
                title="Captured Moments"
                description="Explore our visual journey of worship, fellowship, and outreach at the University of Nigeria, Enugu Campus."
            />
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-900/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                        >
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                            Visual Chronicles
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">
                            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Gallery</span>.
                        </h1>
                        <p className="text-gray-400 max-w-md text-lg font-medium">
                            Capturing the spirit of fellowship, worship, and student life at SUCF UNEC.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap gap-2 justify-end">
                        {galleryCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${filter === cat
                                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Masonry Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px] grid-flow-dense">
                    <AnimatePresence mode="popLayout">
                        {displayImages.map((img, index) => {
                            const spanClass = getSpanClass(index, img.size);
                            const isDark = index % 2 === 0; // Alternating subtle styles

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={img.id}
                                    onClick={() => setSelectedImage(img)}
                                    className={`group relative rounded-3xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 hover:border-emerald-500/50 transition-all duration-500 ${spanClass}`}
                                >
                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={img.image_url}
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                                        />
                                    </div>

                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-black/90 via-black/20' : 'from-emerald-950/90 via-emerald-900/20'} to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500`} />

                                    {/* Hover Reveal Overlay (Color Tint) */}
                                    <div className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />

                                    {/* Content Info */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 mb-2 block opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                                    {img.category || 'Archive'}
                                                </span>
                                                <h3 className="text-xl md:text-2xl font-black text-white uppercase italic leading-none drop-shadow-lg">
                                                    {img.title || img.caption || 'Moment'}
                                                </h3>
                                            </div>

                                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                                                <FiZoomIn />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Admin Delete */}
                                    {user?.isAdmin && !img.id.toString().startsWith('s') && (
                                        <button
                                            onClick={(e) => handleDelete(e, img.id)}
                                            className="absolute top-4 right-4 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-xl backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <FiTrash2 size={16} />
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {displayImages.length === 0 && !loading && (
                    <div className="text-center py-32 border-2 border-dashed border-white/10 rounded-[3rem]">
                        <FiImage className="text-6xl text-white/20 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">No images found</h3>
                        <p className="text-gray-500">Try selecting a different category.</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
                            <FiX size={32} />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-7xl w-full max-h-[90vh] flex flex-col md:flex-row bg-[#0A0A0A] rounded-3xl overflow-hidden shadow-2xl border border-white/5"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Full Image */}
                            <div className="flex-grow relative bg-black/50 flex items-center justify-center p-4">
                                <img
                                    src={selectedImage.image_url}
                                    alt={selectedImage.title}
                                    className="max-w-full max-h-[80vh] object-contain shadow-2xl"
                                />
                            </div>

                            {/* Sidebar Info */}
                            <div className="w-full md:w-80 bg-[#111] p-8 shrink-0 border-l border-white/5 flex flex-col justify-center">
                                <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em] mb-4">
                                    {selectedImage.category || 'Gallery Item'}
                                </span>
                                <h3 className="text-3xl font-black text-white italic uppercase leading-none mb-6">
                                    {selectedImage.title || selectedImage.caption}
                                </h3>
                                <div className="h-1 w-12 bg-emerald-600 rounded-full mb-6" />
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Captured moment from our fellowship life. We cherish every opportunity to gather in His name.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
