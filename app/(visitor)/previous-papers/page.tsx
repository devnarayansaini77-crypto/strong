"use client";

import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, Search, Filter } from "lucide-react";
import { dbGet } from "@/lib/db";

export default function PreviousYearPapers() {
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedExam, setSelectedExam] = useState("all");

  useEffect(() => {
    dbGet("previous_papers").then(setPyqs);
    dbGet("subjects").then(setSubjects);
  }, []);

  const examsList = Array.from(new Set(pyqs.map((p) => p.examName)));

  const filteredPyqs = pyqs.filter((py) => {
    const matchesSearch = py.examName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || py.subjectId === selectedSubject;
    const matchesExam = selectedExam === "all" || py.examName === selectedExam;
    return matchesSearch && matchesSubject && matchesExam;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center">
            <FileSpreadsheet className="w-8 h-8 mr-2 text-accent" />
            <span>Previous Year Papers (PYQs)</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Download actual past papers of RPSC, RSMSSB, and Central Board Exams.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl border border-white grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Search Exam</label>
          <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary rounded-xl px-3 py-1.5 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search e.g. REET, RAS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 text-xs font-semibold py-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Filter Exam Category</label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="all">All Exams</option>
            {examsList.map((exam: any) => (
              <option key={exam} value={exam}>{exam}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Filter Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* PYQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPyqs.map((py) => (
          <div 
            key={py.id} 
            className="glass-card p-6 rounded-3xl border border-white flex items-center justify-between shadow-sm hover:shadow-md transition-all"
          >
            <div className="space-y-2">
              <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase">
                {subjects.find((s) => s.id === py.subjectId)?.name || "General"}
              </span>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
                {py.examName} Official Paper ({py.year})
              </h3>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase">File Size: {py.fileSize}</p>
            </div>
            
            <a
              href={py.pdfUrl}
              download
              className="p-3.5 rounded-2xl bg-primary/5 hover:bg-primary hover:text-white text-primary transition-all flex items-center justify-center shadow-inner"
            >
              <Download className="w-5 h-5" />
            </a>
          </div>
        ))}

        {filteredPyqs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold">
            No previous year papers configured matching filters.
          </div>
        )}
      </div>
    </div>
  );
}
