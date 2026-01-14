import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiFileText, FiUpload, FiTrash2, FiPlus, FiSave, FiX, FiBook, FiBell, FiEdit } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const galleryCategories = ['Events', 'Worship', 'Fellowship', 'Outreach'];
const articleCategories = ['Spiritual Growth', 'Academic', 'Prayer', 'Testimony'];

// Quill editor configuration
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'blockquote', 'code-block'],
        [{ 'align': [] }],
        ['clean']
    ]
};

const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'blockquote', 'code-block', 'align'
];

const AdminPanel = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('gallery'); // 'gallery', 'articles', 'books', 'news'

    // Gallery State
    const [galleryImages, setGalleryImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [newImage, setNewImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('Events');

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
        file_url: '',
        image_url: '',
        bookFile: null,
        imageFile: null
    });

    // News State
    const [news, setNews] = useState([]);
    const [newsForm, setNewsForm] = useState({
        title: '',
        content: '',
        image_url: '',
        category: 'General',
        imageFile: null
    });

    // Initial Load & Auth Check
    useEffect(() => {
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
            // Verified Admin
            fetchGallery();
            fetchArticles();
            fetchBooks();
            fetchNews();

            if (user?.user_metadata?.full_name && articleForm.author_name === 'Admin') {
                setArticleForm(prev => ({ ...prev, author_name: user.user_metadata.full_name }));
            }
        }
    }, [user, authLoading, navigate]);

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
        if (!newImage) return alert("Please select an image");

        setUploading(true);
        try {
            const publicUrl = await uploadFile(newImage, 'content-images', 'gallery');
            const { error: dbError } = await supabase.from('gallery').insert([
                { image_url: publicUrl, caption: caption, category: category }
            ]);

            if (dbError) throw dbError;
            setNewImage(null);
            setCaption('');
            setCategory('Events');
            fetchGallery();
            alert("Image uploaded successfully!");
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.message);
        } finally {
            setUploading(false);
        }
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
            if (bookForm.bookFile) finalFileUrl = await uploadFile(bookForm.bookFile, 'content-files', 'books');
            if (bookForm.imageFile) finalImageUrl = await uploadFile(bookForm.imageFile, 'content-images', 'book-covers');

            const { bookFile, imageFile, ...submitData } = bookForm;
            const { error } = await supabase.from('books').insert([{ ...submitData, file_url: finalFileUrl, image_url: finalImageUrl }]);
            if (error) throw error;
            setBookForm({ title: '', author: '', description: '', semester: '', file_url: '', image_url: '', bookFile: null, imageFile: null });
            fetchBooks();
            alert("Book added!");
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
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
            const { error } = await supabase.from('news').insert([{ ...submitData, image_url: finalImageUrl }]);
            if (error) throw error;
            setNewsForm({ title: '', content: '', image_url: '', category: 'General', imageFile: null });
            fetchNews();
            alert("News posted!");
        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteNews = async (id) => {
        if (!window.confirm("Delete this news item?")) return;
        const { error } = await supabase.from('news').delete().eq('id', id);
        if (!error) fetchNews();
    };

    if (authLoading || (user && user.isAdmin === undefined)) {
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
                <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-black text-emerald-900 mb-2">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage your content and visual assets.</p>
                    </div>
                    <div className="flex gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mt-6 md:mt-0 flex-wrap justify-center">
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
                    </div>
                </div>

                <AnimatePresence mode='wait'>
                    {activeTab === 'gallery' ? (
                        <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2"><FiUpload className="text-emerald-500" /> Upload New Image</h3>
                                <form onSubmit={handleImageUpload} className="flex flex-col md:flex-row gap-6 items-end">
                                    <div className="w-full md:w-1/3">
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image File</label>
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
                                    <button disabled={uploading} className="bg-emerald-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-50">{uploading ? '...' : 'Upload'}</button>
                                </form>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {galleryImages.map((img) => (
                                    <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                        <img src={img.image_url} alt={img.caption} className="w-full h-full object-cover" />
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent"><p className="text-white text-xs truncate">{img.caption || 'No Caption'}</p></div>
                                        <button onClick={() => handleDeleteImage(img.id)} className="absolute top-3 right-3 bg-white/90 text-red-500 p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><FiTrash2 /></button>
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
                                        <div className="bg-gray-50 rounded-xl overflow-hidden border border-transparent focus-within:bg-white focus-within:border-emerald-500 transition-all">
                                            <ReactQuill
                                                theme="snow"
                                                value={articleForm.content}
                                                onChange={(value) => setArticleForm({ ...articleForm, content: value })}
                                                modules={quillModules}
                                                formats={quillFormats}
                                                className="h-64 mb-12"
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
                                        <button disabled={uploading} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">
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
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Semester (e.g. 2025/1)</label><input type="text" value={bookForm.semester} onChange={(e) => setBookForm({ ...bookForm, semester: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Book PDF File</label><input type="file" accept=".pdf" required onChange={(e) => setBookForm({ ...bookForm, bookFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cover Image (Optional)</label><input type="file" accept="image/*" onChange={(e) => setBookForm({ ...bookForm, imageFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" /></div>
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</label><textarea rows="4" value={bookForm.description} onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all resize-none"></textarea></div>
                                    <div className="flex justify-end"><button disabled={uploading} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2">{uploading ? '...' : <><FiSave /> Upload Book</>}</button></div>
                                </form>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {books.map((book) => (
                                    <div key={book.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl transition-all flex flex-col">
                                        <div className="aspect-[3/4] bg-gray-50 relative">
                                            {book.image_url ? <img src={book.image_url} alt={book.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-200"><FiBook className="text-6xl" /></div>}
                                            <button onClick={() => handleDeleteBook(book.id)} className="absolute top-4 right-4 p-3 bg-white/90 text-red-500 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"><FiTrash2 /></button>
                                        </div>
                                        <div className="p-6"><h4 className="font-bold text-emerald-900 truncate">{book.title}</h4><p className="text-xs text-gray-400 mt-1">{book.author || 'Unknown Author'}</p></div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="news" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                                <h3 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2"><FiBell className="text-emerald-500" /> Post News / Update</h3>
                                <form onSubmit={handleNewsSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Headline</label><input type="text" required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category (e.g. Event, Update)</label><input type="text" required value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">News Image (Upload)</label><input type="file" accept="image/*" onChange={(e) => setNewsForm({ ...newsForm, imageFile: e.target.files[0] })} className="w-full text-sm text-gray-500 py-2.5 px-4 border-2 border-dashed border-gray-100 rounded-xl hover:border-emerald-500 transition-colors cursor-pointer bg-white" /></div>
                                        <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Or Image URL</label><input type="text" value={newsForm.image_url} onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all" /></div>
                                    </div>
                                    <div><label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Details</label><textarea required rows="4" value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} className="w-full bg-gray-50 border border-transparent focus:bg-white focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all resize-none"></textarea></div>
                                    <div className="flex justify-end"><button disabled={uploading} className="bg-emerald-900 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"><FiSave /> Post Update</button></div>
                                </form>
                            </div>
                            <div className="space-y-4">
                                {news.map((item) => (
                                    <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 flex justify-between items-center group hover:shadow-md transition-all">
                                        <div><h4 className="font-bold text-lg text-emerald-900">{item.title}</h4><p className="text-sm text-gray-400">{item.category} • {new Date(item.created_at).toLocaleDateString()}</p></div>
                                        <button onClick={() => handleDeleteNews(item.id)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><FiTrash2 /></button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminPanel;
