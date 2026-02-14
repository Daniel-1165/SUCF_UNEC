import AnthemSection from '../components/AnthemSection';
import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiUsers, FiHeart, FiBookOpen, FiPlay, FiGlobe, FiLifeBuoy } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import BooksSection from '../components/BooksSection';
import WeeklyPosts from '../components/WeeklyPosts';
import ArticlesSection from '../components/ArticlesSection';
import NewsSection from '../components/NewsSection';
import { supabase } from '../supabaseClient';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';
import SEO from '../components/SEO';

// Use the assets we have
const heroImages = [
    '/assets/carousel/weekly_activities_schedule.jpg',
    '/assets/carousel/carousel_event_1.jpg',
    '/assets/carousel/carousel_event_2.jpg',
    '/assets/carousel/carousel_event_3.jpg',
    '/assets/carousel/weekly_prayers.jpg',
    '/assets/carousel/bible_study.jpg',
    '/assets/freshers_flyer.jpg',
];

const homeGallery = [
    '/assets/gallery/img1.jpg',
    '/assets/gallery/img2.jpg',
    '/assets/gallery/img3.jpg',
    '/assets/gallery/img4.jpg',
];

const Home = () => {
    const [previewGallery, setPreviewGallery] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchGalleryPreview = async () => {
            try {
                const { data, error } = await supabase
                    .from('gallery')
                    .select('image_url')
                    .order('created_at', { ascending: false })
                    .limit(6);

                if (error) throw error;
                if (data) setPreviewGallery(data.map(item => item.image_url));
            } catch (error) {
                console.error('Error fetching gallery preview:', error);
            } finally {
                setLoadingGallery(false);
            }
        };

        fetchGalleryPreview();
    }, []);

    const [currentSlide, setCurrentSlide] = React.useState(0);
    const heroImageCount = heroImages.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImageCount);
        }, 5000);
        return () => clearInterval(timer);
    }, [heroImageCount]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 bg-grid-pattern overflow-x-hidden font-sans">
            <SEO
                title="The Unique Fellowship"
                description="Experience a community where spiritual growth meets academic excellence at the University of Nigeria, Enugu Campus."
            />
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">

                        {/* Content - Mobile First Priority */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="lg:col-span-6 flex flex-col items-start text-left space-y-6 md:space-y-8 z-20 w-full"
                        >
                            {/* Chip / Tag - Tech Style */}
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                                <span className="text-xs font-medium text-slate-500">Academic Session {currentYear}</span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight text-slate-900"
                            >
                                The <span className="text-emerald-600 inline-block decoration-4 decoration-emerald-200 underline-offset-4">Unique</span> <br />
                                Fellowship <br />
                                on Campus.
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-lg text-slate-500 max-w-md font-medium leading-relaxed border-l-4 border-emerald-500 pl-4">
                                Experience a community where spiritual growth meets academic excellence. Welcome to the family.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2 w-full">
                                <Link
                                    to="/signup"
                                    className="flex-1 sm:flex-none justify-center px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm uppercase tracking-wide hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-900/10 flex items-center gap-3"
                                >
                                    Get Started <FiArrowRight />
                                </Link>
                            </motion.div>
                        </motion.div>

                        {/* Image/Carousel Section - Futuristic Card Style */}
                        <div className="lg:col-span-6 w-full relative h-[400px] md:h-[500px] lg:h-[700px] z-10">
                            {/* Abstract Deco Elements */}
                            <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />

                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl shadow-slate-200 transform md:rotate-2 hover:rotate-0 transition-all duration-700 bg-white">
                                <AnimatePresence mode='wait'>
                                    {/* Background Blur Layer */}
                                    <motion.div
                                        key={`bg-${currentSlide}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.5 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 w-full h-full bg-cover bg-center blur-2xl scale-110"
                                        style={{ backgroundImage: `url(${heroImages[currentSlide]})` }}
                                    />

                                    <motion.img
                                        key={currentSlide}
                                        src={heroImages[currentSlide]}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={(e, { offset, velocity }) => {
                                            const swipeThreshold = 50;
                                            if (offset.x > swipeThreshold) {
                                                setCurrentSlide((prev) => (prev - 1 + heroImageCount) % heroImageCount);
                                            } else if (offset.x < -swipeThreshold) {
                                                setCurrentSlide((prev) => (prev + 1) % heroImageCount);
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing z-10"
                                        alt="SUCF Moments"
                                    />
                                </AnimatePresence>

                                {/* Overlay Interface UI */}
                                <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white/90 z-20">
                                    <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs font-bold uppercase tracking-wider">
                                        Highlights
                                    </div>
                                    <div className="flex gap-1">
                                        {heroImages.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Arrow Link Only */}
                                <Link to="/activities" className="absolute bottom-6 right-6 w-14 h-14 bg-white/90 backdrop-blur-xl rounded-full shadow-lg border border-white/50 flex items-center justify-center text-slate-900 hover:bg-emerald-600 hover:text-white transition-all z-20 group">
                                    <FiArrowRight className="text-xl group-hover:scale-110 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CountdownTimer />

            <AnthemSection />

            {/* Mission Section (Based on User's Image 1) */}
            <section className="py-24 bg-white relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16 relative">
                        {/* Faded Background Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-9xl font-black text-slate-100 uppercase tracking-widest opacity-60 pointer-events-none select-none">
                            Mission
                        </div>

                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block relative z-10">Our Mandate</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 relative z-10">The Four Pillars</h2>
                    </div>

                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {[
                            { icon: <FiBookOpen />, title: "Bible Study", color: "text-emerald-600" },
                            { icon: <FiHeart />, title: "Prayer", color: "text-emerald-600" },
                            { icon: <FiGlobe />, title: "Evangelism", color: "text-emerald-600" },
                            { icon: <FiLifeBuoy />, title: "Righteousness", color: "text-emerald-600" }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                variants={fadeInUp}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center group transition-all hover:border-emerald-500/30"
                            >
                                <div className={`text-4xl lg:text-5xl mb-6 ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-lg lg:text-xl font-bold text-slate-800">{item.title}</h3>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <WeeklyPosts />
            {/* Articles Section */}
            <ArticlesSection />

            <BooksSection />
            {/* News Section */}
            <NewsSection />

            {/* Gallery Strip */}
            <section className="py-20 overflow-hidden bg-white">
                <div className="container mx-auto px-6 mb-10 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-900">Captured Moments</h2>
                    <Link to="/gallery" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><FiArrowRight /></Link>
                </div>
                <div className="flex gap-4 overflow-x-auto px-6 pb-10 no-scrollbar snap-x">
                    {loadingGallery ? (
                        [1, 2, 3, 4].map(i => <div key={i} className="min-w-[200px] aspect-square bg-slate-100 animate-pulse rounded-2xl" />)
                    ) : previewGallery.length > 0 ? (
                        previewGallery.map((img, i) => (
                            <div key={i} className="min-w-[200px] md:min-w-[250px] aspect-square rounded-2xl overflow-hidden snap-center shadow-lg border-4 border-white">
                                <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))
                    ) : (
                        homeGallery.map((img, i) => (
                            <div key={i} className="min-w-[200px] md:min-w-[250px] aspect-square rounded-2xl overflow-hidden snap-center shadow-lg border-4 border-white">
                                <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
