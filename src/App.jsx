import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Activities from './pages/Activities';
import { supabase } from './supabaseClient';

import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import Executives from './pages/Executives';
import Library from './pages/Library';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Debug from './pages/Debug';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

const DiagnosticBanner = () => {
  const [status, setStatus] = useState('Checking...');
  const [counts, setCounts] = useState({ gallery: 0 });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { count: galleryCount } = await supabase.from('gallery').select('*', { count: 'exact', head: true });

        setCounts({ gallery: galleryCount || 0 });
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
      <p>Gallery: {counts.gallery}</p>
    </div>
  );
};

function App() {
  return (
    <>
      <DiagnosticBanner />
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/about" element={<About />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/library" element={<Library />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/executives" element={<Executives />} />

        {/* Protected Routes (Empty for now as most are public, but keeping the structure) */}
        <Route element={<ProtectedRoute />}>
          {/* Add truly private routes here if any */}
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
