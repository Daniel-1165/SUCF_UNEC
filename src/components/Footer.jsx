import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-emerald-950 text-white pt-24 pb-12 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand Column */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-serif font-black tracking-tighter mb-2">SUCF UNEC</h2>
                            <p className="text-emerald-500/80 text-[10px] uppercase font-black tracking-[0.3em]">The Unique Fellowship</p>
                        </div>
                        <p className="text-emerald-100/60 text-sm leading-relaxed max-w-xs font-medium">
                            Committed to reaching children, young people, and families, nurturing them through Bible engagement to become committed Christians of influence.
                        </p>
                        <div className="flex gap-4 pt-2">
                            {[
                                { icon: <FiInstagram />, link: "https://www.instagram.com/sucf.unec/" },
                                { icon: <FiFacebook />, link: "https://www.facebook.com/sucfunec" },
                                { icon: <FiYoutube />, link: "https://www.youtube.com/@sucfunec" }
                            ].map((social, i) => (
                                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all duration-500">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Navigation</h3>
                        <ul className="space-y-4 text-sm font-bold text-emerald-100/70">
                            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                            <li><Link to="/activities" className="hover:text-white transition-colors">Weekly Gatherings</Link></li>
                            <li><Link to="/gallery" className="hover:text-white transition-colors">Member Moments</Link></li>
                            <li><Link to="/articles" className="hover:text-white transition-colors">Edifying Reads</Link></li>
                        </ul>
                    </div>

                    {/* Meeting Times */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Meeting Times</h3>
                        <ul className="space-y-6 text-sm text-emerald-100/70">
                            <li>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 mb-1">Sunday Service</p>
                                <p className="font-bold text-white">3:00 PM PROMPT</p>
                            </li>
                            <li>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 mb-1">Wednesday Prayers</p>
                                <p className="font-bold text-white">6:00 PM PROMPT</p>
                            </li>
                            <li>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50 mb-1">Thursday Bible Study</p>
                                <p className="font-bold text-white">5:00 PM (PREP)</p>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">Find Us</h3>
                        <ul className="space-y-6 text-sm text-emerald-100/70">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 shrink-0">
                                    <FiMapPin />
                                </div>
                                <span className="font-medium leading-relaxed">Architecture Auditorium, University of Nigeria, Enugu Campus</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 shrink-0">
                                    <FiPhone />
                                </div>
                                <span className="font-bold text-white">+234 816 570 7615</span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 shrink-0">
                                    <FiMail />
                                </div>
                                <span className="font-medium hover:text-white cursor-pointer transition-colors">contact@sucfunec.org</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[11px] font-bold text-emerald-100/30 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} Scripture Union Campus Fellowship UNEC
                    </p>
                    <div className="flex gap-8 text-[11px] font-bold text-emerald-100/30 uppercase tracking-widest">
                        <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
