"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Play, 
  FileText, 
  Download, 
  BookOpen, 
  HelpCircle, 
  Bell, 
  ArrowRight, 
  Calendar, 
  Search, 
  Sparkles,
  Award,
  Video,
  FileSpreadsheet
} from "lucide-react";
import { dbGet, getSettings } from "@/lib/db";

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Homepage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [caList, setCaList] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("all");

  useEffect(() => {
    // Load all data from our db helper
    dbGet("subjects").then(setSubjects);
    dbGet("videos").then(v => setVideos(v.slice(0, 3)));
    dbGet("pdfs").then(p => setPdfs(p.slice(0, 4)));
    dbGet("exam_updates").then(u => setUpdates(u.slice(0, 3)));
    dbGet("current_affairs").then(ca => setCaList(ca.slice(0, 2)));
    getSettings().then(setSettings);
  }, []);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/subjects?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="space-y-16 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),theme(colors.slate.50))] opacity-40 rounded-3xl" />
        <div className="glass-card rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 border border-white/50">
          <div className="max-w-2xl space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-accent/15 border border-accent/30 text-accent-dark px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase animate-pulse-subtle">
              <Sparkles className="w-3.5 h-3.5 text-accent-dark" />
              <span>Welcome to Strong Competitor</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-primary-dark leading-[1.1] tracking-tight">
              Learn Smart. <br />
              <span className="text-accent">Practice Better.</span> <br />
              Crack Every Exam.
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 font-medium max-w-lg leading-relaxed mx-auto lg:mx-0">
              {settings.tagline || "Your complete hub for Rajasthan & Central competitive exams. Stream videos, practice MCQs, and download free study materials instantly."}
            </p>

            {/* Global Search Bar */}
            <form onSubmit={handleGlobalSearch} className="max-w-md mx-auto lg:mx-0 pt-2">
              <div className="relative flex items-center bg-white shadow-md rounded-2xl p-1.5 border border-slate-200 focus-within:border-primary transition-all">
                <Search className="w-5 h-5 text-slate-400 ml-3" />
                <input
                  type="text"
                  placeholder="Search subjects, PDFs, MCQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-slate-800 focus:outline-none text-sm font-semibold placeholder-slate-400"
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-bold shadow-md transition-all duration-300"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
              <Link
                href="/mcq"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <BookOpen className="w-5 h-5" />
                <span>Start MCQ Practice</span>
              </Link>
              <Link
                href="/pdfs/free"
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 px-6 py-3 rounded-2xl font-bold shadow-sm transition-all duration-300 flex items-center space-x-2 transform hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>Download PDFs</span>
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-md aspect-square lg:max-w-lg hidden lg:block rounded-2xl overflow-hidden shadow-2xl border border-white/40">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80"
              alt="Strong Competitor Education"
              className="object-cover w-full h-full transform hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-8">
              <div className="text-white space-y-1">
                <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center">
                  <Youtube className="w-4 h-4 mr-1 text-red-500 fill-red-500" /> YouTube Channel
                </span>
                <p className="font-extrabold text-lg">@strongcompetitor</p>
                <p className="text-xs text-white/80 font-medium">Join 100,000+ Students Learning Everyday</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Exam Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-primary-dark">Featured Subjects</h2>
            <p className="text-slate-500 text-sm font-semibold">Select a subject to access notes, quizzes, and videos</p>
          </div>
          <Link 
            href="/subjects" 
            className="text-primary hover:text-accent font-bold text-sm flex items-center transition-colors group"
          >
            <span>View All 28 Subjects</span>
            <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subjects.slice(0, 12).map((sub) => (
            <Link
              key={sub.id}
              href={`/subjects/detail?id=${sub.id}`}
              className="glass-card p-5 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 border border-white"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/5 text-primary border border-primary/10">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-slate-800 tracking-tight leading-tight line-clamp-2">
                {sub.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Latest YouTube Videos */}
      <section className="bg-primary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-3xl font-black tracking-tight text-primary-dark">Latest Video Lectures</h2>
              <p className="text-slate-500 text-sm font-semibold">Direct syllabus classes synced from official channel</p>
            </div>
            <Link 
              href="/videos" 
              className="text-primary hover:text-accent font-bold text-sm flex items-center transition-colors group"
            >
              <span>Explore All Videos</span>
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {videos.map((vid) => (
              <div key={vid.id} className="glass-card rounded-2xl overflow-hidden border border-white flex flex-col">
                <div className="relative aspect-video bg-slate-900 group cursor-pointer">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-all">
                    <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-xs font-bold px-2 py-0.5 rounded">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="inline-block bg-primary/10 text-primary text-xs font-extrabold px-2.5 py-1 rounded-lg uppercase">
                      {subjects.find(s => s.id === vid.subjectId)?.name || "Class"}
                    </span>
                    <h3 className="font-extrabold text-slate-800 line-clamp-2 leading-snug">
                      {vid.title}
                    </h3>
                  </div>
                  <Link
                    href={`/videos?id=${vid.youtubeId}`}
                    className="text-primary hover:text-accent font-bold text-sm flex items-center space-x-1"
                  >
                    <span>Watch Lecture</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PDFs Section (Free and Premium) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight text-primary-dark">Featured Study Materials</h2>
            <p className="text-slate-500 text-sm font-semibold">Instant downloads for Free and Premium PDFs</p>
          </div>
          <div className="flex space-x-4">
            <Link 
              href="/pdfs/free" 
              className="text-primary hover:text-accent font-bold text-sm flex items-center transition-all"
            >
              <span>Free PDFs</span>
            </Link>
            <span className="text-slate-300">|</span>
            <Link 
              href="/pdfs/premium" 
              className="text-primary hover:text-accent font-bold text-sm flex items-center transition-all"
            >
              <span>Premium Store</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pdfs.map((pdf) => (
            <div key={pdf.id} className="glass-card rounded-2xl overflow-hidden border border-white flex flex-col justify-between p-5 space-y-4">
              <div className="space-y-3">
                <div className="aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-100 shadow-inner">
                  <FileText className="w-12 h-12 text-primary/20" />
                  {pdf.isPremium && (
                    <span className="absolute top-2.5 right-2.5 bg-accent text-white font-extrabold text-xs px-2.5 py-1 rounded-lg uppercase shadow-sm">
                      Premium
                    </span>
                  )}
                  <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                    {pdf.language}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {subjects.find(s => s.id === pdf.subjectId)?.name || "Notes"}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-sm leading-snug line-clamp-2">
                    {pdf.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {pdf.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500">{pdf.fileSize}</span>
                {pdf.isPremium ? (
                  <Link
                    href={`/pdfs/premium?id=${pdf.id}`}
                    className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all duration-300"
                  >
                    Buy ₹{pdf.price}
                  </Link>
                ) : (
                  <a
                    href={pdf.fileUrl}
                    download
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-md transition-all duration-300 flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Exam Updates & Current Affairs */}
      <section className="bg-slate-100/50 py-16 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Exam Updates Column */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-primary-dark flex items-center space-x-2">
                <Bell className="w-6 h-6 text-accent" />
                <span>Exam Notifications</span>
              </h2>
              <p className="text-slate-500 text-sm font-semibold">Latest updates on admit cards, notifications, dates</p>
            </div>
            
            <div className="space-y-4">
              {updates.map((up) => (
                <div key={up.id} className="glass-card p-5 rounded-2xl border border-white flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      up.category === "notification" ? "bg-blue-100 text-blue-800" :
                      up.category === "admit-card" ? "bg-green-100 text-green-800" :
                      "bg-amber-100 text-amber-800"
                    }`}>
                      {up.category.replace("-", " ")}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-800 leading-snug">
                      {up.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {new Date(up.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {up.link && (
                    <a
                      href={up.link}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
            <Link href="/exam-updates" className="inline-block text-primary hover:text-accent font-bold text-sm">
              View All Updates →
            </Link>
          </div>

          {/* Current Affairs Column */}
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-primary-dark flex items-center space-x-2">
                <Calendar className="w-6 h-6 text-accent" />
                <span>Current Affairs Digest</span>
              </h2>
              <p className="text-slate-500 text-sm font-semibold">Daily & weekly updates for Rajasthan state exams</p>
            </div>

            <div className="space-y-4">
              {caList.map((ca) => (
                <div key={ca.id} className="glass-card p-5 rounded-2xl border border-white space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="bg-accent/15 text-accent-dark text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase">
                      {ca.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {new Date(ca.publishedDate).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-800 leading-snug">
                    {ca.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {ca.content}
                  </p>
                </div>
              ))}
            </div>
            <Link href="/current-affairs" className="inline-block text-primary hover:text-accent font-bold text-sm">
              Read Full Articles →
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Call to Action (Practice Section) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.4),transparent)]" />
          <Award className="w-12 h-12 text-accent mx-auto animate-float" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Test Your Knowledge?
          </h2>
          
          <p className="text-base text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Attempt subject-wise mock tests and daily quizzes. Check instant results with step-by-step detailed explanations. No login required.
          </p>

          <div className="pt-2">
            <Link
              href="/mcq"
              className="bg-accent hover:bg-accent-dark text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-accent/25 transition-all duration-300 inline-flex items-center space-x-2 transform hover:-translate-y-0.5"
            >
              <span>Practice MCQ Questions Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
