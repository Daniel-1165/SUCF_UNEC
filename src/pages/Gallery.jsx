import React, { useState, useEffect } from 'react';
import { FiX, FiZoomIn, FiTrash2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

const galleryCategories = ['All', 'Events', 'Worship', 'Fellowship', 'Outreach'];

// Static fallback images
const staticImages = [
    { id: 's1', title: 'Worship Session', category: 'Worship', image_url: '/assets/gallery/img1.jpg' },
    { id: 's2', title: 'Fellowship Moments', category: 'Fellowship', image_url: '/assets/gallery/img2.jpg' },
    { id: 's3', title: 'Bible Study Group', category: 'Events', image_url: '/assets/gallery/img3.jpg' },
    { id: 's4', title: 'Outdoor Outreach', category: 'Outreach', image_url: '/assets/gallery/img4.jpg' },
    { id: 's5', title: 'Prayer Meeting', category: 'Worship', image_url: '/assets/gallery/img5.jpg' },
    { id: 's6', title: 'Freshers Welcome', category: 'Events', image_url: '/assets/gallery/img6.jpg' },
    { id: 's7', title: 'Group Photo', category: 'Fellowship', image_url: '/assets/gallery/img7.jpg' },
    { id: 's8', title: 'Sunday Glory', category: 'Worship', image_url: '/assets/gallery/img8.jpg' },
    { id: 's9', title: 'Evangelism Drive', category: 'Outreach', image_url: '/assets/gallery/img9.jpg' },
    { id: 's10', title: 'Mid-week Recharge', category: 'Worship', image_url: '/assets/gallery/img10.jpg' },
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
        e.stopPropagation(); // Don't open lightbox
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

    return (
        <div className="pt-32 pb-20 min-h-screen zeni-mesh-gradient text-[#00211F] selection:bg-emerald-500 selection:text-white">
            <div className="container mx-auto px-6">
                <header className="text-center mb-16 md:mb-24 max-w-3xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
                    >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Visual Chronicles
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter text-[#00211F] leading-none uppercase italic">
                        The <span className="text-emerald-600">Gallery.</span>
                    </h1>
                    <p className="text-[#00211F] opacity-40 text-lg md:text-xl font-medium leading-relaxed">
                        A cinematic journey through moments of grace and fellowship.
                    </p>
                </header>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 md:mb-20">
                    {galleryCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 md:px-10 py-3 md:py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${filter === cat
                                ? 'bg-[#00211F] text-white border-[#00211F] shadow-xl'
                                : 'bg-white/50 text-[#00211F] border-[#E8F3EF] hover:border-emerald-300'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[250px]">
                    <AnimatePresence mode="popLayout">
                        {displayImages.map((img, index) => {
                            // Bento item spanning logic - simplified for better mobile behavior
                            let spanClass = "col-span-1 row-span-1";
                            if (index % 7 === 0) spanClass = "md:col-span-2 md:row-span-2";
                            else if (index % 7 === 3) spanClass = "md:col-span-2 md:row-span-1";
                            else if (index % 7 === 5) spanClass = "md:row-span-2";

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={img.id}
                                    className={`group zeni-card !p-0 overflow-hidden cursor-pointer border-[10px] border-white ${spanClass}`}
                                    onClick={() => setSelectedImage(img)}
                                >
                                    {/* Image wrapper */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={img.image_url}
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                        />
                                    </div>

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00211F]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />

                                    {/* Content */}
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        {user?.isAdmin && !img.id.toString().startsWith('s') && (
                                            <button
                                                onClick={(e) => handleDelete(e, img.id)}
                                                className="absolute top-6 right-6 p-3 bg-red-600 text-white rounded-2xl shadow-xl z-20"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        )}
                                        <div className="relative z-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                            <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 mb-2 block">
                                                {img.category || 'Archive'}
                                            </span>
                                            <h3 className="text-xl md:text-2xl font-black text-white italic uppercase leading-none mb-2">
                                                {img.title || img.caption || 'Fellowship Moment'}
                                            </h3>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-emerald-950/95 backdrop-blur-md flex items-center justify-center p-6 md:p-12"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button className="absolute top-8 right-8 text-white w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-2xl group">
                            <FiX className="group-hover:rotate-90 transition-transform" />
                        </button>

                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-6xl w-full h-[80vh] rounded-[2.5rem] overflow-hidden shadow-2xl bg-black"
                            onClick={e => e.stopPropagation()}
                        >
                            <img src={selectedImage.image_url} alt={selectedImage.title} className="w-full h-full object-contain" />
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-10 text-white">
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">{selectedImage.category}</span>
                                <h3 className="text-3xl md:text-5xl font-serif font-bold">{selectedImage.title}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
