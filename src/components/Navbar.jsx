import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiHome, FiInfo, FiCalendar, FiImage, FiBookOpen, FiFileText, FiMail, FiUsers, FiLogOut, FiLogIn, FiUserPlus, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const logo = '/assets/logo.png';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        console.log("Navbar: Sign out button clicked.");
        try {
            await signOut();
            console.log("Navbar: Sign out complete, navigating home...");
            setIsOpen(false);
            navigate('/');
        } catch (error) {
            console.error("Navbar: Sign out failed:", error);
            navigate('/');
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/', icon: <FiHome /> },
        { name: 'About', path: '/about', icon: <FiInfo /> },
        { name: 'Activities', path: '/activities', icon: <FiCalendar /> },
        { name: 'Gallery', path: '/gallery', icon: <FiImage /> },
        { name: 'Library', path: '/library', icon: <FiBookOpen /> },
        { name: 'Articles', path: '/articles', icon: <FiFileText /> },
        { name: 'Executives', path: '/executives', icon: <FiUsers /> },
        { name: 'Contact', path: '/contact', icon: <FiMail /> },
    ];

    const isDarkPage = location.pathname.startsWith('/gallery') || location.pathname.startsWith('/articles');
    const navbarBg = isDarkPage
        ? (scrolled ? 'bg-black/90' : 'bg-transparent')
        : (scrolled ? 'bg-white/90 shadow-sm' : 'bg-transparent');

    const logoTitleColor = isDarkPage ? 'text-white' : 'text-emerald-900';
    const logoSubColor = isDarkPage ? 'text-emerald-400' : 'text-emerald-600';

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 backdrop-blur-md ${navbarBg} ${scrolled ? 'py-2' : 'py-5'}`}>
            <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center gap-12">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-4 group shrink-0">
                    <img src={logo} alt="SUCF UNEC" className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105" />
                    <div className="hidden lg:block">
                        <h1 className={`text-xl font-black italic uppercase tracking-tighter leading-none font-serif ${logoTitleColor}`}>SUCF UNEC</h1>
                        <p className={`text-[9px] tracking-[0.3em] font-black uppercase ${logoSubColor}`}>Unique Fellowship</p>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center justify-end flex-grow gap-8 lg:gap-12">
                    <div className="flex items-center gap-6 lg:gap-10">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-emerald-500 relative ${isActive
                                        ? (isDarkPage ? 'text-white' : 'text-emerald-900')
                                        : (isDarkPage ? 'text-gray-400' : 'text-gray-600')
                                        }`}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.span
                                            layoutId="navTab"
                                            className="absolute -bottom-2 left-0 w-full h-[2px] bg-emerald-500"
                                        ></motion.span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4 pl-10 border-l border-emerald-100/20">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-emerald-100 text-emerald-900 rounded-lg hover:bg-emerald-200 transition-all flex items-center gap-2"
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={handleSignOut}
                                    className="px-6 py-2 bg-emerald-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-emerald-900/10"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 lg:gap-4">
                                <Link to="/signin" className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-emerald-500 ${isDarkPage ? 'text-white' : 'text-emerald-900'}`}>
                                    Log In
                                </Link>
                                <Link to="/signup" className="px-5 lg:px-7 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30">
                                    Join Us
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden p-2 rounded-xl transition-colors ${isDarkPage ? 'text-white hover:bg-white/10' : 'text-emerald-900 hover:bg-emerald-50'}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
                </button>
            </div>

            {/* Mobile Side Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] md:hidden">
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute top-0 right-0 bottom-0 w-[85%] max-w-[320px] bg-[#0A1628] text-white shadow-2xl flex flex-col h-[100dvh]"
                        >
                            {/* Header Section (Fixed height) */}
                            <div className="p-6 pb-2 shrink-0">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <img src={logo} alt="Logo" className="h-8 w-auto" />
                                        <h2 className="text-sm font-black uppercase tracking-widest text-emerald-400">Navigation</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
                                    >
                                        <FiX size={20} />
                                    </button>
                                </div>
                                <div className="h-px w-full bg-white/10 mb-6" />
                            </div>

                            {/* Links Section (Expands to fill) */}
                            <div className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar min-h-0">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${isActive
                                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <span className="text-xl">{link.icon}</span>
                                            <span className="text-sm font-bold uppercase tracking-widest">
                                                {link.name}
                                            </span>
                                        </Link>
                                    );
                                })}

                                {user?.isAdmin && (
                                    <>
                                        <div className="h-px w-full bg-white/5 my-4 mx-2" />
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-emerald-400 hover:bg-emerald-400/5 transition-all"
                                        >
                                            <span className="text-xl"><FiSettings /></span>
                                            <span className="text-sm font-bold uppercase tracking-widest">Admin Panel</span>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Bottom Section */}
                            <div className="p-6 bg-black/20 border-t border-white/5">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black shadow-lg">
                                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold uppercase tracking-tight truncate">{user.user_metadata?.full_name || 'Member'}</p>
                                                <p className="text-[10px] text-white/40 truncate italic">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                        >
                                            <FiLogOut size={14} />
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link
                                            to="/signin"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center gap-2 bg-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/10"
                                        >
                                            <FiLogIn size={14} />
                                            Log In
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-center gap-2 bg-emerald-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <FiUserPlus size={14} />
                                            Join
                                        </Link>
                                    </div>
                                )}
                                <p className="text-center text-[9px] text-white/20 mt-6 uppercase tracking-[0.2em]">SUCF UNEC &copy; 2024</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
