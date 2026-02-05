import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiDownload, FiMaximize } from 'react-icons/fi';

const ImageLightbox = ({ isOpen, onClose, images, initialIndex = 0 }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [zoom, setZoom] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setZoom(1);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, initialIndex]);

    const handleNext = useCallback((e) => {
        e?.stopPropagation();
        setZoom(1);
        setIsLoaded(false);
        setCurrentIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handlePrev = useCallback((e) => {
        e?.stopPropagation();
        setZoom(1);
        setIsLoaded(false);
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') onClose();
    }, [isOpen, handleNext, handlePrev, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const handleDownload = (e) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = images[currentIndex];
        link.download = `sucf-gallery-${currentIndex}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center select-none"
                onClick={onClose}
            >
                {/* Header Controls */}
                <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[110]" onClick={e => e.stopPropagation()}>
                    <div className="text-white/70 text-xs font-black uppercase tracking-[0.3em] bg-white/5 px-4 py-2 rounded-full backdrop-blur-md">
                        {currentIndex + 1} <span className="text-white/30 px-1">/</span> {images.length}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setZoom(prev => Math.min(prev + 0.5, 3))}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-md"
                            title="Zoom In"
                        >
                            <FiZoomIn size={20} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all backdrop-blur-md"
                            title="Download"
                        >
                            <FiDownload size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white transition-all shadow-lg shadow-emerald-600/20 ml-2"
                        >
                            <FiX size={24} />
                        </button>
                    </div>
                </div>

                {/* Main Image Container */}
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: zoom, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="relative flex items-center justify-center p-4 md:p-12 w-full h-full"
                        >
                            {!isLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                </div>
                            )}
                            <img
                                src={images[currentIndex]}
                                alt={`Gallery item ${currentIndex + 1}`}
                                className={`max-w-full max-h-full object-contain shadow-2xl transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                                onDragStart={e => e.preventDefault()}
                                onLoad={() => setIsLoaded(true)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setZoom(z => z === 1 ? 2 : 1);
                                }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <button
                        onClick={handlePrev}
                        className="absolute left-4 md:left-8 p-4 md:p-6 bg-white/5 hover:bg-white/10 hover:scale-110 rounded-full text-white transition-all backdrop-blur-md z-[110]"
                    >
                        <FiChevronLeft size={32} />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-4 md:right-8 p-4 md:p-6 bg-white/5 hover:bg-white/10 hover:scale-110 rounded-full text-white transition-all backdrop-blur-md z-[110]"
                    >
                        <FiChevronRight size={32} />
                    </button>
                </div>

                {/* Thumbnail Strip (Optional, for better UX) */}
                <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 gap-3 p-3 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 z-[110]" onClick={e => e.stopPropagation()}>
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setIsLoaded(false);
                                setCurrentIndex(idx);
                                setZoom(1);
                            }}
                            className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentIndex === idx ? 'border-emerald-500 scale-110' : 'border-transparent opacity-40 hover:opacity-80'
                                }`}
                        >
                            <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageLightbox;
