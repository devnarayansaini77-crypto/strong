"use client";

import { useEffect, useState } from "react";
import { Bell, Calendar, Search, ArrowRight, ExternalLink, Megaphone } from "lucide-react";
import { dbGet } from "@/lib/db";

export default function ExamUpdates() {
  const [updates, setUpdates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dbGet("exam_updates").then(setUpdates);
  }, []);

  const filteredUpdates = updates.filter((up) => {
    const matchesSearch = 
      up.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      up.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || up.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center">
            <Bell className="w-8 h-8 mr-2 text-accent animate-pulse-subtle" />
            <span>Exam Notifications & Updates</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Latest alerts on vacancies, admit cards, dates, results, and official announcements.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl border border-white grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Search Alerts</label>
          <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary rounded-xl px-3 py-1.5 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 text-xs font-semibold py-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Notification Type</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="all">All Alerts</option>
            <option value="notification">Latest Notifications</option>
            <option value="admit-card">Admit Cards</option>
            <option value="exam-date">Exam Dates</option>
            <option value="result">Exam Results</option>
          </select>
        </div>
      </div>

      {/* Timeline Alert lists */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {filteredUpdates.map((up) => (
          <div 
            key={up.id} 
            className="glass-card p-6 rounded-3xl border border-white flex flex-col sm:flex-row justify-between items-start gap-4 hover:shadow-md transition-all relative overflow-hidden"
          >
            {/* Soft background line decorator */}
            <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-primary" />
            
            <div className="space-y-3 pl-2 sm:pl-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${
                  up.category === "notification" ? "bg-blue-100 text-blue-800" :
                  up.category === "admit-card" ? "bg-green-100 text-green-800" :
                  up.category === "result" ? "bg-purple-100 text-purple-800" :
                  "bg-amber-100 text-amber-800"
                }`}>
                  {up.category.replace("-", " ")}
                </span>
                
                <span className="text-[10px] text-slate-400 font-bold flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1" />
                  {new Date(up.publishedAt).toLocaleDateString("en-IN", { 
                    day: "numeric", 
                    month: "long", 
                    year: "numeric" 
                  })}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-slate-800 leading-snug">
                {up.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                {up.content}
              </p>
            </div>

            {up.link && (
              <a
                href={up.link}
                target="_blank"
                rel="noreferrer"
                className="bg-slate-50 hover:bg-primary hover:text-white border border-slate-200 hover:border-primary text-slate-600 px-4 py-2.5 rounded-xl text-xs font-extrabold shadow-sm flex items-center space-x-1 sm:self-center shrink-0 transition-all duration-300"
              >
                <span>Official Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ))}

        {filteredUpdates.length === 0 && (
          <div className="py-16 text-center text-slate-400 font-bold">
            No active exam updates configured at this moment.
          </div>
        )}
      </div>
    </div>
  );
}
