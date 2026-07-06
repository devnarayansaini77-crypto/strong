"use client";

import { useEffect, useState } from "react";
import { Download, Search, FileText, ArrowUpDown } from "lucide-react";
import { dbGet } from "@/lib/db";

export default function FreePdfs() {
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    dbGet("pdfs").then((p) => setPdfs(p.filter((item) => !item.isPremium)));
    dbGet("subjects").then(setSubjects);
  }, []);

  const filteredPdfs = pdfs
    .filter((pdf) => {
      const matchesSearch = 
        pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pdf.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === "all" || pdf.subjectId === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      if (sortBy === "downloads") return b.downloadsCount - a.downloadsCount;
      if (sortBy === "pages") return b.pagesCount - a.pagesCount;
      return b.id.localeCompare(a.id); // mock sorting for latest
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center">
            <FileText className="w-8 h-8 mr-2 text-accent" />
            <span>Free PDF Library</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Instant downloads for exam syllabus notes and daily updates. No account required.
          </p>
        </div>
      </div>

      {/* Filters Panel */}
      <div className="glass-card p-6 rounded-2xl border border-white grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Search */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Search Title / Keyword</label>
          <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary rounded-xl px-3 py-1.5 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search PDF notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 text-xs font-semibold py-2"
            />
          </div>
        </div>

        {/* Subject Filter */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject Category</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="latest">Latest Uploads</option>
            <option value="downloads">Most Popular</option>
            <option value="pages">Length (Pages)</option>
          </select>
        </div>
      </div>

      {/* PDF Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPdfs.map((pdf) => (
          <div 
            key={pdf.id} 
            className="glass-card rounded-2xl overflow-hidden border border-white p-5 flex flex-col justify-between space-y-6 hover:shadow-lg transition-all"
          >
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-primary/5 rounded-xl flex items-center justify-center relative border border-slate-100 shadow-inner">
                <FileText className="w-14 h-14 text-primary/10" />
                <span className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                  {pdf.language}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase">
                  Free
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                  {subjects.find((s) => s.id === pdf.subjectId)?.name || "Study Material"}
                </span>
                <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">
                  {pdf.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">
                  {pdf.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100/50">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-extrabold block">Size: {pdf.fileSize}</span>
                <span className="text-[10px] text-slate-400 font-extrabold block">{pdf.pagesCount} Pages</span>
              </div>
              <a
                href={pdf.fileUrl}
                download
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md hover:shadow-primary/20 transition-all flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Download Free</span>
              </a>
            </div>
          </div>
        ))}

        {filteredPdfs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold space-y-2">
            <p className="text-lg">No Free PDFs found matching search.</p>
            <p className="text-sm font-medium">Try sorting by other subjects or clearing query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
