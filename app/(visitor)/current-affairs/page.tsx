"use client";

import { useEffect, useState } from "react";
import { Calendar, Download, FileText, Search, BookOpen } from "lucide-react";
import { dbGet } from "@/lib/db";

export default function CurrentAffairs() {
  const [caList, setCaList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    dbGet("current_affairs").then(setCaList);
  }, []);

  const filteredCa = caList.filter((ca) => {
    const matchesSearch = 
      ca.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ca.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || ca.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center">
            <Calendar className="w-8 h-8 mr-2 text-accent" />
            <span>Current Affairs Digest</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Stay updated with daily events, weekly news compilations, and monthly study PDFs.
          </p>
        </div>
      </div>

      {/* Monthly Compilation Callout */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white bg-gradient-to-br from-primary/5 to-accent/5 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-block bg-accent/20 text-accent-dark font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
            Featured
          </div>
          <h3 className="font-extrabold text-slate-800 text-lg leading-snug">
            Monthly Current Affairs Compilation (PDF)
          </h3>
          <p className="text-xs text-slate-500 font-semibold max-w-xl leading-relaxed">
            Download the complete PDF book containing key appointments, national initiatives, sports, bills, and state affairs. Ideal for REET, RAS, and Patwari tests.
          </p>
        </div>
        
        <a
          href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          download
          className="bg-primary hover:bg-primary-dark text-white px-6 py-3.5 rounded-xl font-bold shadow-md hover:shadow-primary/25 transition-all text-xs flex items-center space-x-2 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download July 2026 PDF</span>
        </a>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-2xl border border-white grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Search Articles</label>
          <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary rounded-xl px-3 py-1.5 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search current affairs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 text-xs font-semibold py-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Filter Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="all">All Articles</option>
            <option value="daily">Daily News</option>
            <option value="weekly">Weekly Summary</option>
            <option value="monthly-pdf">Monthly PDF Releases</option>
          </select>
        </div>
      </div>

      {/* Article List */}
      <div className="space-y-6">
        {filteredCa.map((ca) => (
          <article 
            key={ca.id} 
            className="glass-card p-6 sm:p-8 rounded-3xl border border-white space-y-4 hover:shadow-md transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-lg uppercase">
                {ca.type}
              </span>
              <span className="text-xs font-bold text-slate-400">
                {new Date(ca.publishedDate).toLocaleDateString("en-IN", { 
                  day: "numeric", 
                  month: "long", 
                  year: "numeric" 
                })}
              </span>
            </div>

            <h3 className="font-extrabold text-lg text-slate-800 leading-snug">
              {ca.title}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed whitespace-pre-wrap">
              {ca.content}
            </p>
          </article>
        ))}

        {filteredCa.length === 0 && (
          <div className="py-16 text-center text-slate-400 font-bold">
            No articles found matching filters.
          </div>
        )}
      </div>
    </div>
  );
}
