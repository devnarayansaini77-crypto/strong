"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Search, Sparkles, LayoutGrid } from "lucide-react";
import { dbGet } from "@/lib/db";

function SubjectsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    dbGet("subjects").then(setSubjects);
  }, []);

  const filteredSubjects = subjects.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center">
            <LayoutGrid className="w-8 h-8 mr-2 text-accent" />
            <span>Syllabus & Subjects</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Access exam syllabus, videos, notes, and interactive quizzes by subject.
          </p>
        </div>

        {/* Search */}
        <div className="relative flex items-center bg-white shadow-sm border border-slate-200 focus-within:border-primary rounded-2xl px-4 py-1.5 w-full md:max-w-sm transition-all">
          <Search className="w-5 h-5 text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search subjects (e.g. Rajasthan GK, Polity)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent focus:outline-none text-slate-800 text-sm font-semibold py-2"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSubjects.map((sub) => (
          <Link
            key={sub.id}
            href={`/subjects/detail?id=${sub.id}`}
            className="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-6 border border-white transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/5 text-primary border border-primary/10">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  Syllabus Course Notes & MCQ Tests
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-primary pt-3 border-t border-slate-100/50">
              <span>View Materials</span>
              <span className="p-1 rounded-lg bg-primary/5 group-hover:bg-primary group-hover:text-white transition-colors">→</span>
            </div>
          </Link>
        ))}

        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold space-y-2">
            <p className="text-lg">No subjects found matching "{searchQuery}"</p>
            <p className="text-sm font-medium">Try searching other keywords like GK, Math, CET, or Science.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Subjects() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading subjects...</div>}>
      <SubjectsContent />
    </Suspense>
  );
}
