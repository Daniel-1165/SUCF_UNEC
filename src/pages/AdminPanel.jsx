import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiImage, FiFileText, FiUpload, FiTrash2, FiPlus, FiSave, FiX, FiBook, FiBell, FiEdit, FiCalendar, FiMessageSquare, FiCheckCircle, FiUsers, FiSearch, FiSend } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const galleryCategories = ['Events', 'Worship', 'Fellowship', 'Outreach'];
const articleCategories = ['Spiritual Growth', 'Academic', 'Prayer', 'Testimony'];

// Quill editor configuration - Enhanced with more formatting options
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['link', 'blockquote', 'code-block'],
        ['clean']
    ]
};

const quillFormats = [
    'header', 'size', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'bullet', 'indent',
    'link', 'blockquote', 'code-block', 'align'
];

const AdminPanel = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'articles', 'books', 'news', 'events', 'users'

    // Handle initial tab from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['gallery', 'articles', 'books', 'news', 'events', 'messages', 'users', 'weekly_posts'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location]);

    // Gallery State
    const [galleryImages, setGalleryImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('Events');
    const [editingImageId, setEditingImageId] = useState(null);

    // Article State
    const [articles, setArticles] = useState([]);
    const [articleForm, setArticleForm] = useState({
        title: '',
        content: '',
        excerpt: '',
        image_url: '',
        author_name: 'Admin',
        category: 'Spiritual Growth',
        imageFile: null
    });
    const [editingArticleId, setEditingArticleId] = useState(null);

    // Books State
    const [books, setBooks] = useState([]);
    const [bookForm, setBookForm] = useState({
        title: '',
        author: '',
        description: '',
        semester: '',
        image_url: '',
        bookFile: null,
        imageFile: null
    });
    const [editingBookId, setEditingBookId] = useState(null);

    // News State
    const [news, setNews] = useState([]);
    const [newsForm, setNewsForm] = useState({
        title: '',
        content: '',
        image_url: '',
        category: 'General',
        imageFile: null
    });
    const [editingNewsId, setEditingNewsId] = useState(null);

    // Fellowship Events State
    const [fellowshipEvents, setFellowshipEvents] = useState([]);
    const [eventForm, setEventForm] = useState({
        title: '',
        event_date: '',
        event_time: '',
        location: '',
        bible_reference: '',
        description: '',
        flyer_url: '',
        imageFile: null
    });
    const [editingEventId, setEditingEventId] = useState(null);
    const [contactMessages, setContactMessages] = useState([]);

    // Weekly Posts State
    const [weeklyPosts, setWeeklyPosts] = useState([]);
    const [weeklyPostForm, setWeeklyPostForm] = useState({
        image_url: '',
        imageFile: null
    });
    const [editingWeeklyPostId, setEditingWeeklyPostId] = useState(null);

    // Users State
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [userResults, setUserResults] = useState([]);
    const [searchingUsers, setSearchingUsers] = useState(false);

    // Use a ref to track if we've successfully auth'd once
    const hasAuthorized = React.useRef(false);

    // Initial Load & Auth Check
    useEffect(() => {
        // If already authorized once, don't re-check navigation
        if (hasAuthorized.current) return;

        if (!authLoading) {
            if (!user) {
                navigate('/signin');
                return;
            }
            if (user.isAdmin === undefined) return;
            if (user.isAdmin !== true) {
                navigate('/');
                return;
            }
            // Verified Admin - load data and lock authorization
            hasAuthorized.current = true;
            fetchGallery();
            fetchArticles();
            fetchBooks();
            fetchNews();
            fetchFellowshipEvents();
            fetchContactMessages();
            fetchWeeklyPosts();

            if (user?.user_metadata?.full_name && articleForm.author_name === 'Admin') {
                setArticleForm(prev => ({ ...prev, author_name: user.user_metadata.full_name }));
            }
        }
    }, [user, authLoading, navigate]);

    // Warning when leaving while uploading
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (uploading) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [uploading]);

    // --- FETCH DATA ---
    const fetchGallery = async () => {
        const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (!error) setGalleryImages(data);
    };

    const fetchArticles = async () => {
        const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (!error) setArticles(data);
    };

    const fetchBooks = async () => {
        const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
        if (!error) setBooks(data);
    };

    const fetchNews = async () => {
        const { data, error } = await supabase.from('news').select('*').order('created_at', { ascending: false });
        if (!error) setNews(data);
    };

    // Cleanup News (2 weeks old)
    const cleanupNews = async () => {
        if (!window.confirm("Remove news older than 2 weeks?")) return;
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

        try {
            const { error } = await supabase
                .from('news')
                .delete()
                .lt('created_at', twoWeeksAgo.toISOString());

            if (error) throw error;
            alert("Cleanup complete!");
            fetchNews();
        } catch (err) {
            alert("Cleanup failed: " + err.message);
        }
    };

    const fetchFellowshipEvents = async () => {
        const { data, error } = await supabase
            .from('fellowship_events')
            .select('*')
            .order('event_date', { ascending: true });
        if (!error) setFellowshipEvents(data);
    };

    const fetchContactMessages = async () => {
        const { data, error } = await supabase
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setContactMessages(data);
    };

    const fetchWeeklyPosts = async () => {
        const { data, error } = await supabase
            .from('weekly_posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error) setWeeklyPosts(data || []);
    };

    const handleMarkAsRead = async (id) => {
        const { error } = await supabase
            .from('contact_messages')
            .update({ status: 'read' })
            .eq('id', id);
        if (!error) fetchContactMessages();
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        const { error } = await supabase.from('contact_messages').delete().eq('id', id);
        if (!error) fetchContactMessages();
    };

    // --- USER MANAGEMENT ---
    const searchUsers = async (e) => {
        e.preventDefault();
        setSearchingUsers(true);
        try {
            // Search in profiles by email
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .ilike('email', `%${userSearchTerm}%`);

            if (error) throw error;
            setUserResults(data || []);
        } catch (err) {
            console.error(err);
            alert("Search failed. Ensure profiles table and email column exist.");
        } finally {
            setSearchingUsers(false);
        }
    };

    const toggleAdminStatus = async (profileId, currentStatus) => {
        if (!window.confirm(`Are you sure you want to ${currentStatus ? 'REMOVE' : 'MAKE'} Admin?`)) return;
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_admin: !currentStatus })
                .eq('id', profileId);

            if (error) throw error;

            // Update local list
            setUserResults(prev => prev.map(u => u.id === profileId ? { ...u, is_admin: !currentStatus } : u));
            alert("Updated successfully!");
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };

    // --- UTILS ---
    const uploadFile = async (file, bucket = 'content-images', folder = 'gallery') => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return publicUrl;
    };

    // --- GALLERY ACTIONS ---
    const handleImageUpload = async (e) => {
        e.preventDefault();

        setUploading(true);
        try {
            let publicUrl = '';
            if (newImage) {
                publicUrl = await uploadFile(newImage, 'content-images', 'gallery');
            }

            if (editingImageId) {
                const updateData = { caption: caption, category: category };
                if (publicUrl) updateData.image_url = publicUrl;

                const { error: dbError } = await supabase
                    .from('gallery')
                    .update(updateData)
                    .eq('id', editingImageId);

                if (dbError) throw dbError;
                alert("Image updated successfully!");
            } else {
                if (!newImage) return alert("Please select an image");
                const { error: dbError } = await supabase.from('gallery').insert([
                    { image_url: publicUrl, caption: caption, category: category }
                ]);

                if (dbError) throw dbError;
                alert("Image uploaded successfully!");
            }

            resetGalleryForm();
            fetchGallery();
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetGalleryForm = () => {
        setNewImage(null);
        setCaption('');
        setCategory('Events');
        setEditingImageId(null);
    };

    const handleEditImage = (img) => {
        setCaption(img.caption || '');
        setCategory(img.category || 'Events');
        setEditingImageId(img.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteImage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this image?")) return;
        const { error } = await supabase.from('gallery').delete().eq('id', id);
        if (!error) fetchGallery();
    };

    // --- ARTICLE ACTIONS ---
    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalImageUrl = articleForm.image_url;
            if (articleForm.imageFile) {
                finalImageUrl = await uploadFile(articleForm.imageFile, 'content-images', 'articles');
            }
            const { imageFile, ...submitData } = articleForm;

            if (editingArticleId) {
                const { error } = await supabase
                    .from('articles')
                    .update({ ...submitData, image_url: finalImageUrl })
                    .eq('id', editingArticleId);
                if (error) throw error;
                alert("Article updated!");
            } else {
                const { error } = await supabase.from('articles').insert([{ ...submitData, image_url: finalImageUrl }]);
                if (error) throw error;
                alert("Article published!");
            }

            resetArticleForm();
            fetchArticles();
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetArticleForm = () => {
        setArticleForm({ title: '', content: '', excerpt: '', image_url: '', author_name: 'Admin', category: 'Spiritual Growth', imageFile: null });
        setEditingArticleId(null);
    };

    const handleEditArticle = (article) => {
        setArticleForm({
            title: article.title,
            content: article.content,
            excerpt: article.excerpt,
            image_url: article.image_url,
            author_name: article.author_name || 'Admin',
            category: article.category || 'Spiritual Growth',
            imageFile: null
        });
        setEditingArticleId(article.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteArticle = async (id) => {
        if (!window.confirm("Delete this article?")) return;
        const { error } = await supabase.from('articles').delete().eq('id', id);
        if (!error) fetchArticles();
    };

    // --- BOOK ACTIONS ---
    const handleBookSubmit = async (e) => {
        e.preventDefault();
        if (!bookForm.bookFile) return alert("Please select a PDF file");
        setUploading(true);
        try {
            let finalFileUrl = bookForm.file_url;
            let finalImageUrl = bookForm.image_url;
            if (bookForm.bookFile) finalFileUrl = await uploadFile(bookForm.bookFile, 'content-images', 'books');
            if (bookForm.imageFile) finalImageUrl = await uploadFile(bookForm.imageFile, 'content-images', 'book-covers');

            const { bookFile, imageFile, ...submitData } = bookForm;

            if (editingBookId) {
                const { error } = await supabase
                    .from('books')
                    .update({ ...submitData, file_url: finalFileUrl, image_url: finalImageUrl })
                    .eq('id', editingBookId);
                if (error) throw error;
                alert("Book updated!");
            } else {
                const { error } = await supabase.from('books').insert([{ ...submitData, file_url: finalFileUrl, image_url: finalImageUrl }]);
                if (error) throw error;
                alert("Book added!");
            }

            resetBookForm();
            fetchBooks();
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetBookForm = () => {
        setBookForm({ title: '', author: '', description: '', semester: '', file_url: '', image_url: '', bookFile: null, imageFile: null });
        setEditingBookId(null);
    };

    const handleEditBook = (book) => {
        setBookForm({
            title: book.title,
            author: book.author || '',
            description: book.description || '',
            semester: book.semester || '',
            file_url: book.file_url,
            image_url: book.image_url || '',
            bookFile: null,
            imageFile: null
        });
        setEditingBookId(book.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteBook = async (id) => {
        if (!window.confirm("Delete this book?")) return;
        const { error } = await supabase.from('books').delete().eq('id', id);
        if (!error) fetchBooks();
    };

    // --- NEWS ACTIONS ---
    const handleNewsSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalImageUrl = newsForm.image_url;
            if (newsForm.imageFile) {
                finalImageUrl = await uploadFile(newsForm.imageFile, 'content-images', 'news');
            }
            const { imageFile, ...submitData } = newsForm;

            if (editingNewsId) {
                const { error } = await supabase
                    .from('news')
                    .update({ ...submitData, image_url: finalImageUrl })
                    .eq('id', editingNewsId);
                if (error) throw error;
                alert("News updated!");
            } else {
                const { error } = await supabase.from('news').insert([{ ...submitData, image_url: finalImageUrl }]);
                if (error) throw error;
                alert("News posted!");
            }

            resetNewsForm();
            fetchNews();
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetNewsForm = () => {
        setNewsForm({ title: '', content: '', image_url: '', category: 'General', imageFile: null });
        setEditingNewsId(null);
    };

    const handleEditNews = (item) => {
        setNewsForm({
            title: item.title,
            content: item.content,
            image_url: item.image_url || '',
            category: item.category || 'General',
            imageFile: null
        });
        setEditingNewsId(item.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteNews = async (id) => {
        if (!window.confirm("Delete this news item?")) return;
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) fetchNews();
    };

    // --- FELLOWSHIP EVENT ACTIONS ---
    const handleEventSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalImageUrl = eventForm.flyer_url;
            if (eventForm.imageFile) {
                finalImageUrl = await uploadFile(eventForm.imageFile, 'content-images', 'events');
            }

            const { imageFile, ...submitData } = eventForm;

            if (editingEventId) {
                const { error } = await supabase
                    .from('fellowship_events')
                    .update({ ...submitData, flyer_url: finalImageUrl })
                    .eq('id', editingEventId);
                if (error) throw error;
                alert("Event flyer updated!");
            } else {
                const { error } = await supabase.from('fellowship_events').insert([
                    { ...submitData, flyer_url: finalImageUrl, created_by: user.id }
                ]);
                if (error) throw error;
                alert("Fellowship event published!");
            }

            resetEventForm();
            fetchFellowshipEvents();
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetEventForm = () => {
        setEventForm({ title: '', event_date: '', event_time: '', location: '', bible_reference: '', description: '', flyer_url: '', imageFile: null });
        setEditingEventId(null);
    };

    const handleEditEvent = (event) => {
        setEventForm({
            title: event.title,
            event_date: event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : '',
            event_time: event.event_time,
            location: event.location || '',
            bible_reference: event.bible_reference || '',
            description: event.description || '',
            flyer_url: event.flyer_url,
            imageFile: null
        });
        setEditingEventId(event.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;
        const { error } = await supabase.from('fellowship_events').delete().eq('id', id);
        if (!error) fetchFellowshipEvents();
    };

    // --- WEEKLY POST ACTIONS ---
    const handleWeeklyPostSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalImageUrl = weeklyPostForm.image_url;
            if (weeklyPostForm.imageFile) {
                finalImageUrl = await uploadFile(weeklyPostForm.imageFile, 'content-images', 'weekly-posts');
            }

            const { imageFile, ...submitData } = weeklyPostForm;
            const dataToSave = { ...submitData, image_url: finalImageUrl };

            if (editingWeeklyPostId) {
                const { error } = await supabase
                    .from('weekly_posts')
                    .update(dataToSave)
                    .eq('id', editingWeeklyPostId);
                if (error) throw error;
                alert("Weekly post updated!");
            } else {
                const { error } = await supabase.from('weekly_posts').insert([dataToSave]);
                if (error) throw error;
                alert("Weekly post published!");
            }
            resetWeeklyPostForm();
            fetchWeeklyPosts();
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const resetWeeklyPostForm = () => {
        setWeeklyPostForm({ image_url: '', imageFile: null });
        setEditingWeeklyPostId(null);
    };

    const handleEditWeeklyPost = (post) => {
        setWeeklyPostForm({
            image_url: post.image_url || '',
            imageFile: null
        });
        setEditingWeeklyPostId(post.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteWeeklyPost = async (id) => {
        if (!window.confirm("Delete this weekly post?")) return;
        const { error } = await supabase.from('weekly_posts').delete().eq('id', id);
        if (!error) fetchWeeklyPosts();
    };

    if (!hasAuthorized.current && (authLoading || (user && user.isAdmin === undefined))) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-emerald-900 font-bold uppercase tracking-widest text-xs">Verifying Access...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div>
                            <h1 className="text-4xl font-serif font-black text-emerald-900 mb-2">Admin Dashboard</h1>
                            <p className="text-gray-500">Manage your content and visual assets.</p>
                        </div>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md ${activeTab === 'users' ? 'bg-emerald-900 text-white' : 'bg-white text-emerald-900 border border-emerald-200 hover:bg-emerald-50'}`}
                        >
                            <FiUsers /> Users
                        </button>
                    </div>
                    <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex-wrap justify-center">
                        <button onClick={() => setActiveTab('gallery')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <FiImage /> Gallery
                        </button>
                        <button onClick={() => setActiveTab('articles')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'articles' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <FiFileText /> Articles
                        </button>
                        <button onClick={() => setActiveTab('books')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'books' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <FiBook /> Books
                        </button>
                        <button onClick={() => setActiveTab('news')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'news' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <FiBell /> News
                        </button>
                        <button onClick={() => setActiveTab('events')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'events' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <FiCalendar /> Fellowship
                        </button>
                        <button onClick={() => setActiveTab('messages')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'messages' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'} relative`}>
                            <FiMessageSquare /> Messages
                            {contactMessages.some(m => m.status === 'unread') && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            )}
                        </button>
                        <button onClick={() => setActiveTab('weekly_posts')} className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'weekly_posts' ? 'bg-emerald-900 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <FiFileText /> Weekly Posts
                        </button>
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {activeTab === 'gallery' ? (
                        <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                                    {editingImageId ? <FiEdit className="text-emerald-500" /> : <FiUpload className="text-emerald-500" />}
                                    {editingImageId ? 'Edit Image Detail' : 'Upload New Image'}
                                </h3>
                                <form onSubmit={handleImageUpload} className="flex flex-col md:flex-row gap-6 items-end">
                                    <div className="w-full md:w-1/3">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image File {editingImageId && '(Optional)'}</label>
                                        <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} className="w-full text-sm text-gray-500 py-3 px-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer" />
                                    </div>
                                    <div className="w-full md:w-1/4">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all text-sm font-bold text-emerald-900">
                                            {galleryCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Caption</label>
                                        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Descriptive caption..." className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" />
                                    </div>
                                    <div className="flex gap-2">
                                        {editingImageId && (
                                            <button
                                                type="button"
                                                onClick={resetGalleryForm}
                                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50 min-w-[120px]"
                                        >
                                            {uploading ? 'PROCESSING...' : (editingImageId ? 'Update' : 'Upload')}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {galleryImages.map((img) => (
                                    <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                        <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><p className="text-white text-xs truncate">{img.caption || 'No Caption'}</p></div>
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => handleEditImage(img)} className="bg-white/90 text-emerald-600 p-2 rounded-full shadow-sm hover:bg-emerald-600 hover:text-white transition-all"><FiEdit /></button>
                                            <button onClick={() => handleDeleteImage(img.id)} className="bg-white/90 text-red-500 p-2 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeTab === 'articles' ? (
                        <motion.div key="articles" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                                    {editingArticleId ? <FiEdit className="text-emerald-500" /> : <FiPlus className="text-emerald-500" />}
                                    {editingArticleId ? 'Edit Article' : 'Write New Article'}
                                </h3>
                                <form onSubmit={handleArticleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Title</label>
                                            <input type="text" required value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</label>
                                            <select required value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3.5 px-4 outline-none transition-all text-sm font-bold text-emerald-900">
                                                {articleCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Image (Upload)</label>
                                            <input type="file" accept="image/*" onChange={(e) => setArticleForm({ ...articleForm, imageFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Or Image URL</label>
                                            <input type="text" value={articleForm.image_url} onChange={(e) => setArticleForm({ ...articleForm, image_url: e.target.value })} placeholder="https://..." className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Excerpt (Short Summary)</label>
                                        <textarea rows="2" value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} placeholder="A brief summary that appears on the articles page..." className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all resize-none"></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Content</label>
                                        <div className="admin-editor-container border border-gray-200">
                                            <ReactQuill
                                                theme="snow"
                                                value={articleForm.content}
                                                onChange={(value) => setArticleForm({ ...articleForm, content: value })}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="admin-editor"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        {editingArticleId && (
                                            <button
                                                type="button"
                                                onClick={resetArticleForm}
                                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button type="submit" disabled={uploading} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                                            <FiSave /> {editingArticleId ? 'Update Article' : 'Publish Article'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="space-y-4">
                                {articles.map((article) => (
                                    <div key={article.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
                                        <div><h4 className="font-bold text-lg text-emerald-900">{article.title}</h4><p className="text-sm text-gray-400">By {article.author_name} • {new Date(article.created_at).toLocaleDateString()}</p></div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditArticle(article)} className="p-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"><FiEdit /></button>
                                            <button onClick={() => handleDeleteArticle(article.id)} className="p-3 text-red-400 bg-red-50 hover:bg-red-100 hover:text-red-500 rounded-xl transition-all"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeTab === 'books' ? (
                        <motion.div key="books" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2"><FiBook className="text-emerald-500" /> Add New Book</h3>
                                <form onSubmit={handleBookSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Book Title</label><input type="text" required value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Author</label><input type="text" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Semester (e.g. 2026/1)</label><input type="text" value={bookForm.semester} onChange={(e) => setBookForm({ ...bookForm, semester: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Book PDF File</label><input type="file" accept=".pdf" required onChange={(e) => setBookForm({ ...bookForm, bookFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Image (Optional)</label><input type="file" accept="image/*" onChange={(e) => setBookForm({ ...bookForm, imageFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" /></div>
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label><textarea rows="4" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all resize-none"></textarea></div>
                                    <div className="flex justify-end gap-3">
                                        {editingBookId && (
                                            <button
                                                type="button"
                                                onClick={resetBookForm}
                                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={uploading}
                                            className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {uploading ? 'PROCESSING...' : <><FiSave /> {editingBookId ? 'Update Book' : 'Upload Book'}</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {books.map((book) => (
                                    <div key={book.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                                        <div className="aspect-[3/4] bg-gray-50 relative">
                                            {book.image_url ? <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><FiBook className="text-6xl" /></div>}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button onClick={() => handleEditBook(book)} className="p-3 bg-white/90 text-emerald-600 rounded-xl shadow-lg hover:bg-emerald-600 hover:text-white transition-all"><FiEdit /></button>
                                                <button onClick={() => handleDeleteBook(book.id)} className="p-3 bg-white/90 text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all"><FiTrash2 /></button>
                                            </div>
                                        </div>
                                        <div className="p-6"><h4 className="font-bold text-emerald-900 truncate">{book.title}</h4><p className="text-xs text-gray-400 mt-1">{book.author || 'Unknown Author'}</p></div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeTab === 'events' ? (
                        <motion.div key="events" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2"><FiCalendar className="text-emerald-500" /> Manage Fellowship Flyer</h3>
                                <form onSubmit={handleEventSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Title</label><input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} placeholder="e.g. Sunday Fellowship, Special Praise Night" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bible Reference (Optional)</label><input type="text" value={eventForm.bible_reference} onChange={(e) => setEventForm({ ...eventForm, bible_reference: e.target.value })} placeholder="e.g. John 3:16" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div className="md:col-span-2"><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Description / Details</label><textarea rows="3" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} placeholder="Details about the service..." className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all resize-none"></textarea></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Event Date</label><input type="datetime-local" required value={eventForm.event_date} onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Display Time</label><input type="text" required value={eventForm.event_time} onChange={(e) => setEventForm({ ...eventForm, event_time: e.target.value })} placeholder="e.g. 3:00 PM PROMPT" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location</label><input type="text" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} placeholder="e.g. Architecture Auditorium" className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Flyer Flyer (Upload)</label>
                                            <input type="file" accept="image/*" onChange={(e) => setEventForm({ ...eventForm, imageFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        {editingEventId && (
                                            <button
                                                type="button"
                                                onClick={resetEventForm}
                                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button disabled={uploading} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                                            {uploading ? 'PROCESSING...' : <><FiSave /> {editingEventId ? 'Update Event Flyer' : 'Publish Event Flyer'}</>}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-lg font-bold text-emerald-900 flex items-center gap-2">Published Flyers</h4>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {fellowshipEvents.map((event) => {
                                        const isPast = new Date(event.event_date) < new Date();
                                        return (
                                            <div key={event.id} className={`bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col ${isPast ? 'opacity-60' : ''}`}>
                                                <div className="aspect-[4/5] bg-gray-50 relative">
                                                    <img src={event.flyer_url} alt={event.title} className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                                                    <div className="absolute top-4 left-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isPast ? 'bg-gray-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                                            {isPast ? 'Past Event' : 'Upcoming'}
                                                        </span>
                                                    </div>
                                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                        <button onClick={() => handleEditEvent(event)} className="p-3 bg-white/90 text-emerald-600 rounded-xl shadow-lg hover:bg-emerald-600 hover:text-white transition-all"><FiEdit /></button>
                                                        <button onClick={() => handleDeleteEvent(event.id)} className="p-3 bg-white/90 text-red-500 rounded-xl shadow-lg hover:bg-red-500 hover:text-white transition-all"><FiTrash2 /></button>
                                                    </div>
                                                </div>
                                                <div className="p-6">
                                                    <h4 className="font-bold text-emerald-900 truncate">{event.title}</h4>
                                                    <p className="text-xs text-gray-400 mt-1">{new Date(event.event_date).toLocaleDateString()} • {event.event_time}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">{event.location}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ) : activeTab === 'news' ? (
                        <motion.div key="news" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2"><FiBell className="text-emerald-500" /> Post News / Update</h3>
                                    <button onClick={cleanupNews} className="text-xs font-bold text-red-400 hover:text-red-500 hover:underline">
                                        Cleanup Old News (2 Weeks+)
                                    </button>
                                </div>
                                <form onSubmit={handleNewsSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Headline</label><input type="text" required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category (e.g. Event, Update)</label><input type="text" required value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">News Image (Upload) {editingNewsId && '(Optional)'}</label><input type="file" accept="image/*" onChange={(e) => setNewsForm({ ...newsForm, imageFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Or Image URL</label><input type="text" value={newsForm.image_url} onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">News Details (Full Content)</label>
                                        <div className="admin-editor-container border border-gray-200">
                                            <ReactQuill
                                                theme="snow"
                                                value={newsForm.content}
                                                onChange={(value) => setNewsForm({ ...newsForm, content: value })}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="admin-editor"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        {editingNewsId && (
                                            <button
                                                type="button"
                                                onClick={resetNewsForm}
                                                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button disabled={uploading} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                                            <FiSave /> {editingNewsId ? 'Update News' : 'Post Update'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="space-y-4">
                                {news.map((item) => (
                                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
                                        <div><h4 className="font-bold text-lg text-emerald-900">{item.title}</h4><p className="text-sm text-gray-400">{item.category} • {new Date(item.created_at).toLocaleDateString()}</p></div>
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEditNews(item)} className="p-3 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all"><FiEdit /></button>
                                            <button onClick={() => handleDeleteNews(item.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeTab === 'weekly_posts' ? (
                        <motion.div key="weekly_posts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
                                    {editingWeeklyPostId ? <FiEdit className="text-emerald-500" /> : <FiPlus className="text-emerald-500" />}
                                    {editingWeeklyPostId ? 'Edit Weekly Post' : 'Add Weekly Post'}
                                </h3>
                                <form onSubmit={handleWeeklyPostSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Weekly Flyer (Upload) {editingWeeklyPostId && '(Optional)'}</label>
                                            <input type="file" accept="image/*" onChange={(e) => setWeeklyPostForm({ ...weeklyPostForm, imageFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Or Image URL</label>
                                            <input type="text" value={weeklyPostForm.image_url} onChange={(e) => setWeeklyPostForm({ ...weeklyPostForm, image_url: e.target.value })} placeholder="https://..." className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        {editingWeeklyPostId && (
                                            <button type="button" onClick={resetWeeklyPostForm} className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all">Cancel</button>
                                        )}
                                        <button disabled={uploading} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
                                            <FiSave /> {editingWeeklyPostId ? 'Update Flyer' : 'Post Flyer'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {weeklyPosts.map((post) => (
                                    <div key={post.id} className="group relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                        {post.image_url ? (
                                            <img src={post.image_url} alt="Weekly" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                                <FiImage size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => handleEditWeeklyPost(post)} className="bg-white/90 text-emerald-600 p-2 rounded-full shadow-sm hover:bg-emerald-600 hover:text-white transition-all"><FiEdit /></button>
                                            <button onClick={() => handleDeleteWeeklyPost(post.id)} className="bg-white/90 text-red-500 p-2 rounded-full shadow-sm hover:bg-red-500 hover:text-white transition-all"><FiTrash2 /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : activeTab === 'messages' ? (
                        <motion.div key="messages" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-black text-emerald-900">Inbound Inquiries</h3>
                                <div className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                    {contactMessages.filter(m => m.status === 'unread').length} Unread
                                </div>
                            </div>

                            <div className="space-y-4">
                                {contactMessages.length === 0 ? (
                                    <div className="bg-white p-20 rounded-[2.5rem] text-center border border-gray-100">
                                        <div className="text-5xl mb-6 opacity-20">📭</div>
                                        <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">No messages yet</p>
                                    </div>
                                ) : contactMessages.map((msg) => (
                                    <div key={msg.id} className={`bg-white p-8 rounded-[2rem] border transition-all ${msg.status === 'unread' ? 'border-emerald-500 shadow-lg shadow-emerald-500/5' : 'border-gray-100 opacity-80'}`}>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${msg.status === 'unread' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    <FiMessageSquare />
                                                </div>
                                                <div>
                                                    <h4 className="font-black text-emerald-900">{msg.first_name} {msg.last_name}</h4>
                                                    <p className="text-xs text-gray-400 font-bold">{msg.email} • {new Date(msg.created_at).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {msg.status === 'unread' && (
                                                    <button onClick={() => handleMarkAsRead(msg.id)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm" title="Mark as Read"><FiCheckCircle /></button>
                                                )}
                                                <button onClick={() => handleDeleteMessage(msg.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Delete"><FiTrash2 /></button>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-6 rounded-2xl">
                                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <a href={`mailto:${msg.email}`} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-800 flex items-center gap-2">
                                                Reply via Email <FiSend />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2"><FiUsers className="text-emerald-500" /> Manage Admins</h3>
                                <form onSubmit={searchUsers} className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="text"
                                        placeholder="Search user by email address..."
                                        value={userSearchTerm}
                                        onChange={(e) => setUserSearchTerm(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all"
                                    />
                                    <button disabled={searchingUsers} className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg flex items-center justify-center gap-2 w-full sm:w-auto">
                                        <FiSearch /> Search
                                    </button>
                                </form>
                            </div>

                            <div className="space-y-4">
                                {userResults.map((u) => (
                                    <div key={u.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
                                        <div>
                                            <h4 className="font-bold text-lg text-emerald-900">{u.full_name || 'Unknown Name'}</h4>
                                            <p className="text-sm text-gray-400">{u.email} • {u.school} • {u.department}</p>
                                        </div>
                                        <div>
                                            {u.is_admin ? (
                                                <button onClick={() => toggleAdminStatus(u.id, true)} className="px-4 py-2 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all text-xs border border-red-100">Revoke Admin</button>
                                            ) : (
                                                <button onClick={() => toggleAdminStatus(u.id, false)} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all text-xs border border-emerald-100">Make Admin</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {userResults.length === 0 && userSearchTerm && !searchingUsers && (
                                    <p className="text-gray-400 italic text-center py-8">No users found or search not initiated.</p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminPanel;
