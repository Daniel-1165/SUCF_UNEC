import React, { useState, useEffect } from 'react';
import { FiLinkedin, FiMail, FiInstagram, FiTwitter, FiEdit, FiPlus, FiTrash2, FiX, FiSave, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import SEO from '../components/SEO';

const Executives = () => {
    const { user } = useAuth();
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExec, setEditingExec] = useState(null);
    const [formData, setFormData] = useState({ name: '', role: '', dept: '', img_url: '', imgFile: null });
    const [uploading, setUploading] = useState(false);

    const fetchExecutives = async () => {
        try {
            const { data, error } = await supabase
                .from('executives')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) throw error;
            setExecutives(data || []);
        } catch (error) {
            console.error('Error fetching executives:', error);
            // Fallback for demo if table doesn't exist yet/empty
            if (executives.length === 0) setExecutives([
                { id: '1', name: "Bro. Zuby Benjamin", role: "President", dept: "Surveying", img_url: "/assets/execs/president.jpg" },
                { id: '2', name: "Sis. Onyiyechi Ogbonna", role: "Vice President", dept: "Medicine", img_url: "/assets/execs/ifunanya.jpg" },
                { id: '3', name: "Sis. Fear God", role: "General Secretary", dept: "Nursing Science", img_url: "/assets/execs/blessing.jpg" },
                { id: '4', name: "Bro. Wisdom Ogbonna", role: "Prayer Secretary", dept: "Architecture", img_url: "/assets/execs/emmanuel.jpg" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExecutives();
    }, []);

    const handleEditClick = (exec) => {
        setEditingExec(exec);
        setFormData({
            name: exec.name,
            role: exec.role,
            dept: exec.dept,
            img_url: exec.img_url,
            imgFile: null
        });
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setEditingExec(null);
        setFormData({ name: '', role: '', dept: '', img_url: '', imgFile: null });
        setIsModalOpen(true);
    };

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `executives/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('content-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('content-images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            let finalImageUrl = formData.img_url;
            if (formData.imgFile) {
                finalImageUrl = await uploadImage(formData.imgFile);
            }

            const submitData = {
                name: formData.name,
                role: formData.role,
                dept: formData.dept,
                img_url: finalImageUrl
            };

            if (editingExec) {
                // Update
                const { error } = await supabase
                    .from('executives')
                    .update(submitData)
                    .eq('id', editingExec.id);
                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from('executives')
                    .insert([submitData]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            fetchExecutives();
        } catch (error) {
            alert('Error saving: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!editingExec || !window.confirm('Delete this executive?')) return;
        try {
            const { error } = await supabase.from('executives').delete().eq('id', editingExec.id);
            if (error) throw error;
            setIsModalOpen(false);
            fetchExecutives();
        } catch (error) {
            alert('Error deleting: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 zeni-mesh-gradient relative">
            <SEO
                title="Executives"
                description="Meet the dedicated team of servants leading SUCF UNEC for the current academic session."
            />
            <div className="container mx-auto px-6 text-center mb-24 max-w-2xl">
                <motion.div
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="section-tag mb-6"
                >
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    The Servants
                </motion.div>

                <h1 className="text-5xl md:text-8xl font-black text-[#00211F] mb-8 leading-none tracking-tighter">
                    The <span className="text-emerald-600 italic">Council.</span>
                </h1>

                <p className="text-[#00211F] text-xl font-medium opacity-40 leading-relaxed">
                    Standard bearers and visionaries upholding righteous standards for the {new Date().getMonth() >= 7 ? `${new Date().getFullYear()}/${new Date().getFullYear() + 1}` : `${new Date().getFullYear() - 1}/${new Date().getFullYear()}`} academic session.
                </p>

                {user?.isAdmin && (
                    <button
                        onClick={handleAddClick}
                        className="mt-8 px-6 py-3 bg-emerald-900 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-800 transition-all shadow-lg flex items-center gap-2 mx-auto"
                    >
                        <FiPlus className="text-lg" /> Add Executive
                    </button>
                )}
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 max-w-7xl">
                {executives.map((exec, idx) => (
                    <motion.div
                        key={exec.id || idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        className="relative group pt-16"
                    >
                        {/* Zeni Style Card */}
                        <div className="zeni-card h-full p-8 pt-32 text-center group-hover:bg-white transition-all duration-500 relative">

                            {/* Admin Overlay Trigger */}
                            {user?.isAdmin && (
                                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(exec)}
                                        className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                                        title="Edit Executive"
                                    >
                                        <FiEdit />
                                    </button>
                                </div>
                            )}

                            {/* Avatar - Floating above/within the card */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                                    <div className="w-44 h-44 rounded-full overflow-hidden border-8 border-[#F5F9F7] shadow-2xl relative z-10 group-hover:border-emerald-50 transition-all duration-500">
                                        <img
                                            src={exec.img_url || exec.img}
                                            alt={exec.name}
                                            className="w-full h-full object-cover transition-all duration-700"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="h-full flex flex-col">
                                <div className="mb-6">
                                    <h3 className="text-xl font-black text-[#00211F] mb-2 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                                        {exec.name}
                                    </h3>
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-3">
                                        {exec.role}
                                    </p>
                                    <div className="h-px w-8 bg-emerald-100 mx-auto group-hover:w-12 transition-all" />
                                </div>

                                <p className="text-xs text-[#00211F] font-bold uppercase tracking-widest opacity-30 mb-8">
                                    {exec.dept}
                                </p>

                                {/* Social Icons - Zeni Style */}
                                <div className="mt-auto flex justify-center gap-4">
                                    {[FiInstagram, FiLinkedin, FiTwitter].map((Icon, i) => (
                                        <button
                                            key={i}
                                            className="w-10 h-10 rounded-xl bg-[#F5F9F7] text-emerald-900/40 flex items-center justify-center hover:bg-[#00211F] hover:text-white transition-all shadow-sm"
                                        >
                                            <Icon className="text-lg" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Note Section */}
            <div className="container mx-auto px-6 mt-40 max-w-5xl text-center">
                <div className="zeni-card p-12 bg-white/40 backdrop-blur-md border-emerald-100/50">
                    <p className="text-[#00211F] text-lg font-medium opacity-40 leading-relaxed italic">
                        "Leading a generation to uphold righteous standards, excelling in spirit and in truth."
                    </p>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl overflow-hidden"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {editingExec ? 'Edit Executive' : 'Add Executive'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                                    <FiX />
                                </button>
                            </div>

                            <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role</label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Department</label>
                                        <input
                                            type="text"
                                            value={formData.dept}
                                            onChange={e => setFormData({ ...formData, dept: e.target.value })}
                                            className="w-full bg-slate-50 border-none rounded-xl p-3 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Profile Image</label>
                                    <div className="flex gap-4 items-center">
                                        {(formData.img_url || formData.imgFile) && (
                                            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 shrink-0">
                                                <img
                                                    src={formData.imgFile ? URL.createObjectURL(formData.imgFile) : formData.img_url}
                                                    className="w-full h-full object-cover"
                                                    alt="Preview"
                                                />
                                            </div>
                                        )}
                                        <label className="flex-1 cursor-pointer bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 rounded-xl p-4 flex items-center justify-center gap-2 text-slate-500 font-bold text-sm transition-colors">
                                            <FiUpload />
                                            {formData.imgFile ? formData.imgFile.name : "Upload Photo"}
                                            <input type="file" accept="image/*" className="hidden" onChange={e => setFormData({ ...formData, imgFile: e.target.files[0] })} />
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    {editingExec && (
                                        <button
                                            type="button"
                                            onClick={handleDelete}
                                            className="p-4 bg-red-50 text-red-500 rounded-xl font-bold hover:bg-red-100 transition-colors"
                                            title="Delete"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-1 bg-emerald-900 text-white p-4 rounded-xl font-bold hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        {uploading ? 'Saving...' : <><FiSave /> Save Executive</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Executives;
