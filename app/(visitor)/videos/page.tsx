"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Play, Search, ExternalLink, Calendar, Film } from "lucide-react";
import { dbGet } from "@/lib/db";

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

function VideosContent() {
  const searchParams = useSearchParams();
  const initialVideoId = searchParams.get("id");

  const [videos, setVideos] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    dbGet("videos").then((v) => {
      setVideos(v);
      if (initialVideoId) {
        const found = v.find((item) => item.youtubeId === initialVideoId);
        if (found) setActiveVideo(found);
        else if (v.length > 0) setActiveVideo(v[0]);
      } else if (v.length > 0) {
        setActiveVideo(v[0]);
      }
    });
    dbGet("subjects").then(setSubjects);
  }, [initialVideoId]);

  const filteredVideos = videos.filter((vid) => {
    const matchesSearch = 
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || vid.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center">
            <Film className="w-8 h-8 mr-2 text-accent" />
            <span>Video Lectures</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            Watch free subject-wise classes by Strong Competitor.
          </p>
        </div>
        
        {/* YouTube Subscribe Button */}
        <a
          href="https://www.youtube.com/@strongcompetitor?sub_confirmation=1"
          target="_blank"
          rel="noreferrer"
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-red-600/20 hover:shadow-red-600/35 transition-all duration-300 flex items-center space-x-2 w-fit transform hover:-translate-y-0.5"
        >
          <Youtube className="w-5 h-5 fill-current" />
          <span>Subscribe Channel</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Grid: Player & Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Player Area */}
        <div className="lg:col-span-2 space-y-5">
          {activeVideo ? (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-none"
                />
              </div>
              <div className="glass-card p-6 rounded-2xl border border-white space-y-3">
                <span className="inline-block bg-primary/10 text-primary text-xs font-extrabold px-3 py-1 rounded-lg uppercase">
                  {subjects.find(s => s.id === activeVideo.subjectId)?.name || "Video Lecture"}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                  {activeVideo.title}
                </h2>
                <div className="flex items-center space-x-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(activeVideo.publishedAt).toLocaleDateString("en-IN")}
                  </span>
                  <span>Duration: {activeVideo.duration}</span>
                </div>
                <p className="text-slate-600 text-sm font-semibold leading-relaxed pt-2 border-t border-slate-100">
                  {activeVideo.description}
                </p>
              </div>
            </div>
          ) : (
            <div className="aspect-video rounded-3xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
              Select a lecture to start playing
            </div>
          )}
        </div>

        {/* Playlist & Filter Panel */}
        <div className="space-y-6 lg:col-span-1">
          {/* Search and Filter */}
          <div className="glass-card p-5 rounded-2xl border border-white space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Search & Filters</h3>
            
            <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary rounded-xl px-3 py-1 transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-slate-800 text-xs font-semibold py-2"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Filter By Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-primary"
              >
                <option value="all">All Subjects</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Videos Playlist list */}
          <div className="glass-card rounded-2xl border border-white overflow-hidden flex flex-col max-h-[500px]">
            <div className="p-4 bg-primary text-white font-bold text-sm tracking-wider uppercase">
              Lectures Playlist ({filteredVideos.length})
            </div>
            <div className="overflow-y-auto divide-y divide-slate-100 flex-grow">
              {filteredVideos.map((vid) => {
                const isActive = activeVideo?.id === vid.id;
                return (
                  <button
                    key={vid.id}
                    onClick={() => setActiveVideo(vid)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                      isActive 
                        ? "bg-primary/5 border-l-4 border-primary" 
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-white fill-current" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-xs font-extrabold line-clamp-2 leading-snug ${isActive ? "text-primary" : "text-slate-800"}`}>
                        {vid.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-bold block">{vid.duration}</span>
                    </div>
                  </button>
                );
              })}
              {filteredVideos.length === 0 && (
                <div className="p-6 text-center text-xs font-bold text-slate-400">
                  No lectures found matching search.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Videos() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading videos...</div>}>
      <VideosContent />
    </Suspense>
  );
}
