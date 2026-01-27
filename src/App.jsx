import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Activities from './pages/Activities';

import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Articles from './pages/Articles';
import About from './pages/About';
import Contact from './pages/Contact';
import Executives from './pages/Executives';
import ArticleDetail from './pages/ArticleDetail';
import Library from './pages/Library';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Debug from './pages/Debug';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
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
        <Route path="/articles" element={<Articles />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
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
