
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
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <img src={logo} alt="SUCF UNEC" className="h-12 w-auto transition-transform group-hover:scale-110" />
                    <div className="hidden md:block">
                        <h1 className={`text-xl font-black italic uppercase tracking-tighter leading-none font-serif ${logoTitleColor}`}>SUCF UNEC</h1>
                        <p className={`text-[9px] tracking-[0.3em] font-black uppercase ${logoSubColor}`}>Unique Fellowship</p>
                    </div>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-emerald-500 relative ${isActive
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

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-4 ml-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                {user.isAdmin && (
                                    <Link
                                        to="/admin"
                                        className={`text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-emerald-100 text-emerald-900 rounded-lg hover:bg-emerald-200 transition-all flex items-center gap-2`}
                                    >
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                        Admin Panel
                                    </Link>
                                )}
                                <span className={`hidden lg:block text-[11px] font-bold uppercase tracking-wider ${isDarkPage ? 'text-white' : 'text-emerald-900'}`}>
                                    Hi, {user.user_metadata?.full_name?.split(' ')[0] || 'Member'} {user.isAdmin && <span className="opacity-50 text-[9px] -mt-1 block">Administrator</span>}
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/signin" className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-emerald-500 ${isDarkPage ? 'text-white' : 'text-emerald-900'}`}>
                                    Log In
                                </Link>
                                <Link to="/signup" className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/30">
                                    Join Us
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden text-2xl ${isDarkPage ? 'text-white' : 'text-emerald-900'}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <FiX /> : <FiMenu />}
                </button>
            </div >

            {/* Mobile Side Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
                        />

                        {/* Drawer Content */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className={`fixed top-4 right-4 bottom-4 w-[85%] max-w-[400px] z-[70] md:hidden overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col ${isDarkPage ? 'bg-[#00211F] text-white border border-white/5' : 'bg-white text-[#00211F] border border-[#E8F3EF]'
                                }`}
                        >
                            <div className="p-8 flex flex-col h-full">
                                <div className="flex justify-between items-center mb-10">
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-40">Navigation</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isDarkPage ? 'hover:bg-white/10' : 'hover:bg-[#F5F9F7]'
                                            }`}
                                    >
                                        <FiX className="text-xl" />
                                    </button>
                                </div>

                                <div className="space-y-2 mb-10 overflow-y-auto flex-grow pr-2 -mr-2">
                                    {user?.isAdmin && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setIsOpen(false)}
                                            className="block p-4 rounded-3xl bg-emerald-500/10 text-emerald-500 font-black uppercase tracking-widest text-sm mb-4 border border-emerald-500/20"
                                        >
                                            Admin Panel
                                        </Link>
                                    )}

                                    {navLinks.map((link) => {
                                        const isActive = location.pathname === link.path;
                                        return (
                                            <Link
                                                key={link.name}
                                                to={link.path}
                                                onClick={() => setIsOpen(false)}
                                                className={`block p-4 rounded-2xl text-lg font-bold transition-all ${isActive
                                                    ? (isDarkPage ? 'bg-white/10 text-white' : 'bg-[#E8F3EF] text-[#00211F]')
                                                    : (isDarkPage ? 'text-gray-400' : 'text-gray-500')
                                                    }`}
                                            >
                                                {link.name}
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className="mt-auto pt-8 border-t border-gray-100/10">
                                    {user ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-4 bg-[#F5F9F7]/5 rounded-2xl">
                                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black">
                                                    {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold truncate">{user.user_metadata?.full_name || user.email}</p>
                                                    {user.isAdmin && <p className="text-[10px] uppercase tracking-widest opacity-50">Admin Access</p>}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleSignOut();
                                                    setIsOpen(false);
                                                }}
                                                className="w-full bg-red-500/10 text-red-500 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-4">
                                            <Link
                                                to="/signin"
                                                onClick={() => setIsOpen(false)}
                                                className={`text-center py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border ${isDarkPage ? 'border-white/10 bg-white/5' : 'border-[#E8F3EF] bg-[#F5F9F7]'
                                                    }`}
                                            >
                                                Log In
                                            </Link>
                                            <Link
                                                to="/signup"
                                                onClick={() => setIsOpen(false)}
                                                className="bg-emerald-600 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20"
                                            >
                                                Join Us
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </nav >
    );
};

export default Navbar;
