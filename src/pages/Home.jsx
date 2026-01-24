import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiUsers, FiHeart, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import BooksSection from '../components/BooksSection';
import NewsSection from '../components/NewsSection';
import { supabase } from '../supabaseClient';
import { fadeInUp, staggerContainer, staggerItem, scaleIn, slideFromLeft, slideFromRight } from '../utils/animations';

// Use the assets we have
const heroImages = [
    '/assets/carousel/group_photo.jpg',
    '/assets/main_flyer.jpg',
    '/assets/carousel/weekly_prayers.jpg',
    '/assets/carousel/bible_study.jpg',
    '/assets/freshers_flyer.jpg',
];

// Fallback articles if database is empty
const fallbackArticles = [
    {
        id: 'fallback-1',
        title: "Walking in Divine Purpose",
        excerpt: "Discovering God's plan for your life is the beginning of true fulfillment...",
        author_name: "SUCF Leadership",
        created_at: new Date().toISOString(),
        category: "Spiritual Growth",
        image_url: "https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 'fallback-2',
        title: "Balancing Academics and Faith",
        excerpt: "How do you maintain excellence in your studies while serving in the fellowship?",
        author_name: "SUCF Leadership",
        created_at: new Date().toISOString(),
        category: "Academic",
        image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop"
    }
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

    // Fetch latest articles
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                console.log("Fetching articles from Supabase...");
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(2);

                if (error) throw error;

                if (data && data.length > 0) {
                    console.log("Successfully fetched articles:", data.length);
                    // Ensure each article has a valid image_url before setting it
                    const processedData = data.map(article => ({
                        ...article,
                        image_url: article.image_url || 'https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop'
                    }));
                    setArticles(processedData);
                } else {
                    console.log("No articles found in DB, using fallbacks.");
                    setArticles(fallbackArticles);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
                setArticles(fallbackArticles);
            } finally {
                setLoadingArticles(false);
            }
        };

        fetchArticles();
    }, []);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const [currentSlide, setCurrentSlide] = React.useState(0);
    const [direction, setDirection] = React.useState(0);
    const heroImageCount = heroImages.length;

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.9
        })
    };

    const paginate = (newDirection) => {
        setDirection(newDirection);
        setCurrentSlide((prev) => (prev + newDirection + heroImageCount) % heroImageCount);
    };

    // Auto-play
    React.useEffect(() => {
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    return (
        <div className="min-h-screen zeni-mesh-gradient">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 flex flex-col lg:grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image Slider Section - Now first on mobile */}
                    <div className="relative h-[450px] md:h-[650px] group w-full lg:order-2">
                        <div className="absolute inset-0 bg-emerald-500/5 rounded-[4rem] -rotate-3 transition-transform group-hover:rotate-0 duration-1000"></div>

                        <div className="relative h-full w-full rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_rgba(0,33,31,0.1)] border-[12px] border-white/80 backdrop-blur-sm bg-gray-100">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="center"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.4 }
                                    }}
                                    drag="x"
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={1}
                                    onDragEnd={(e, { offset, velocity }) => {
                                        const swipe = Math.abs(offset.x) > 50;
                                        if (swipe) {
                                            paginate(offset.x > 0 ? -1 : 1);
                                        }
                                    }}
                                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                                >
                                    <img
                                        src={heroImages[currentSlide]}
                                        alt={`Slide ${currentSlide + 1}`}
                                        className="w-full h-full object-cover pointer-events-none transition-all duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#00211F]/30 via-transparent to-transparent pointer-events-none" />
                                </motion.div>
                            </AnimatePresence>

                            {/* Indicators */}
                            <div className="absolute bottom-12 right-16 flex gap-3 z-30">
                                {heroImages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDirection(i > currentSlide ? 1 : -1);
                                            setCurrentSlide(i);
                                        }}
                                        className={`h-1.5 transition-all duration-700 rounded-full ${currentSlide === i ? 'w-12 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'w-4 bg-white/20 hover:bg-white/50'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* Text Content - Now second on mobile */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-10 lg:order-1"
                    >
                        <motion.div variants={fadeIn} className="section-tag">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Welcome to the Den
                        </motion.div>

                        <h1
                            className="text-5xl md:text-8xl font-black text-[#00211F] leading-[0.9] tracking-tighter"
                        >
                            Empowering <br />
                            <span className="text-emerald-600 italic">
                                Your Destiny.
                            </span>
                        </h1>

                        <motion.p variants={fadeIn} className="text-xl text-[#00211F] opacity-40 max-w-lg leading-relaxed font-medium">
                            A royal family of believers, upholding righteous standards as the unique fellowship on campus.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-5 pt-4">
                            <Link
                                to="/signup"
                                className="group bg-[#00211F] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-4 hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-900/10 active:scale-95"
                            >
                                Join The Family
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/about"
                                className="zeni-card bg-white px-10 py-5 flex items-center gap-3 group"
                            >
                                <span className="text-xs font-black uppercase tracking-widest text-[#00211F]">Discover More</span>
                                <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                    <FiArrowRight className="text-xs" />
                                </div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Countdown Timer */}
            <CountdownTimer />

            {/* Why Join Us */}
            <section className="py-40">
                <div className="container mx-auto px-6 max-w-7xl">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="max-w-4xl mb-24"
                    >
                        <div className="section-tag mb-8">Foundation</div>
                        <h2 className="text-6xl md:text-7xl font-black text-[#00211F] mb-10 leading-none tracking-tighter">
                            Why <span className="text-emerald-600 italic">SUCF UNEC?</span>
                        </h2>
                        <p className="text-[#00211F] text-xl font-medium opacity-40 max-w-xl">A community dedicated to spiritual growth and academic excellence.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        variants={staggerContainer}
                        className="grid md:grid-cols-3 gap-10"
                    >
                        {[
                            { icon: <FiUsers />, title: "Family of Love", desc: "A supportive community that feels like home away from home." },
                            { icon: <FiBookOpen />, title: "Word Based", desc: "Deep dive into the scriptures to build a solid spiritual foundation." },
                            { icon: <FiHeart />, title: "Excellence", desc: "We believe in excelling in our studies as much as we serve God." }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                variants={staggerItem}
                                whileHover={{
                                    y: -10,
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                                className="zeni-card p-12 hover:bg-white transition-all group cursor-pointer"
                            >
                                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center text-3xl mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-black text-[#00211F] mb-4 uppercase tracking-tight">{feature.title}</h3>
                                <p className="text-[#00211F] opacity-40 font-medium leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Latest Articles Preview */}
            <section className="py-24 bg-[#00211F] rounded-[4rem] mx-6 mb-24 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-500/5 -skew-x-12 translate-x-1/2" />

                <div className="container mx-auto px-10 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-12"
                    >
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="section-tag !bg-white/5 !border-white/10 !text-emerald-400 mb-8"
                            >
                                Wisdom
                            </motion.div>
                            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none tracking-tighter italic uppercase">Edifying <span className="text-emerald-500">Reads.</span></h2>
                            <p className="text-white/40 text-xl font-medium">Fresh insights and spiritual nourishment from our leaders and members.</p>
                        </div>
                        <Link to="/articles" className="group flex items-center gap-6">
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400">Expand Library</span>
                            <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-2xl group-hover:bg-white group-hover:text-[#00211F] transition-all">
                                <FiArrowRight />
                            </div>
                        </Link>
                    </motion.div>

                    {loadingArticles ? (
                        <div className="grid lg:grid-cols-2 gap-12">
                            {[1, 2].map(i => (
                                <div key={i} className="h-80 bg-white/5 rounded-[3rem] animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-2 gap-12">
                            {articles.map((article, index) => {
                                const formattedDate = new Date(article.created_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                });

                                return (
                                    <motion.div
                                        key={article.id}
                                        initial={{ opacity: 0, y: 50, rotateX: -10 }}
                                        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{
                                            duration: 0.7,
                                            delay: index * 0.2,
                                            ease: [0.25, 0.46, 0.45, 0.94]
                                        }}
                                    >
                                        <Link
                                            to={`/articles/${article.id}`}
                                            className="zeni-card !bg-white/5 !border-white/10 overflow-hidden group/item flex flex-col h-full transition-all hover:!bg-white/10 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
                                        >
                                            <div className="h-64 overflow-hidden relative">
                                                <img
                                                    src={article.image_url || 'https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop'}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover transition-all duration-1000 group-hover/item:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                            </div>
                                            <div className="p-10 flex flex-col flex-grow">
                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">{article.category || 'Spiritual Growth'}</span>
                                                <h3 className="text-2xl font-black text-white mb-4 leading-tight uppercase italic group-hover/item:text-emerald-400 transition-colors line-clamp-2">{article.title}</h3>
                                                <p className="text-white/30 text-sm mb-10 line-clamp-3 font-medium leading-relaxed">
                                                    {article.excerpt || article.content?.replace(/<[^>]*>/g, '').substring(0, 120) + '...'}
                                                </p>
                                                <div className="mt-auto flex items-center gap-4 text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                    <span>BY {article.author_name || 'SUCF'}</span>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"></span>
                                                    <span>{formattedDate}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* News Section */}
            <NewsSection />

            {/* Books Subsection */}
            <BooksSection />

            {/* Gallery Sneak Peek */}
            <section className="py-24 overflow-hidden bg-emerald-50/30">
                <div className="container mx-auto px-6 mb-20 max-w-7xl">
                    <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
                        <div className="max-w-2xl">
                            <div className="section-tag mb-8 bg-emerald-100/50 border-emerald-200 text-emerald-700">Memories</div>
                            <h2 className="text-5xl md:text-7xl font-black text-[#00211F] leading-none tracking-tighter uppercase italic">
                                Captured <br />
                                <span className="text-emerald-600">Moments.</span>
                            </h2>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    const el = document.getElementById('home-gallery-slider');
                                    el.scrollBy({ left: -400, behavior: 'smooth' });
                                }}
                                className="w-14 h-14 zeni-card flex items-center justify-center text-xl hover:bg-[#00211F] hover:text-white transition-all shadow-xl"
                            >
                                <FiArrowRight className="rotate-180" />
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('home-gallery-slider');
                                    el.scrollBy({ left: 400, behavior: 'smooth' });
                                }}
                                className="w-14 h-14 zeni-card flex items-center justify-center text-xl hover:bg-[#00211F] hover:text-white transition-all shadow-xl"
                            >
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    id="home-gallery-slider"
                    className="flex gap-6 px-10 md:px-20 overflow-x-auto no-scrollbar scroll-smooth pb-20"
                >
                    {homeGallery.map((img, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -10 }}
                            className="w-[200px] md:w-[260px] aspect-square zeni-card overflow-hidden !rounded-[2.5rem] !p-0 border-8 border-white relative group shrink-0"
                        >
                            <img src={img} alt="Gallery" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#00211F]/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        </motion.div>
                    ))}
                    <Link
                        to="/gallery"
                        className="w-[200px] md:w-[260px] aspect-square zeni-card-dark !bg-[#00211F] flex flex-col items-center justify-center group p-8 text-center transition-all hover:bg-emerald-950 !rounded-[2.5rem] shrink-0"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:border-transparent transition-all duration-700 shadow-2xl">
                            <FiArrowRight className="text-2xl" />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic mb-4 leading-none text-white">The Full <br /><span className="text-emerald-500">Archive.</span></h3>
                        <p className="text-emerald-100/30 text-sm font-medium tracking-tight">Step into the visual story of our royal family.</p>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
