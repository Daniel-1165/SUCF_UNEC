import AnthemSection from '../components/AnthemSection';
import React, { useState, useEffect, useRef } from 'react';
import { FiArrowRight, FiUsers, FiHeart, FiBookOpen, FiPlay, FiGlobe, FiLifeBuoy, FiClock, FiMaximize2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import BooksSection from '../components/BooksSection';
import NewsSection from '../components/NewsSection';
import { fadeInUp, staggerContainer } from '../utils/animations';
import SEO from '../components/SEO';
import ImageLightbox from '../components/ImageLightbox';
import { supabase } from '../supabaseClient';

const DiagnosticBanner = () => {
    const [status, setStatus] = useState('Checking...');
    const [counts, setCounts] = useState({ news: 0, gallery: 0, articles: 0 });

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true });
                const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
                const { count: articlesCount } = await supabase.from('articles').select('*', { count: 'exact', head: true });

                setCounts({ news: newsCount || 0, gallery: galleryCount || 0, articles: articlesCount || 0 });
                setStatus('Connected ✅');
            } catch (err) {
                setStatus('Error: ' + err.message);
            }
        };
        checkConnection();
    }, []);

    if (!import.meta.env.DEV) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[9999] bg-slate-900/90 text-white p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl text-[10px] font-mono">
            <p className="font-bold text-emerald-400 mb-2 uppercase tracking-widest">Supabase Diagnostics</p>
            <p>Status: {status}</p>
            <p>News: {counts.news}</p>
            <p>Gallery: {counts.gallery}</p>
            <p>Articles: {counts.articles}</p>
        </div>
    );
};

// Use the assets we have
const heroImages = [
    '/assets/hero/hero1.jpg',
    '/assets/hero/hero2.jpg',
    '/assets/hero/hero3.jpg',
    '/assets/hero/hero4.jpg'
];

const homeGallery = [
    '/assets/gallery/img1.jpg',
    '/assets/gallery/img2.jpg',
    '/assets/gallery/img3.jpg',
    '/assets/gallery/img4.jpg',
    '/assets/gallery/img5.jpg'
];

const Home = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroImageCount = heroImages.length;
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);
    const [previewGallery, setPreviewGallery] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(true);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const currentYear = new Date().getFullYear();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(3);

                if (error) throw error;
                if (data) setArticles(data);
            } catch (error) {
                console.error('Error fetching articles:', error.message);
            } finally {
                setLoadingArticles(false);
            }
        };

        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from('gallery')
                    .select('image_url')
                    .order('created_at', { ascending: false })
                    .limit(8);

                if (error) throw error;
                if (data) setPreviewGallery(data.map(item => item.image_url));
            } catch (error) {
                console.error('Error fetching gallery:', error.message);
            } finally {
                setLoadingGallery(false);
            }
        };

        fetchArticles();
        fetchGallery();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImageCount);
        }, 6000);
        return () => clearInterval(timer);
    }, [heroImageCount]);

    const openLightbox = (index) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 bg-dots-pattern overflow-x-hidden font-sans selection:bg-emerald-500 selection:text-white">
            <DiagnosticBanner />
            <SEO
                title="The Unique Fellowship"
                description="Experience a community where spiritual growth meets academic excellence at the University of Nigeria, Enugu Campus."
            />

            <ImageLightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                images={previewGallery.length > 0 ? previewGallery : homeGallery}
                initialIndex={lightboxIndex}
            />

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">

                        {/* Content - Mobile First Priority */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="lg:col-span-6 flex flex-col items-start text-left space-y-6 md:space-y-8 w-full"
                        >
                            {/* Chip / Tag */}
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-emerald-100 rounded-full shadow-sm hover:shadow-md transition-shadow cursor-default">
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Session {currentYear}</span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-slate-900"
                            >
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400 inline-block">Unique</span> <br />
                                Fellowship <br />
                                on Campus.
                            </motion.h1>

                            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-500 max-w-lg font-medium leading-relaxed">
                                Join a vibrant community where <span className="text-emerald-700 font-bold">spiritual growth</span> meets <span className="text-slate-800 font-bold">academic excellence</span>. Welcome to the family.
                            </motion.p>

                            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 pt-2 w-full">
                                <Link
                                    to="/signup"
                                    className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 flex items-center gap-3"
                                >
                                    Get Started <FiArrowRight />
                                </Link>
                                <Link
                                    to="/about"
                                    className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all hover:border-slate-300"
                                >
                                    Learn More
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={fadeInUp} className="pt-8 flex gap-8 border-t border-slate-100 w-full">
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900">500+</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Members</p>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-slate-900">Weekly</h4>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activities</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Image/Carousel Section - Modern Card Style */}
                        <div className="lg:col-span-6 w-full relative h-[400px] md:h-[500px] lg:h-[650px] z-10 perspective-1000">
                            {/* Animated Background Elements */}
                            <motion.div style={{ y: y1 }} className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse pointer-events-none" />
                            <motion.div style={{ y: y1 }} className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse delay-700 pointer-events-none" />

                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl shadow-slate-200/50 bg-white">
                                <AnimatePresence mode='wait'>
                                    <motion.img
                                        key={currentSlide}
                                        src={heroImages[currentSlide]}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.7 }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="SUCF Moments"
                                    />
                                </AnimatePresence>

                                {/* Gradient Overlay for text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                                {/* Overlay UI */}
                                <div className="absolute bottom-8 left-8 right-8 text-white z-20">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-xs font-bold uppercase tracking-widest text-emerald-300 mb-2">Featured</p>
                                            <h3 className="text-2xl font-bold leading-tight">Capturing Moments<br />of Fellowship</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            {heroImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentSlide(idx)}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating decorative card */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -bottom-6 -left-6 md:bottom-10 md:-left-10 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 border border-emerald-50 z-30"
                            >
                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                    <FiHeart className="fill-current" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Join Us</p>
                                    <p className="text-slate-900 font-bold">Every Sunday</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <CountdownTimer />

            <AnthemSection />

            {/* Mission Section - BENTO GRID LAYOUT */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our DNA</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">The Four Pillars</h2>
                        </div>
                        <p className="max-w-md text-slate-500 text-lg">
                            The core values that define our fellowship and guide our spiritual journey together.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[600px]">
                        {/* Large Card 1 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-2 bg-emerald-50 rounded-[2.5rem] p-10 relative overflow-hidden group border border-emerald-100"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all" />
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl text-emerald-600 shadow-sm mb-6">
                                    <FiBookOpen />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-bold text-emerald-950 mb-4">Bible Study</h3>
                                    <p className="text-emerald-800/70 text-lg leading-relaxed max-w-lg">
                                        We are committed to the systematic study of God's Word, believing it is the ultimate authority for doctrine and life.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tall Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group text-white md:row-span-2 flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950" />
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-all" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-3xl text-white shadow-sm mb-6">
                                    <FiHeart />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Prayer</h3>
                                <div className="w-12 h-1 bg-purple-500 rounded-full mb-6" />
                            </div>
                            <p className="relative z-10 text-slate-400 leading-relaxed">
                                A praying family is a winning family. We believe in the power of fervent, effectual prayer.
                            </p>
                        </motion.div>

                        {/* Medium Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden group border border-slate-200 shadow-xl shadow-slate-100/50"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl text-blue-600 shadow-sm mb-4">
                                <FiGlobe />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Evangelism</h3>
                            <p className="text-slate-500 text-sm">Spreading the good news of Christ to our campus and beyond.</p>
                        </motion.div>

                        {/* Medium Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-[2.5rem] p-10 relative overflow-hidden group border border-slate-200 shadow-xl shadow-slate-100/50"
                        >
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl text-amber-600 shadow-sm mb-4">
                                <FiLifeBuoy />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Righteousness</h3>
                            <p className="text-slate-500 text-sm">Living a life that honors God in character and conduct.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <NewsSection />

            {/* Articles - Masonry / Magazine Layout */}
            <section className="py-24 bg-slate-50 relative">
                {/* Modern Grid Background */}
                <div className="absolute inset-0 bg-grid-pattern opacity-30" />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">Editorials</h2>
                            <p className="text-slate-500 font-medium">Insights and growth for your spirit.</p>
                        </div>
                        <Link to="/articles" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white rounded-full font-bold text-xs uppercase tracking-widest border border-slate-200 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">
                            Read All <FiArrowRight />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {loadingArticles ? (
                            [1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-200 rounded-[2rem] animate-pulse" />)
                        ) : articles.map((article, i) => (
                            <Link to={`/articles/${article.id}`} key={article.id} className={`group ${i === 0 ? 'md:col-span-2' : 'md:col-span-1'}`}>
                                <div className="relative rounded-[2rem] overflow-hidden mb-6 h-[300px] md:h-[400px] shadow-lg shadow-slate-200/50">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                    <img
                                        src={article.image_url || 'https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white">
                                        {article.category || 'Article'}
                                    </div>
                                    <div className="absolute bottom-0 left-0 p-8 z-20 text-white">
                                        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-widest opacity-80">
                                            <FiClock /> 5 min read
                                        </div>
                                        <h3 className={`font-bold text-white mb-0 leading-tight group-hover:text-emerald-300 transition-colors ${i === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}`}>
                                            {article.title}
                                        </h3>
                                    </div>
                                </div>
                                <p className="text-slate-500 line-clamp-2 pl-2 text-sm md:text-base">{article.content?.replace(/<[^>]*>/g, '').substring(0, i === 0 ? 200 : 100)}...</p>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/articles" className="inline-flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-xs">
                            View All Editorials <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            <BooksSection />

            {/* Friendly Gallery Strip */}
            <section className="py-24 overflow-hidden bg-white">
                <div className="container mx-auto px-6 mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-2 block">Captured Moments</span>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Gallery</h2>
                    </div>
                    <Link to="/gallery" className="w-14 h-14 rounded-full border-2 border-slate-100 flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">
                        <FiArrowRight size={24} />
                    </Link>
                </div>

                {/* Scrollable Container with nice snap effect */}
                <div className="flex gap-4 md:gap-6 overflow-x-auto px-6 pb-12 pt-4 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
                    {loadingGallery ? (
                        [1, 2, 3, 4, 5].map(i => <div key={i} className="min-w-[280px] h-[350px] bg-slate-100 animate-pulse rounded-[2rem]" />)
                    ) : (
                        (previewGallery.length > 0 ? previewGallery : homeGallery).map((img, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="min-w-[280px] md:min-w-[320px] h-[350px] md:h-[400px] rounded-[2rem] overflow-hidden snap-center shadow-lg shadow-slate-200/50 relative group"
                                onClick={() => openLightbox(i)}
                            >
                                <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                                        <FiMaximize2 />
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                    {/* View All Card */}
                    <div className="min-w-[200px] h-[350px] md:h-[400px] rounded-[2rem] bg-emerald-50 flex items-center justify-center snap-center hover:bg-emerald-100 transition-colors">
                        <Link to="/gallery" className="flex flex-col items-center gap-3 text-emerald-800 p-8 text-center">
                            <span className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-600 shadow-sm">
                                <FiArrowRight />
                            </span>
                            <span className="font-bold text-sm uppercase tracking-widest">View All<br />Photos</span>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
