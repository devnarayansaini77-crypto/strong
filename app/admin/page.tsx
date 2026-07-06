"use client";

import { useEffect, useState } from "react";
import { 
  Lock, 
  LayoutDashboard, 
  Video, 
  FileText, 
  Trophy, 
  Calendar, 
  FileSpreadsheet, 
  Bell, 
  Sliders, 
  Settings, 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock,
  Sparkles,
  Save
} from "lucide-react";
import { 
  dbGet, 
  dbAdd, 
  dbSet, 
  dbDelete, 
  getSettings, 
  updateSettings,
  SUBJECTS_LIST
} from "@/lib/db";

export default function AdminPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "videos" | "pdfs" | "mcqs" | "current-affairs" | "pyqs" | "updates" | "banners" | "settings"
  >("dashboard");

  // Database States
  const [videos, setVideos] = useState<any[]>([]);
  const [pdfs, setPdfs] = useState<any[]>([]);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [currentAffairs, setCurrentAffairs] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [updates, setUpdates] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>({});

  // CRUD Item Edit / Add Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState<"video" | "pdf" | "mcq" | "ca" | "pyq" | "update" | "banner">("video");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Bulk MCQ Importer States
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkImportFormat, setBulkImportFormat] = useState<"json" | "csv">("csv");
  const [bulkText, setBulkText] = useState("");
  const [bulkSubjectId, setBulkSubjectId] = useState(SUBJECTS_LIST[0].id);
  const [bulkChapter, setBulkChapter] = useState("Chapter 1");
  const [bulkTopic, setBulkTopic] = useState("General");
  const [bulkImportError, setBulkImportError] = useState("");
  const [bulkImportSuccess, setBulkImportSuccess] = useState("");

  // Check auth on mount & load settings
  useEffect(() => {
    getSettings().then(setGlobalSettings);
    const authStatus = sessionStorage.getItem("admin_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      loadAllAdminData();
    }
  }, [isAuthenticated]);

  const loadAllAdminData = () => {
    dbGet("videos").then(setVideos);
    dbGet("pdfs").then(setPdfs);
    dbGet("mcqs").then(setMcqs);
    dbGet("current_affairs").then(setCurrentAffairs);
    dbGet("previous_papers").then(setPyqs);
    dbGet("exam_updates").then(setUpdates);
    dbGet("banners").then(setBanners);
    getSettings().then(setGlobalSettings);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = globalSettings?.adminPassword || "admin123";
    if (password === correctPassword) {
      sessionStorage.setItem("admin_authenticated", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid Administrator password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    setIsAuthenticated(false);
  };

  // CRUD Operations
  const openAddForm = (type: typeof formType) => {
    setFormType(type);
    setEditingId(null);
    setFormData(getInitialFormData(type));
    setIsFormOpen(true);
  };

  const openEditForm = (type: typeof formType, item: any) => {
    setFormType(type);
    setEditingId(item.id);
    setFormData({ ...item });
    setIsFormOpen(true);
  };

  const getInitialFormData = (type: typeof formType) => {
    switch (type) {
      case "video":
        return { title: "", youtubeId: "", description: "", subjectId: SUBJECTS_LIST[0].id, duration: "10:00", thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80", publishedAt: new Date().toISOString() };
      case "pdf":
        return { title: "", description: "", subjectId: SUBJECTS_LIST[0].id, isPremium: false, price: 0, fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileSize: "1.2 MB", pagesCount: 10, language: "Hindi", previewPages: [] };
      case "mcq":
        return { question: "", options: ["", "", "", ""], answerIndex: 0, explanation: "", subjectId: SUBJECTS_LIST[0].id, chapter: "Chapter 1", topic: "General" };
      case "ca":
        return { title: "", content: "", type: "daily", publishedDate: new Date().toISOString() };
      case "pyq":
        return { examName: "REET", year: 2026, subjectId: SUBJECTS_LIST[0].id, pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", fileSize: "2.5 MB" };
      case "update":
        return { title: "", category: "notification", content: "", link: "", publishedAt: new Date().toISOString() };
      case "banner":
        return { title: "", subtitle: "", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80", actionLink: "/", type: "hero" };
    }
  };

  const handleSaveFormData = async (e: React.FormEvent) => {
    e.preventDefault();
    const collectionMap = {
      video: "videos",
      pdf: "pdfs",
      mcq: "mcqs",
      ca: "current_affairs",
      pyq: "previous_papers",
      update: "exam_updates",
      banner: "banners"
    };

    const collName = collectionMap[formType];

    if (editingId) {
      await dbSet(collName, editingId, formData);
    } else {
      await dbAdd(collName, formData);
    }

    setIsFormOpen(false);
    loadAllAdminData();
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setBulkImportError("");
    setBulkImportSuccess("");

    if (!bulkText.trim()) {
      setBulkImportError("Please provide content to import.");
      return;
    }

    let parsedQuestions: any[] = [];

    if (bulkImportFormat === "json") {
      try {
        const parsed = JSON.parse(bulkText);
        if (!Array.isArray(parsed)) {
          setBulkImportError("JSON must be a list (array) of question objects.");
          return;
        }
        for (const item of parsed) {
          if (!item.question || !Array.isArray(item.options) || item.options.length < 4 || typeof item.answerIndex !== "number") {
            setBulkImportError("Each question in JSON must contain: question (string), options (list of 4 strings), and answerIndex (number 0-3).");
            return;
          }
          parsedQuestions.push({
            question: item.question.trim(),
            options: item.options.map((o: any) => String(o).trim()),
            answerIndex: item.answerIndex,
            explanation: item.explanation ? item.explanation.trim() : "",
            subjectId: item.subjectId || bulkSubjectId,
            chapter: item.chapter || bulkChapter,
            topic: item.topic || bulkTopic
          });
        }
      } catch (err: any) {
        setBulkImportError("Invalid JSON syntax: " + err.message);
        return;
      }
    } else {
      // Pipe separated parsing
      const lines = bulkText.split("\n");
      let lineNum = 0;
      for (const line of lines) {
        lineNum++;
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith("#")) continue;

        const parts = trimmedLine.split("|");
        if (parts.length < 6) {
          setBulkImportError(`Line ${lineNum}: Expected at least 6 values separated by | (Question | Opt A | Opt B | Opt C | Opt D | Correct Index).`);
          return;
        }

        const question = parts[0].trim();
        const options = [parts[1].trim(), parts[2].trim(), parts[3].trim(), parts[4].trim()];
        const ansIdx = parseInt(parts[5].trim());
        const explanation = parts[6] ? parts[6].trim() : "";

        if (isNaN(ansIdx) || ansIdx < 0 || ansIdx > 3) {
          setBulkImportError(`Line ${lineNum}: Correct index must be a number between 0 and 3.`);
          return;
        }

        parsedQuestions.push({
          question,
          options,
          answerIndex: ansIdx,
          explanation,
          subjectId: bulkSubjectId,
          chapter: bulkChapter,
          topic: bulkTopic
        });
      }
    }

    if (parsedQuestions.length === 0) {
      setBulkImportError("No questions parsed. Check format structure.");
      return;
    }

    try {
      for (const q of parsedQuestions) {
        await dbAdd("mcqs", q);
      }
      setBulkImportSuccess(`Successfully imported ${parsedQuestions.length} MCQ questions!`);
      setBulkText("");
      loadAllAdminData();
      setTimeout(() => {
        setIsBulkImportOpen(false);
        setBulkImportSuccess("");
      }, 2000);
    } catch (err: any) {
      setBulkImportError("Database error during upload: " + err.message);
    }
  };

  const handleDeleteItem = async (type: typeof formType, id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      const collectionMap = {
        video: "videos",
        pdf: "pdfs",
        mcq: "mcqs",
        ca: "current_affairs",
        pyq: "previous_papers",
        update: "exam_updates",
        banner: "banners"
      };
      await dbDelete(collectionMap[type], id);
      loadAllAdminData();
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(globalSettings);
    alert("Website configurations updated successfully!");
  };

  // Secure Authentication Interface
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.200),transparent)] opacity-40" />
        
        <div className="glass-card max-w-md w-full p-8 rounded-3xl border border-white shadow-2xl relative z-10 space-y-6">
          <div className="text-center space-y-2 animate-float">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-primary-dark">Strong Competitor</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Secure Administrator Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (hint: admin123)"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-semibold focus:outline-none focus:border-primary text-slate-800"
              />
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-extrabold text-primary hover:text-primary-dark uppercase tracking-wider transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 border border-red-100 py-2.5 rounded-xl">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-primary/25 transform hover:-translate-y-0.5 transition-all text-sm"
            >
              Sign In to Dashboard
            </button>
          </form>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForgotModal(false)} />
            
            <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-slate-200 z-10 animate-fade-in flex flex-col">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                  Recover Password
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowForgotModal(false)} 
                  className="text-slate-400 hover:text-slate-600 font-extrabold text-lg"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4 text-xs font-semibold text-slate-600 leading-relaxed">
                <p>
                  Aapka administrator password database me saved hai. Ise recover ya reset karne ke liye niche diye gaye instructions follow karein:
                </p>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-800 space-y-3">
                  <span className="font-bold uppercase tracking-wider text-[10px] block text-slate-500">Direct Password Reset</span>
                  <p className="text-[11px] text-slate-500">
                    Aap direct yahan se naya password set kar sakte hain:
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter new password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary flex-grow"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (!newPasswordInput.trim()) {
                          alert("Password empty nahi ho sakta!");
                          return;
                        }
                        const updated = { ...globalSettings, adminPassword: newPasswordInput };
                        try {
                          await updateSettings(updated);
                          alert("Password successfully reset! Ab aap naye password se login kar sakte hain.");
                          setGlobalSettings(updated);
                          setShowForgotModal(false);
                          setNewPasswordInput("");
                        } catch (err) {
                          alert("Failed to reset password.");
                        }
                      }}
                      className="bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-colors"
                    >
                      Set Password
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-800 space-y-2">
                  <span className="font-bold uppercase tracking-wider text-[10px] block">Local (Development) Mode</span>
                  <p className="text-[11px]">
                    Agar aap locally test kar rahe hain, toh aap browser localStorage settings ko clear karke password ko defaults (`admin123`) par reset kar sakte hain.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Kya aap sach me sabhi database settings ko clear karke password default ('admin123') par reset karna chahte hain?")) {
                        localStorage.removeItem("strong_competitor_db");
                        window.location.reload();
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-colors inline-block mt-1"
                  >
                    Reset Local Storage to Default
                  </button>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-amber-800 space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] block">Production (Live Website) Mode</span>
                  <p className="text-[11px]">
                    Agar aapki website deployed hai, toh aap apne **Firebase Console** me login karein. **Firestore Database** section me **`settings/global`** document ko check karein, wahan aapko **`adminPassword`** field mil jayega jise aap direct modify/edit kar sakte hain.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl uppercase tracking-wider text-[10px] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard layout configuration
  const sidebarTabs = [
    { id: "dashboard", name: "Overview", icon: LayoutDashboard },
    { id: "videos", name: "YouTube Videos", icon: Video },
    { id: "pdfs", name: "PDF Library", icon: FileText },
    { id: "mcqs", name: "MCQs Engine", icon: Trophy },
    { id: "current-affairs", name: "Current Affairs", icon: Calendar },
    { id: "pyqs", name: "PYQ Papers", icon: FileSpreadsheet },
    { id: "updates", name: "Exam Updates", icon: Bell },
    { id: "banners", name: "Banner Ads", icon: Sliders },
    { id: "settings", name: "Global Config", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Nav */}
      <aside className="w-full md:w-64 bg-primary-dark text-slate-300 flex flex-col justify-between shrink-0 p-5 md:min-h-screen border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo */}
          <div className="space-y-1 py-2">
            <span className="font-extrabold text-lg text-white block">STRONG ADMIN</span>
            <span className="text-[10px] text-accent font-black uppercase tracking-wider">Editor Panel v1.0</span>
          </div>

          <nav className="space-y-1.5">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 mt-8 text-sm font-semibold text-slate-400 hover:text-white hover:bg-red-950/30 rounded-xl transition-all w-full text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 md:p-10 space-y-8 max-w-7xl mx-auto w-full">
        {/* Top Navbar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <h2 className="text-2xl font-black text-slate-800 capitalize tracking-tight">
            {activeTab.replace("-", " ")} Management
          </h2>
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Local Database Active</span>
          </div>
        </div>

        {/* Dynamic Panels */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            {/* Stats widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-card p-6 rounded-3xl border border-white flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Visitors</span>
                  <span className="text-xl font-black text-slate-800">42,580</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shadow-inner">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Revenue</span>
                  <span className="text-xl font-black text-slate-800">₹57,420</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center shadow-inner">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">MCQs Played</span>
                  <span className="text-xl font-black text-slate-800">{mcqs.length * 150}</span>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shadow-inner">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase block">Lectures</span>
                  <span className="text-xl font-black text-slate-800">{videos.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Analytics Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="glass-card p-6 rounded-3xl border border-white space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Recent Activity Log</h3>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Premium PDF "Polity Master Class" Purchased</span>
                    <span className="text-slate-400">10 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold py-1.5 border-b border-slate-100">
                    <span className="text-slate-600">Visitor from Jaipur solved Rajasthan GK Quiz</span>
                    <span className="text-slate-400">45 mins ago</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold py-1.5">
                    <span className="text-slate-600">New YouTube video synced successfully</span>
                    <span className="text-slate-400">2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white space-y-4">
                <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wide">Library Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold block">PDFs</span>
                    <span className="text-lg font-black text-primary">{pdfs.length}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold block">MCQs</span>
                    <span className="text-lg font-black text-primary">{mcqs.length}</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold block">Alerts</span>
                    <span className="text-lg font-black text-primary">{updates.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. YouTube Videos Panel */}
        {activeTab === "videos" && (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => openAddForm("video")}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lecture Video</span>
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {videos.map((vid) => (
                    <tr key={vid.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{vid.title}</td>
                      <td className="p-4 uppercase">{SUBJECTS_LIST.find(s => s.id === vid.subjectId)?.name || vid.subjectId}</td>
                      <td className="p-4">{vid.duration}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("video", vid)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem("video", vid.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PDFs Management Panel */}
        {activeTab === "pdfs" && (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => openAddForm("pdf")}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New PDF Note</span>
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pdfs.map((pdf) => (
                    <tr key={pdf.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{pdf.title}</td>
                      <td className="p-4 uppercase">{SUBJECTS_LIST.find(s => s.id === pdf.subjectId)?.name || pdf.subjectId}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${pdf.isPremium ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}`}>
                          {pdf.isPremium ? "Premium" : "Free"}
                        </span>
                      </td>
                      <td className="p-4 font-bold">₹{pdf.price}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("pdf", pdf)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem("pdf", pdf.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. MCQs Management Panel */}
        {activeTab === "mcqs" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => openAddForm("mcq")}
                className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add MCQ Question</span>
              </button>
              <button
                onClick={() => setIsBulkImportOpen(true)}
                className="bg-accent hover:bg-accent-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Bulk Import MCQs</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Question</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Chapter</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mcqs.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{q.question}</td>
                      <td className="p-4 uppercase">{SUBJECTS_LIST.find(s => s.id === q.subjectId)?.name || q.subjectId}</td>
                      <td className="p-4">{q.chapter}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("mcq", q)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem("mcq", q.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Current Affairs Panel */}
        {activeTab === "current-affairs" && (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => openAddForm("ca")}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Current Affairs Post</span>
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentAffairs.map((ca) => (
                    <tr key={ca.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{ca.title}</td>
                      <td className="p-4 uppercase">{ca.type}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("ca", ca)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem("ca", ca.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. PYQ Papers Panel */}
        {activeTab === "pyqs" && (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => openAddForm("pyq")}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Upload PYQ Paper</span>
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Exam Name</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Year</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pyqs.map((py) => (
                    <tr key={py.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800">{py.examName}</td>
                      <td className="p-4 uppercase">{SUBJECTS_LIST.find(s => s.id === py.subjectId)?.name || py.subjectId}</td>
                      <td className="p-4">{py.year}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("pyq", py)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem("pyq", py.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. Exam Updates Panel */}
        {activeTab === "updates" && (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => openAddForm("update")}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Notification Update</span>
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {updates.map((up) => (
                    <tr key={up.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{up.title}</td>
                      <td className="p-4 uppercase">{up.category}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("update", up)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem("update", up.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. Banner Advertisements */}
        {activeTab === "banners" && (
          <div className="space-y-6 animate-fade-in">
            <button
              onClick={() => openAddForm("banner")}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-xl font-bold text-xs shadow-md flex items-center space-x-1.5 transform hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Banner AD</span>
            </button>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Type</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {banners.map((ban) => (
                    <tr key={ban.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-800 max-w-xs truncate">{ban.title}</td>
                      <td className="p-4 uppercase">{ban.type}</td>
                      <td className="p-4 text-right space-x-2">
                        <button onClick={() => openEditForm("banner", ban)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteItem("banner", ban.id)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. Global Configurations Settings */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="glass-card p-6 md:p-8 rounded-3xl border border-white space-y-6 animate-fade-in max-w-2xl">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Website Branding</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Logo Text</label>
                <input
                  type="text"
                  required
                  value={globalSettings.logoText || ""}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, logoText: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Tagline</label>
                <input
                  type="text"
                  required
                  value={globalSettings.tagline || ""}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, tagline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pt-4 border-t border-slate-100">Contact Channels</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Contact Email</label>
                <input
                  type="email"
                  required
                  value={globalSettings.email || ""}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Phone Number</label>
                <input
                  type="text"
                  required
                  value={globalSettings.phone || ""}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">YouTube URL</label>
                <input
                  type="url"
                  required
                  value={globalSettings.youtubeUrl || ""}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, youtubeUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Telegram Channel URL</label>
                <input
                  type="url"
                  required
                  value={globalSettings.telegramUrl || ""}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, telegramUrl: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider pt-4 border-t border-slate-100">Security</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Admin Portal Password</label>
                <input
                  type="text"
                  required
                  value={globalSettings.adminPassword || "admin123"}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, adminPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all text-xs flex items-center space-x-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Configurations</span>
              </button>
            </div>
          </form>
        )}
      </main>

      {/* Editor Modal Popup Drawer */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFormOpen(false)} />
          
          <form 
            onSubmit={handleSaveFormData}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-200 z-10 animate-fade-in flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                {editingId ? "Edit Item" : "Create Resource"} ({formType})
              </h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-grow text-xs font-semibold text-slate-700">
              {/* Form Input fields dynamically matched to FormType */}
              {formType === "video" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Video Title</label>
                    <input type="text" required value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">YouTube Video ID</label>
                    <input type="text" required value={formData.youtubeId || ""} onChange={(e) => setFormData({ ...formData, youtubeId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" placeholder="e.g. WnLy5q60-m8" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject Category</label>
                    <select value={formData.subjectId || ""} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                      {SUBJECTS_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Duration</label>
                    <input type="text" required value={formData.duration || ""} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Description</label>
                    <textarea rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs resize-none" />
                  </div>
                </>
              )}

              {formType === "pdf" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">PDF Book Title</label>
                    <input type="text" required value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject Category</label>
                    <select value={formData.subjectId || ""} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                      {SUBJECTS_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center space-x-3 py-2">
                    <input type="checkbox" id="isPremium" checked={formData.isPremium || false} onChange={(e) => setFormData({ ...formData, isPremium: e.target.checked })} className="w-4 h-4" />
                    <label htmlFor="isPremium" className="text-xs font-bold text-slate-700">Premium Product (Locked behind Razorpay checkout)</label>
                  </div>
                  {formData.isPremium && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Price (INR)</label>
                      <input type="number" required value={formData.price || 0} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Language</label>
                    <input type="text" required value={formData.language || ""} onChange={(e) => setFormData({ ...formData, language: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Pages Count</label>
                    <input type="number" required value={formData.pagesCount || 0} onChange={(e) => setFormData({ ...formData, pagesCount: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">File Size</label>
                    <input type="text" required value={formData.fileSize || ""} onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Description</label>
                    <textarea rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs resize-none" />
                  </div>
                </>
              )}

              {formType === "mcq" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Question Text</label>
                    <textarea required rows={3} value={formData.question || ""} onChange={(e) => setFormData({ ...formData, question: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs resize-none" />
                  </div>
                  {[0, 1, 2, 3].map(idx => (
                    <div key={idx} className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Option {letters[idx]}</label>
                      <input 
                        type="text" 
                        required 
                        value={formData.options?.[idx] || ""} 
                        onChange={(e) => {
                          const opts = [...(formData.options || ["", "", "", ""])];
                          opts[idx] = e.target.value;
                          setFormData({ ...formData, options: opts });
                        }} 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" 
                      />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Correct Option Index (0 to 3)</label>
                    <select value={formData.answerIndex || 0} onChange={(e) => setFormData({ ...formData, answerIndex: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                      <option value="0">A</option>
                      <option value="1">B</option>
                      <option value="2">C</option>
                      <option value="3">D</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Detailed Explanation</label>
                    <textarea rows={3} value={formData.explanation || ""} onChange={(e) => setFormData({ ...formData, explanation: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject Category</label>
                      <select value={formData.subjectId || ""} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                        {SUBJECTS_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Chapter Name</label>
                      <input type="text" required value={formData.chapter || ""} onChange={(e) => setFormData({ ...formData, chapter: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                    </div>
                  </div>
                </>
              )}

              {formType === "ca" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Article Title</label>
                    <input type="text" required value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Feed Type</label>
                    <select value={formData.type || "daily"} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                      <option value="daily">Daily news</option>
                      <option value="weekly">Weekly digest</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Article Content (Markdown supported)</label>
                    <textarea required rows={6} value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs resize-none" />
                  </div>
                </>
              )}

              {formType === "pyq" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Exam Name</label>
                    <input type="text" required value={formData.examName || ""} onChange={(e) => setFormData({ ...formData, examName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject Category</label>
                    <select value={formData.subjectId || ""} onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                      {SUBJECTS_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Year</label>
                    <input type="number" required value={formData.year || 2026} onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                </>
              )}

              {formType === "update" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Update Alert Title</label>
                    <input type="text" required value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Alert Category</label>
                    <select value={formData.category || "notification"} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs">
                      <option value="notification">Notification</option>
                      <option value="admit-card">Admit Card</option>
                      <option value="result">Result</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">External Official Link</label>
                    <input type="url" value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Update Details Content</label>
                    <textarea required rows={4} value={formData.content || ""} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs resize-none" />
                  </div>
                </>
              )}

              {formType === "banner" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Banner Title</label>
                    <input type="text" required value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subtitle / Caption</label>
                    <input type="text" required value={formData.subtitle || ""} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Banner Image URL</label>
                    <input type="text" required value={formData.imageUrl || ""} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Action Call URL Link</label>
                    <input type="text" required value={formData.actionLink || ""} onChange={(e) => setFormData({ ...formData, actionLink: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" />
                  </div>
                </>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 text-right space-x-2">
              <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold shadow-md">Save Changes</button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk MCQ Importer Modal */}
      {isBulkImportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBulkImportOpen(false)} />
          
          <form 
            onSubmit={handleBulkImport}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-200 z-10 animate-fade-in flex flex-col max-h-[90vh]"
          >
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                Bulk MCQ Importer
              </h3>
              <button type="button" onClick={() => setIsBulkImportOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">×</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-grow text-xs font-semibold text-slate-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Import Format</label>
                  <select 
                    value={bulkImportFormat} 
                    onChange={(e) => setBulkImportFormat(e.target.value as any)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs"
                  >
                    <option value="csv">Pipe-Separated (Text/CSV)</option>
                    <option value="json">JSON Array</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject Category</label>
                  <select 
                    value={bulkSubjectId} 
                    onChange={(e) => setBulkSubjectId(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-xs"
                  >
                    {SUBJECTS_LIST.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Chapter Name</label>
                  <input 
                    type="text" 
                    required 
                    value={bulkChapter} 
                    onChange={(e) => setBulkChapter(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Topic Name</label>
                  <input 
                    type="text" 
                    required 
                    value={bulkTopic} 
                    onChange={(e) => setBulkTopic(e.target.value)} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Paste Data</label>
                  <span className="text-[10px] text-primary hover:underline cursor-pointer" onClick={() => {
                    if (bulkImportFormat === "csv") {
                      setBulkText("कोशिका की खोज किसने की थी? | रॉबर्ट हुक | रॉबर्ट ब्राउन | ल्यूवेनहुक | पुरकिंजे | 0 | 1665 में रॉबर्ट हुक ने खोज की।\nराजस्थान दिवस कब मनाया जाता है? | 30 मार्च | 26 जनवरी | 15 अगस्त | 1 नवंबर | 0 | प्रतिवर्ष 30 मार्च को मनाया जाता है।");
                    } else {
                      setBulkText(JSON.stringify([
                        {
                          "question": "कोशिका की खोज किसने की थी?",
                          "options": ["रॉबर्ट हुक", "रॉबर्ट ब्राउन", "ल्यूवेनहुक", "पुरकिंजे"],
                          "answerIndex": 0,
                          "explanation": "1665 में रॉबर्ट हुक ने खोज की।"
                        }
                      ], null, 2));
                    }
                  }}>Load Sample Template</span>
                </div>
                <textarea 
                  required 
                  rows={8} 
                  value={bulkText} 
                  onChange={(e) => setBulkText(e.target.value)} 
                  placeholder={
                    bulkImportFormat === "csv" 
                      ? "Format: Question | Option A | Option B | Option C | Option D | Answer Index (0-3) | Explanation\nExample:\nकोशिका की खोज किसने की थी? | रॉबर्ट हुक | रॉबर्ट ब्राउन | ल्यूवेनहुक | पुरकिंजे | 0 | 1665 में रॉबर्ट हुक ने की।"
                      : "Paste a JSON array of questions. Example:\n[\n  {\n    \"question\": \"Question text\",\n    \"options\": [\"A\", \"B\", \"C\", \"D\"],\n    \"answerIndex\": 0,\n    \"explanation\": \"Explanation text\"\n  }\n]"
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs resize-none font-mono" 
                />
              </div>

              {bulkImportError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 font-bold text-xs">
                  {bulkImportError}
                </div>
              )}

              {bulkImportSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 font-bold text-xs">
                  {bulkImportSuccess}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 text-right space-x-2">
              <button type="button" onClick={() => setIsBulkImportOpen(false)} className="px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">Cancel</button>
              <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-bold shadow-md">Start Import</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const letters = ["A", "B", "C", "D"];
