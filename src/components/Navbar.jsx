
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';
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
            // Even if it fails, try to navigate away to clear state
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
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Activities', path: '/activities' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Library', path: '/library' },
        { name: 'Articles', path: '/articles' },
        { name: 'Contact', path: '/contact' },
        { name: 'Executives', path: '/executives' },
    ];

    const isDarkPage = location.pathname.startsWith('/gallery') || location.pathname.startsWith('/articles');
    const navbarBg = isDarkPage
        ? (scrolled ? 'bg-black/90' : 'bg-transparent')
        : (scrolled ? 'bg-white/90 shadow-sm' : 'bg-transparent');

    const textColor = isDarkPage
        ? 'text-white'
        : (scrolled ? 'text-emerald-900' : 'text-gray-600');

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
                                        className={`text-[10px] lg:text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-emerald-100 text-emerald-900 rounded-lg hover:bg-emerald-200 transition-all flex items-center gap-2`}
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
            </div >

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
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-[360px] shadow-2xl flex flex-col p-6 overflow-hidden ${isDarkPage ? 'bg-[#00211F] text-white' : 'bg-white text-emerald-950'
                                }`}
                        >
                            <div className="flex justify-between items-center mb-10 pt-4">
                                <div className="flex flex-col">
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40 mb-1">Navigation Menu</h2>
                                    <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isDarkPage ? 'bg-white/10 hover:bg-white/20' : 'bg-emerald-50 hover:bg-emerald-100'
                                        }`}
                                >
                                    <FiX size={24} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {navLinks.map((link) => {
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center justify-between p-5 rounded-[1.8rem] transition-all group ${isActive
                                                ? (isDarkPage ? 'bg-white/15 text-white shadow-xl shadow-white/5' : 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20')
                                                : (isDarkPage ? 'text-gray-300 hover:bg-white/5' : 'text-emerald-900/60 hover:bg-emerald-50')
                                                }`}
                                        >
                                            <span className="text-xl font-black italic uppercase tracking-tighter">
                                                {link.name}
                                            </span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="mobileActive"
                                                    className={`w-2 h-2 rounded-full ${isDarkPage ? 'bg-emerald-400' : 'bg-white'}`}
                                                />
                                            )}
                                        </Link>
                                    );
                                })}

                                {user?.isAdmin && (
                                    <Link
                                        to="/admin"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center justify-between p-5 rounded-[1.8rem] mt-6 bg-emerald-100 text-emerald-900 border border-emerald-200"
                                    >
                                        <span className="text-sm font-black uppercase tracking-widest">Admin Panel</span>
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    </Link>
                                )}
                            </div>

                            <div className="mt-8 pt-8 border-t border-emerald-100/10">
                                {user ? (
                                    <div className="space-y-4">
                                        <div className={`flex items-center gap-4 p-5 rounded-[2rem] ${isDarkPage ? 'bg-white/5' : 'bg-emerald-50'}`}>
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
                                                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="font-black italic uppercase tracking-tighter truncate leading-none mb-1">{user.user_metadata?.full_name || 'Fellow Member'}</p>
                                                <p className="text-[10px] uppercase tracking-widest opacity-40 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsOpen(false);
                                            }}
                                            className="w-full bg-red-500 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-4">
                                        <Link
                                            to="/signin"
                                            onClick={() => setIsOpen(false)}
                                            className={`text-center py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] border transition-all ${isDarkPage
                                                ? 'border-white/20 bg-white/5 hover:bg-white/10'
                                                : 'border-emerald-100 bg-emerald-50 text-emerald-950 hover:bg-emerald-100'
                                                }`}
                                        >
                                            Log In
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="bg-emerald-600 text-white text-center py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/30"
                                        >
                                            Join Us
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
