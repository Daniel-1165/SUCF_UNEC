import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiBookOpen, FiX, FiInfo, FiArrowRight } from 'react-icons/fi';

const GPACalculator = ({ isOpen, onClose }) => {
    const [courses, setCourses] = useState([
        { id: 1, name: '', units: '', grade: '5' },
        { id: 2, name: '', units: '', grade: '5' },
        { id: 3, name: '', units: '', grade: '5' },
        { id: 4, name: '', units: '', grade: '5' },
        { id: 5, name: '', units: '', grade: '5' },
        { id: 6, name: '', units: '', grade: '5' },
        { id: 7, name: '', units: '', grade: '5' },
        { id: 8, name: '', units: '', grade: '5' },
        { id: 9, name: '', units: '', grade: '5' }
    ]);
    const [result, setResult] = useState(null);

    const addCourse = () => {
        setCourses([...courses, { id: Date.now(), name: '', units: '', grade: '5' }]);
    };

    const removeCourse = (id) => {
        if (courses.length === 1) return;
        setCourses(courses.filter(c => c.id !== id));
    };

    const updateCourse = (id, field, value) => {
        setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const calculateGPA = () => {
        let totalUnits = 0;
        let totalPoints = 0;

        courses.forEach(c => {
            const units = parseFloat(c.units);
            const gradePoint = parseFloat(c.grade);
            if (!isNaN(units)) {
                totalUnits += units;
                totalPoints += (units * gradePoint);
            }
        });

        if (totalUnits === 0) {
            setResult(null);
            return;
        }

        const gpa = (totalPoints / totalUnits).toFixed(2);
        setResult(gpa);
    };

    const gradeOptions = [
        { label: 'A (5.0)', value: '5' },
        { label: 'B (4.0)', value: '4' },
        { label: 'C (3.0)', value: '3' },
        { label: 'D (2.0)', value: '2' },
        { label: 'E (1.0)', value: '1' },
        { label: 'F (0.0)', value: '0' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-[#00211F]/80 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 bg-emerald-600 text-white flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                                    <FiBookOpen /> GPA Calculator
                                </h2>
                                <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mt-1 opacity-80">Academic Stewardship</p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
                            <div className="mb-8 p-4 bg-emerald-50 rounded-2xl flex gap-4 items-start border border-emerald-100">
                                <FiInfo className="text-emerald-600 mt-1 shrink-0" />
                                <p className="text-[11px] text-emerald-800 font-medium leading-relaxed uppercase tracking-wider">
                                    Enter your course units and grades based on the standard 5.0 CGPA scale. Focus on your studies to the glory of God!
                                </p>
                            </div>

                            <div className="space-y-4">
                                {courses.map((course, index) => (
                                    <motion.div
                                        key={course.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex flex-wrap sm:flex-nowrap gap-3 items-end p-4 rounded-2xl bg-gray-50 border border-gray-100"
                                    >
                                        <div className="flex-grow min-w-[150px]">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Course {index + 1}</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. MTH 101"
                                                value={course.name}
                                                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Units</label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                value={course.units}
                                                onChange={(e) => updateCourse(course.id, 'units', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all text-center"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Grade</label>
                                            <select
                                                value={course.grade}
                                                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-500 outline-none transition-all font-bold"
                                            >
                                                {gradeOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => removeCourse(course.id)}
                                            className="p-3 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={addCourse}
                                className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700 transition-all px-4 py-2 rounded-lg hover:bg-emerald-50"
                            >
                                <FiPlus /> Add Course
                            </button>
                        </div>

                        {/* Footer / Result */}
                        <div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                                <div className="text-center sm:text-left">
                                    {result !== null ? (
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Your Calculated GPA</p>
                                            <p className="text-5xl font-black text-emerald-600 italic tracking-tighter">
                                                {result} <span className="text-xl not-italic text-gray-300">/ 5.0</span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-gray-400 italic">Enter units to calculate...</p>
                                    )}
                                </div>
                                <button
                                    onClick={calculateGPA}
                                    className="w-full sm:w-auto px-10 py-5 bg-[#00211F] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-3 group"
                                >
                                    Calculate Now <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default GPACalculator;
