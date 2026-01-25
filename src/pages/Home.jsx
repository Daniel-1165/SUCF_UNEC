import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiUsers, FiHeart, FiBookOpen, FiPlay } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import BooksSection from '../components/BooksSection';
import NewsSection from '../components/NewsSection';
import { supabase } from '../supabaseClient';
import { fadeInUp, staggerContainer, staggerItem } from '../utils/animations';

// Use the assets we have
const heroImages = [
    '/assets/carousel/group_photo.jpg',
    '/assets/main_flyer.jpg',
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
    const [articles, setArticles] = useState([]);
    const [loadingArticles, setLoadingArticles] = useState(true);

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
                console.error('Error fetching articles:', error);
            } finally {
                setLoadingArticles(false);
            }
        };
        fetchArticles();
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
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 lg:pt-32 lg:pb-20 overflow-hidden">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">

                        {/* Content - Mobile First Priority */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="lg:col-span-6 flex flex-col items-start text-left space-y-8 z-10 w-full"
                        >
                            {/* Chip / Tag - Tech Style */}
                            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                                <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New</span>
                                <span className="text-xs font-medium text-slate-500">Academic Session 2025</span>
                            </motion.div>

                            <motion.h1
                                variants={fadeInUp}
                                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-slate-900"
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
                        <div className="lg:col-span-6 w-full relative h-[500px] lg:h-[700px]">
                            {/* Abstract Deco Elements */}
                            <div className="absolute top-10 right-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl" />
                            <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />

                            <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border-[8px] border-white shadow-2xl shadow-slate-200 transform md:rotate-2 hover:rotate-0 transition-all duration-700 bg-white">
                                <AnimatePresence mode='wait'>
                                    <motion.img
                                        key={currentSlide}
                                        src={heroImages[currentSlide]}
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        alt="SUCF Moments"
                                    />
                                </AnimatePresence>

                                {/* Overlay Interface UI */}
                                <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white/90 z-10">
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

                                {/* Bottom Info Card overlay */}
                                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-lg border border-white/50">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-1">Happening Now</p>
                                            <h4 className="text-slate-900 font-bold text-lg leading-none">Fellowship Activities</h4>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center">
                                            <FiArrowRight />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <CountdownTimer />

            {/* Why Join Us - Tech Grid Style */}
            <section className="py-24 bg-white relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-50" />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-20">
                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-xs mb-4 block">Core Values</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Built on a Solid <br /><span className="text-emerald-600">Foundation.</span></h2>
                        <p className="text-slate-500 text-lg">We are tailored to help you grow in every aspect of life.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                        {[
                            { icon: <FiUsers className="text-2xl" />, title: "Family", desc: "A home away from home." },
                            { icon: <FiBookOpen className="text-2xl" />, title: "Word", desc: "Rooted in scripture daily." },
                            { icon: <FiHeart className="text-2xl" />, title: "Love", desc: "Growing together in Christ." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -5 }}
                                className="tech-card p-8 group hover:border-emerald-500/30 transition-all"
                            >
                                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles - Magazine Layout */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Editorials</h2>
                            <p className="text-slate-500">Latest from the fellowship.</p>
                        </div>
                        <Link to="/articles" className="text-emerald-600 font-bold text-sm uppercase tracking-wider flex items-center gap-2 hover:gap-4 transition-all">
                            Read All <FiArrowRight />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {loadingArticles ? (
                            [1, 2, 3].map(i => <div key={i} className="h-96 bg-slate-200 rounded-3xl animate-pulse" />)
                        ) : articles.map((article, i) => (
                            <Link to={`/articles/${article.id}`} key={article.id} className="group">
                                <div className="rounded-3xl overflow-hidden mb-6 relative aspect-[4/3]">
                                    <img
                                        src={article.image_url || 'https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop'}
                                        alt={article.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-900">
                                        {article.category || 'Article'}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-tight">
                                    {article.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-2">{article.content?.replace(/<[^>]*>/g, '')}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <NewsSection />
            <BooksSection />

            {/* Gallery Strip */}
            <section className="py-20 overflow-hidden bg-white">
                <div className="container mx-auto px-6 mb-10 flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-slate-900">Captured Moments</h2>
                    <Link to="/gallery" className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all"><FiArrowRight /></Link>
                </div>
                <div className="flex gap-4 overflow-x-auto px-6 pb-10 no-scrollbar snap-x">
                    {homeGallery.map((img, i) => (
                        <div key={i} className="min-w-[280px] md:min-w-[350px] aspect-[4/3] rounded-3xl overflow-hidden snap-center">
                            <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
