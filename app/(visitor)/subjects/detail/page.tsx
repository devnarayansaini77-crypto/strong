"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Play, 
  FileText, 
  Download, 
  BookOpen, 
  HelpCircle, 
  ChevronRight, 
  FileSpreadsheet, 
  Award,
  Video,
  ExternalLink
} from "lucide-react";
import { dbGet, dbGetById } from "@/lib/db";

function SubjectDetailContent() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("id") || "";

  const [subject, setSubject] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<"videos" | "pdfs" | "mcqs" | "pyqs">("videos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Fetch subject detail
    dbGetById("subjects", subjectId).then(sub => {
      if (sub) {
        setSubject(sub);
      } else {
        // Fallback for custom subject id matching standard list
        const found = dbGet("subjects").then(list => {
          const matched = list.find(s => s.id === subjectId);
          if (matched) setSubject(matched);
        });
      }
    });

    // Fetch related content
    dbGet("videos").then(v => setVideos(v.filter(item => item.subjectId === subjectId)));
    dbGet("pdfs").then(p => setPdfs(p.filter(item => item.subjectId === subjectId)));
    dbGet("mcqs").then(m => setMcqs(m.filter(item => item.subjectId === subjectId)));
    dbGet("previous_papers").then(py => setPyqs(py.filter(item => item.subjectId === subjectId)));
    
    setLoading(false);
  }, [subjectId]);

  if (loading || !subject) {
    return <div className="text-center py-20 font-bold text-slate-500">Loading subject materials...</div>;
  }

  const tabs = [
    { id: "videos", name: "Lectures", count: videos.length },
    { id: "pdfs", name: "PDF Notes", count: pdfs.length },
    { id: "mcqs", name: "Practice MCQs", count: mcqs.length },
    { id: "pyqs", name: "Past Papers", count: pyqs.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Breadcrumb & Header */}
      <div className="space-y-4 border-b border-slate-200 pb-6">
        <nav className="flex items-center space-x-1.5 text-xs font-bold text-slate-400">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/subjects" className="hover:text-primary">Subjects</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600">{subject.name}</span>
        </nav>
        
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-primary-dark tracking-tight">
            {subject.name}
          </h1>
          <p className="text-slate-500 font-semibold text-sm max-w-xl">
            Syllabus, free video lectures, handwritten study notes, practice MCQs, and previous year papers for {subject.name}.
          </p>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 border-b-2 font-bold text-sm transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-primary hover:border-slate-300"
              }`}
            >
              <span>{tab.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="min-h-[300px]">
          {/* 1. Lectures Tab */}
          {activeTab === "videos" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div key={vid.id} className="glass-card rounded-2xl overflow-hidden border border-white flex flex-col justify-between">
                  <div className="relative aspect-video bg-slate-900 group cursor-pointer">
                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center shadow-md">
                        <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2 leading-snug">
                      {vid.title}
                    </h3>
                    <Link
                      href={`/videos?id=${vid.youtubeId}`}
                      className="text-primary hover:text-accent font-bold text-xs flex items-center space-x-1"
                    >
                      <span>Watch Lecture</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 font-bold">
                  No video lectures uploaded yet for this subject.
                </div>
              )}
            </div>
          )}

          {/* 2. PDFs Tab */}
          {activeTab === "pdfs" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((pdf) => (
                <div key={pdf.id} className="glass-card p-5 rounded-2xl border border-white flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-lg ${
                        pdf.isPremium ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {pdf.isPremium ? "Premium" : "Free PDF"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">{pdf.language}</span>
                    </div>
                    <h3 className="font-extrabold text-sm text-slate-800 line-clamp-2">
                      {pdf.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold line-clamp-2 leading-relaxed">
                      {pdf.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-bold">{pdf.fileSize} ({pdf.pagesCount} pages)</span>
                    {pdf.isPremium ? (
                      <Link
                        href={`/pdfs/premium?id=${pdf.id}`}
                        className="bg-accent hover:bg-accent-dark text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm"
                      >
                        Buy Now ₹{pdf.price}
                      </Link>
                    ) : (
                      <a
                        href={pdf.fileUrl}
                        download
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm flex items-center space-x-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {pdfs.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 font-bold">
                  No notes or study materials uploaded yet for this subject.
                </div>
              )}
            </div>
          )}

          {/* 3. MCQ Practice Tab */}
          {activeTab === "mcqs" && (
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <h3 className="font-extrabold text-lg text-slate-800">Practice Syllabus Questions</h3>
                  <p className="text-xs text-slate-500 font-semibold max-w-md">
                    Test your understanding with topic-wise questions. Features timers, instant answers, detailed explanations, and review tools.
                  </p>
                </div>
                <Link
                  href={`/mcq/practice/detail?id=${subjectId}`}
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md transform hover:-translate-y-0.5 transition-all flex items-center space-x-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Start MCQ Practice</span>
                </Link>
              </div>

              {mcqs.length > 0 && (
                <div className="glass-card rounded-2xl border border-white overflow-hidden">
                  <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-xs text-slate-600 uppercase tracking-wider">
                    Syllabus Chapters ({mcqs.length} Questions available)
                  </div>
                  <div className="divide-y divide-slate-100 p-4 space-y-3">
                    {Array.from(new Set(mcqs.map(q => q.chapter))).map((chap: any, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 text-sm font-bold text-slate-700">
                        <span>{chap}</span>
                        <span className="text-xs font-semibold text-slate-400">
                          {mcqs.filter(q => q.chapter === chap).length} MCQs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {mcqs.length === 0 && (
                <div className="py-16 text-center text-slate-400 font-bold">
                  No practice questions uploaded yet for this subject.
                </div>
              )}
            </div>
          )}

          {/* 4. Past Papers Tab */}
          {activeTab === "pyqs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pyqs.map((py) => (
                <div key={py.id} className="glass-card p-5 rounded-2xl border border-white flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-800 text-sm">{py.examName} Paper</h3>
                    <p className="text-xs font-bold text-slate-400">Year: {py.year} • {py.fileSize}</p>
                  </div>
                  <a
                    href={py.pdfUrl}
                    download
                    className="p-3 rounded-xl bg-primary/5 hover:bg-primary hover:text-white text-primary transition-all flex items-center justify-center"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
              {pyqs.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 font-bold">
                  No previous year papers uploaded yet for this subject.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SubjectDetail() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading subject materials...</div>}>
      <SubjectDetailContent />
    </Suspense>
  );
}
