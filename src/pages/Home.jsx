import React from 'react';
import { FiArrowRight, FiUsers, FiHeart, FiBookOpen } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '../components/CountdownTimer';
import BooksSection from '../components/BooksSection';

// Use the assets we have
const heroImages = [
    '/assets/main_flyer.jpg',
    '/assets/freshers_flyer.jpg',
    '/assets/style_ref.jpg',
];

const articles = [
    {
        id: 1,
        title: "Walking in Divine Purpose",
        excerpt: "Discovering God's plan for your life is the beginning of true fulfillment...",
        author: "President",
        date: "Dec 12, 2025",
        category: "Spiritual Growth",
        image: "https://images.unsplash.com/photo-1507692049790-de58293a4697?q=80&w=2670&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Balancing Academics and Faith",
        excerpt: "How do you maintain a 5.0 GPA while serving in the fellowship?",
        author: "Sister Grace",
        date: "Nov 28, 2025",
        category: "Academic",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2670&auto=format&fit=crop"
    }
];

const homeGallery = [
    '/assets/gallery/img1.jpg',
    '/assets/gallery/img2.jpg',
    '/assets/gallery/img3.jpg',
    '/assets/gallery/img4.jpg',
];

const Home = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const stagger = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Calculate next Sunday
    const getNextSunday = () => {
        const now = new Date();
        const nextSunday = new Date();
        nextSunday.setDate(now.getDate() + (7 - now.getDay()) % 7);
        if (now.getDay() === 0 && now.getHours() >= 15) {
            nextSunday.setDate(nextSunday.getDate() + 7);
        }
        nextSunday.setHours(15, 0, 0, 0);
        return nextSunday;
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
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Abstract Background Element */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-green-50 to-transparent -z-10 rounded-bl-[100px] opacity-60"></div>

                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-black text-emerald-900 tracking-[0.15em] uppercase">Welcome to the Den</span>
                        </motion.div>

                        <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-serif font-black text-emerald-900 leading-tight tracking-tighter italic uppercase">
                            Empowering <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-500">
                                Your Destiny
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-lg leading-relaxed font-light">
                            A royal family of believers, upholding righteous standards as the unique fellowship on campus. Ignite your spiritual journey and academic path with us.
                        </motion.p>

                        <motion.div variants={fadeIn} className="flex flex-wrap gap-5 pt-4">
                            <Link
                                to="/signup"
                                className="group bg-emerald-900 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-emerald-800 transition-all shadow-[0_20px_40px_rgba(6,78,59,0.2)]"
                            >
                                Join Us Today
                                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/about" className="group bg-white text-emerald-900 border border-gray-100 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all flex items-center gap-2">
                                Discover More
                                <span className="w-2 h-2 bg-emerald-200 rounded-full group-hover:bg-emerald-500 transition-colors"></span>
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Image Slider Section */}
                    <div className="relative h-[450px] md:h-[600px] group">
                        <div className="absolute inset-0 bg-emerald-900/5 rounded-[3.5rem] -rotate-3 transition-transform group-hover:rotate-0 duration-1000"></div>

                        <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-[6px] border-white bg-gray-100">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div
                                    key={currentSlide}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
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
                                        className="w-full h-full object-cover pointer-events-none"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                                    {/* Slide Content Overlay */}
                                    <div className="absolute bottom-12 left-12 text-white pointer-events-none">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="w-10 h-[2px] bg-emerald-500"></span>
                                            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-emerald-400">Moment 0{currentSlide + 1}</span>
                                        </div>
                                        <p className="text-3xl font-serif font-black uppercase italic tracking-tight">The SUCF <span className="text-emerald-500">Legacy</span></p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Arrows */}
                            <div className="absolute top-1/2 -translate-y-1/2 left-8 right-8 flex justify-between z-20 pointer-events-none">
                                <button
                                    onClick={() => paginate(-1)}
                                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-emerald-900 transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 pointer-events-auto shadow-2xl"
                                >
                                    <FiArrowRight className="rotate-180 text-xl" />
                                </button>
                                <button
                                    onClick={() => paginate(1)}
                                    className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-emerald-900 transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 pointer-events-auto shadow-2xl"
                                >
                                    <FiArrowRight className="text-xl" />
                                </button>
                            </div>

                            {/* Indicators / Progress */}
                            <div className="absolute bottom-10 right-12 flex gap-4 z-30">
                                {heroImages.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setDirection(i > currentSlide ? 1 : -1);
                                            setCurrentSlide(i);
                                        }}
                                        className={`h-[3px] transition-all duration-700 rounded-full ${currentSlide === i ? 'w-16 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]' : 'w-6 bg-white/30 hover:bg-white/60'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Floating Badge (Updated for Slider) */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8, type: "spring" }}
                            className="absolute -top-6 -left-6 bg-white p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 z-40 border border-gray-50"
                        >
                            <div className="w-12 h-12 bg-emerald-900 text-white rounded-2xl flex items-center justify-center">
                                <FiUsers className="text-xl" />
                            </div>
                            <div>
                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Our Mission</p>
                                <p className="text-sm font-black text-emerald-900 uppercase">One Family</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Countdown Timer */}
            <CountdownTimer targetDate={getNextSunday()} />

            {/* Why Join Us */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-emerald-900 font-bold mb-4">Why SUCF UNEC?</h2>
                        <p className="text-gray-600">A community dedicated to spiritual growth and academic excellence.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <FiUsers />, title: "Family of Love", desc: "A supportive community that feels like home away from home." },
                            { icon: <FiBookOpen />, title: "Word Based", desc: "Deep dive into the scriptures to build a solid spiritual foundation." },
                            { icon: <FiHeart />, title: "Academic Excellence", desc: "We believe in excelling in our studies as we serve God." }
                        ].map((feature, idx) => (
                            <motion.div key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-8 rounded-3xl bg-gray-50 border border-transparent hover:border-emerald-100 hover:bg-white hover:shadow-xl transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Latest Articles Preview */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-serif text-emerald-900 font-bold mb-4">Edifying Reads</h2>
                            <p className="text-gray-600">Fresh insights and spiritual nourishment from our leaders and members.</p>
                        </div>
                        <Link to="/articles" className="text-emerald-700 font-bold flex items-center gap-2 hover:gap-3 transition-all">
                            View all articles <FiArrowRight />
                        </Link>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {articles.map((article) => (
                            <Link to={`/articles/${article.id}`} key={article.id} className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
                                <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-8 md:w-3/5">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{article.category}</span>
                                    <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3 group-hover:text-emerald-800 transition-colors">{article.title}</h3>
                                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">{article.excerpt}</p>
                                    <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                                        <span>By {article.author}</span>
                                        <span>•</span>
                                        <span>{article.date}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Books of the Semester */}
            <BooksSection />

            {/* Gallery Sneak Peek */}
            <section className="py-24 bg-white overflow-hidden group/gallery">
                <div className="container mx-auto px-6 mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div className="max-w-xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-lg text-emerald-700 text-[10px] font-black uppercase tracking-widest mb-4"
                            >
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                                Live Memories
                            </motion.div>
                            <h2 className="text-4xl md:text-5xl font-serif text-emerald-900 font-black italic uppercase italic tracking-tight">Capturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-400">Moments</span></h2>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const el = document.getElementById('home-gallery-slider');
                                    el.scrollBy({ left: -400, behavior: 'smooth' });
                                }}
                                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-all shadow-sm"
                            >
                                <FiArrowRight className="rotate-180" />
                            </button>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('home-gallery-slider');
                                    el.scrollBy({ left: 400, behavior: 'smooth' });
                                }}
                                className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center hover:bg-emerald-900 hover:text-white transition-all shadow-sm"
                            >
                                <FiArrowRight />
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    id="home-gallery-slider"
                    className="flex gap-6 px-10 overflow-x-auto no-scrollbar scroll-smooth pb-10"
                >
                    {homeGallery.map((img, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -15, scale: 1.02 }}
                            className="min-w-[320px] md:min-w-[400px] h-[500px] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white group/card relative"
                        >
                            <img src={img} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    ))}
                    <Link
                        to="/gallery"
                        className="min-w-[320px] md:min-w-[400px] h-[500px] rounded-[2.5rem] bg-emerald-900 flex flex-col items-center justify-center text-white group p-12 text-center transition-all hover:bg-emerald-800 shadow-[0_20px_50px_rgba(6,78,59,0.2)]"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-white group-hover:text-emerald-900 transition-all duration-500">
                            <FiArrowRight className="text-4xl" />
                        </div>
                        <h3 className="text-3xl font-serif font-black uppercase italic italic mb-4">View All <br />Memories</h3>
                        <p className="text-emerald-100/70 text-sm font-light leading-relaxed">Join us and be part of the next chapter in our divine story.</p>
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;
