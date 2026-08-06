"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiTrash2, FiBookOpen, FiX, FiInfo, FiArrowRight } from "react-icons/fi";

export default function GPACalculator({ isOpen, onClose }) {
  const [courses, setCourses] = useState([
    { id: 1, name: "", units: "", grade: "5" },
    { id: 2, name: "", units: "", grade: "5" },
    { id: 3, name: "", units: "", grade: "5" },
    { id: 4, name: "", units: "", grade: "5" },
    { id: 5, name: "", units: "", grade: "5" },
    { id: 6, name: "", units: "", grade: "5" },
    { id: 7, name: "", units: "", grade: "5" },
    { id: 8, name: "", units: "", grade: "5" },
    { id: 9, name: "", units: "", grade: "5" },
  ]);
  const [result, setResult] = useState(null);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: "", units: "", grade: "5" }]);
  };

  const removeCourse = (id) => {
    if (courses.length === 1) return;
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const calculateGPA = () => {
    let totalUnits = 0;
    let totalPoints = 0;

    courses.forEach((c) => {
      const units = parseFloat(c.units);
      const gradePoint = parseFloat(c.grade);
      if (!isNaN(units)) {
        totalUnits += units;
        totalPoints += units * gradePoint;
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
    { label: "A (5.0)", value: "5" },
    { label: "B (4.0)", value: "4" },
    { label: "C (3.0)", value: "3" },
    { label: "D (2.0)", value: "2" },
    { label: "E (1.0)", value: "1" },
    { label: "F (0.0)", value: "0" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="GPA calculator"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-900/60"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4">
              <div>
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-neutral-900">
                  <FiBookOpen className="text-emerald-700" /> GPA Calculator
                </h2>
                <p className="mt-0.5 text-[11px] text-neutral-500">Academic stewardship</p>
              </div>
              <button
                onClick={onClose}
                aria-label="Close calculator"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition-colors hover:bg-neutral-200"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto px-6 py-5 custom-scrollbar">
              <div className="mb-5 flex items-start gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <FiInfo className="mt-0.5 shrink-0 text-neutral-400" size={14} />
                <p className="text-xs leading-relaxed text-neutral-600">
                  Enter your course units and grades based on the standard 5.0 CGPA scale. Focus
                  on your studies to the glory of God!
                </p>
              </div>

              <div className="space-y-4">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 p-4 sm:flex-nowrap"
                  >
                    <div className="flex-grow min-w-[150px]">
                      <label className="mb-1.5 block text-[11px] font-medium text-neutral-600">
                        Course {index + 1}
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MTH 101"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-600"
                      />
                    </div>
                    <div className="w-24">
                      <label className="mb-1.5 block text-[11px] font-medium text-neutral-600">
                        Units
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={course.units}
                        onChange={(e) => updateCourse(course.id, "units", e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-center text-sm outline-none transition-colors focus:border-emerald-600"
                      />
                    </div>
                    <div className="w-32">
                      <label className="mb-1.5 block text-[11px] font-medium text-neutral-600">
                        Grade
                      </label>
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-emerald-600"
                      >
                        {gradeOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => removeCourse(course.id)}
                      aria-label="Remove course"
                      className="rounded-lg p-2.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                    >
                      <FiTrash2 />
                    </button>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={addCourse}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
              >
                <FiPlus /> Add Course
              </button>
            </div>

            {/* Footer / Result */}
            <div className="shrink-0 border-t border-neutral-200 bg-neutral-50 px-6 py-5">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-center sm:text-left">
                  {result !== null ? (
                    <div>
                      <p className="mb-0.5 text-[11px] text-neutral-500">
                        Your Calculated GPA
                      </p>
                      <p className="text-3xl font-semibold tracking-tight text-neutral-900">
                        {result} <span className="text-base font-normal text-neutral-400">/ 5.0</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500">Enter units to calculate</p>
                  )}
                </div>
                <button
                  onClick={calculateGPA}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700 sm:w-auto"
                >
                  Calculate <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
