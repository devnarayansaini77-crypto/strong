"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Trophy, Clock, Search, HelpCircle, ArrowRight, Star } from "lucide-react";
import { dbGet } from "@/lib/db";

export default function MCQPracticeHub() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [mcqCountMap, setMcqCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    dbGet("subjects").then(setSubjects);
    dbGet("mcqs").then((list) => {
      const counts: Record<string, number> = {};
      list.forEach((q) => {
        counts[q.subjectId] = (counts[q.subjectId] || 0) + 1;
      });
      setMcqCountMap(counts);
    });
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
            <Trophy className="w-8 h-8 mr-2 text-accent" />
            <span>MCQ & Mock Test Practice</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Crack competitive exams with real-time practice. Immediate detailed explanations. No login required.
          </p>
        </div>
      </div>

      {/* Daily Quiz & Mock Test Promoters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Daily Quiz */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white space-y-4 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold w-fit">
              <Clock className="w-3.5 h-3.5" />
              <span>Daily Live</span>
            </div>
            <h3 className="text-xl font-black leading-snug">Daily Current Affairs & GK Quiz</h3>
            <p className="text-xs text-white/80 font-semibold">
              Attempt 10 fresh questions updated daily to keep your exam preparation on track.
            </p>
          </div>
          <Link
            href="/mcq/practice/detail?id=daily-quiz"
            className="bg-white hover:bg-slate-50 text-amber-700 py-3 rounded-xl font-extrabold text-sm text-center shadow-md block transform hover:-translate-y-0.5 transition-all"
          >
            Start Daily Quiz
          </Link>
        </div>

        {/* Weekly Mock Test */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-3xl p-6 text-white space-y-4 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="space-y-2">
            <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold w-fit">
              <Star className="w-3.5 h-3.5" />
              <span>Full Syllabus</span>
            </div>
            <h3 className="text-xl font-black leading-snug">Complete RSMSSB / RPSC Mock Test</h3>
            <p className="text-xs text-white/80 font-semibold">
              Full-length mock exam with timed negative marking parameters modeled on real tests.
            </p>
          </div>
          <Link
            href="/mcq/practice/detail?id=full-mock"
            className="bg-accent hover:bg-accent-dark text-white py-3 rounded-xl font-extrabold text-sm text-center shadow-md block transform hover:-translate-y-0.5 transition-all"
          >
            Attempt Full Mock
          </Link>
        </div>

        {/* Info card */}
        <div className="glass-card p-6 rounded-3xl border border-white flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-800 text-lg">Self-Evaluation Center</h3>
            <p className="text-xs text-slate-500 font-semibold leading-relaxed">
              We shuffle and randomize our questions library for every practice attempt. Use detailed explanations at the end of each question to quickly patch up subject weaknesses.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50 text-xs font-bold text-slate-600 flex items-center justify-between">
            <span>Total Library Questions:</span>
            <span className="text-primary font-extrabold text-sm">1,500+</span>
          </div>
        </div>
      </div>

      {/* Subject-wise Practice Selection */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-primary-dark">Subject-wise MCQ Practice</h2>
            <p className="text-slate-500 text-sm font-semibold">Practice topic-wise questions sorted by subject</p>
          </div>

          <div className="relative flex items-center bg-white shadow-sm border border-slate-200 focus-within:border-primary rounded-2xl px-4 py-1.5 w-full sm:max-w-xs transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 text-xs font-semibold py-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => {
            const count = mcqCountMap[sub.id] || 0;
            return (
              <div 
                key={sub.id} 
                className="glass-card p-5 rounded-2xl border border-white flex justify-between items-center group"
              >
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-sm text-slate-800 leading-snug">{sub.name}</h3>
                  <span className="text-[10px] text-slate-400 font-extrabold block">
                    {count > 0 ? `${count} Practice MCQs` : "0 Questions configured"}
                  </span>
                </div>
                <Link
                  href={count > 0 ? `/mcq/practice/detail?id=${sub.id}` : "#"}
                  className={`p-2.5 rounded-xl transition-all ${
                    count > 0 
                      ? "bg-primary/5 text-primary hover:bg-primary hover:text-white" 
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
