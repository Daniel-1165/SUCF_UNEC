import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiYoutube, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-emerald-950 text-white pt-16 pb-12 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-900/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
                    {/* Brand Column - span 4 */}
                    <div className="lg:col-span-4 space-y-6">
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
                                <a key={i} href={social.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all duration-500">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links & Meeting Times Column - span 4 */}
                    <div className="lg:col-span-4 grid grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">Navigation</h3>
                            <ul className="space-y-3 text-sm font-bold text-emerald-100/70">
                                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                                <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
                                <li><Link to="/activities" className="hover:text-white transition-colors">Gatherings</Link></li>
                                <li><Link to="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
                                <li><Link to="/library" className="hover:text-white transition-colors">Library</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">Meetings</h3>
                            <ul className="space-y-4 text-sm text-emerald-100/70">
                                <li>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/50">Sunday</p>
                                    <p className="font-bold text-white text-xs">3:00 PM</p>
                                </li>
                                <li>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600/50">Thursday</p>
                                    <p className="font-bold text-white text-xs">5:00 PM</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bank & Contact Column - span 4 */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Bank Details Card - Minimalist */}
                        <div className="space-y-4 px-2">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/50">Support Ministry</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-emerald-100/30 uppercase tracking-tighter">Bank</span>
                                    <span className="font-bold text-emerald-100">Access Bank</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-emerald-100/30 uppercase tracking-tighter">Number</span>
                                    <span className="font-mono font-bold text-emerald-100 tracking-[0.2em]">0011790503</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-emerald-100/30 uppercase tracking-tighter">Name</span>
                                    <span className="font-bold text-white uppercase text-[10px]">SUCF UNEC</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="flex items-center gap-6">
                            <a href="tel:07069753310" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <FiPhone size={14} />
                                </div>
                                <span className="text-xs font-bold">Call</span>
                            </a>
                            <a href="mailto:sucfunec01@gmail.com" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                    <FiMail size={14} />
                                </div>
                                <span className="text-xs font-bold">Email</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold text-emerald-100/20 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} SUCF UNEC • The Unique Fellowship
                    </p>
                    <div className="flex gap-6 text-[10px] font-bold text-emerald-100/20 uppercase tracking-widest">
                        <a href="#" className="hover:text-emerald-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-emerald-500 transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
