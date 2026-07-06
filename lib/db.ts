import { isFirebaseMock, db } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";

// The 28 requested subjects
export const SUBJECTS_LIST = [
  { id: "rajasthan-gk", name: "Rajasthan GK", icon: "MapPin" },
  { id: "indian-polity", name: "Indian Polity", icon: "BookOpen" },
  { id: "constitution", name: "Constitution", icon: "FileText" },
  { id: "indian-history", name: "Indian History", icon: "History" },
  { id: "geography", name: "Geography", icon: "Globe" },
  { id: "science", name: "Science", icon: "FlaskConical" },
  { id: "physics", name: "Physics", icon: "Activity" },
  { id: "chemistry", name: "Chemistry", icon: "Sparkles" },
  { id: "biology", name: "Biology", icon: "Heart" },
  { id: "mathematics", name: "Mathematics", icon: "Percent" },
  { id: "reasoning", name: "Reasoning", icon: "Compass" },
  { id: "hindi", name: "Hindi", icon: "PenTool" },
  { id: "english", name: "English", icon: "Languages" },
  { id: "computer", name: "Computer", icon: "Laptop" },
  { id: "current-affairs", name: "Current Affairs", icon: "Calendar" },
  { id: "bns", name: "BNS (Bharatiya Nyaya Sanhita)", icon: "Scale" },
  { id: "bnss", name: "BNSS (Bharatiya Nagarik Suraksha Sanhita)", icon: "Shield" },
  { id: "rajasthan-acts", name: "Rajasthan Acts", icon: "Gavel" },
  { id: "lab-assistant", name: "Lab Assistant", icon: "Users" },
  { id: "cet", name: "CET (Common Eligibility Test)", icon: "Award" },
  { id: "ldc", name: "LDC Exam", icon: "Briefcase" },
  { id: "reet", name: "REET Teacher Exam", icon: "GraduationCap" },
  { id: "ras", name: "RAS (Rajasthan Administrative Services)", icon: "Crown" },
  { id: "ssc", name: "SSC Exams", icon: "TrendingUp" },
  { id: "upsc", name: "UPSC Exams", icon: "Bookmark" },
  { id: "railway", name: "Railway Exams", icon: "Train" },
  { id: "police", name: "Police Exam", icon: "ShieldCheck" },
  { id: "patwari", name: "Patwari Exam", icon: "ClipboardList" }
];

// Pre-populated default database
const DEFAULT_DATABASE = {
  subjects: SUBJECTS_LIST.map(sub => ({
    ...sub,
    chapters: ["Chapter 1: Introduction", "Chapter 2: Important Topics", "Chapter 3: Mock Questions"]
  })),
  videos: [
    {
      id: "vid1",
      youtubeId: "WnLy5q60-m8", // Placeholder education video
      title: "Rajasthan GK Geography Master Class | CET, LDC, REET, RAS",
      description: "Complete geography course overview for Rajasthan competitive exams. Subscribe to Strong Competitor for daily updates.",
      subjectId: "rajasthan-gk",
      publishedAt: new Date().toISOString(),
      thumbnailUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
      duration: "45:12"
    },
    {
      id: "vid2",
      youtubeId: "eUvC6Y1Fm78",
      title: "Indian Constitution Preamble & Key Features | Polity for UPSC & SSC",
      description: "Understanding the Preamble of the Indian Constitution, its sources, and historical perspective.",
      subjectId: "constitution",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      thumbnailUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80",
      duration: "32:45"
    },
    {
      id: "vid3",
      youtubeId: "W2F8mK15R1s",
      title: "Science: Human Circulatory System Details for CET & REET",
      description: "Detailed study of human heart structure and blood circulation mechanism for exam aspirants.",
      subjectId: "biology",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      thumbnailUrl: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=600&auto=format&fit=crop&q=80",
      duration: "24:10"
    }
  ],
  pdfs: [
    {
      id: "pdf1",
      title: "Rajasthan History & Culture Hand-Written Notes",
      description: "Premium comprehensive notes compiled by topper experts. Fully optimized for Patwari, CET, and RAS exams.",
      subjectId: "rajasthan-gk",
      isPremium: false,
      price: 0,
      previewPages: [],
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "4.2 MB",
      pagesCount: 88,
      language: "Hindi",
      downloadsCount: 1420
    },
    {
      id: "pdf2",
      title: "Complete Indian Polity & Constitution Master PDF",
      description: "Includes detailed explanation of all Articles (1 to 395) with latest amendments up to 2026. A must-buy for RAS & UPSC.",
      subjectId: "constitution",
      isPremium: true,
      price: 99,
      previewPages: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop&q=80"
      ],
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "8.5 MB",
      pagesCount: 245,
      language: "Bilingual",
      downloadsCount: 580
    },
    {
      id: "pdf3",
      title: "Current Affairs Monthly Compilation - July 2026",
      description: "Complete current affairs notes covering Rajasthan GK, national updates, sports, summits, and new bill summaries.",
      subjectId: "current-affairs",
      isPremium: false,
      price: 0,
      previewPages: [],
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "2.1 MB",
      pagesCount: 32,
      language: "Hindi",
      downloadsCount: 924
    }
  ],
  mcqs: [
    {
      id: "mcq1",
      subjectId: "rajasthan-gk",
      chapter: "Chapter 1: History",
      topic: "Ancient Civilizations",
      question: "कालीबंगा सभ्यता की खोज सर्वप्रथम किसने की थी?",
      options: ["अमलानंद घोष", "बी.बी. लाल", "के.एन. पुरी", "आर.सी. अग्रवाल"],
      answerIndex: 0,
      explanation: "कालीबंगा सभ्यता (हनुमानगढ़) की खोज सर्वप्रथम 1952 में अमलानंद घोष द्वारा की गई थी।"
    },
    {
      id: "mcq2",
      subjectId: "rajasthan-gk",
      chapter: "Chapter 1: History",
      topic: "Freedom Struggle",
      question: "राजस्थान में 1857 की क्रांति का प्रारंभ सबसे पहले कहाँ से हुआ था?",
      options: ["नीमच", "एरिनपुरा", "नसीराबाद", "देवली"],
      answerIndex: 2,
      explanation: "राजस्थान में 1857 की क्रांति का प्रारंभ 28 मई 1857 को नसीराबाद छावनी से हुआ था।"
    },
    {
      id: "mcq3",
      subjectId: "constitution",
      chapter: "Chapter 1: Introduction",
      topic: "Fundamental Rights",
      question: "भारतीय संविधान के किस भाग में मौलिक अधिकारों का उल्लेख है?",
      options: ["भाग II", "भाग III", "भाग IV", "भाग V"],
      answerIndex: 1,
      explanation: "भारतीय संविधान के भाग III (अनुच्छेद 12 से 35) में मौलिक अधिकारों का उल्लेख किया गया है।"
    },
    {
      id: "mcq4",
      subjectId: "biology",
      chapter: "Chapter 1: Introduction",
      topic: "Cell Structure",
      question: "कोशिका का 'पावरहाउस' (Powerhouse) किसे कहा जाता है?",
      options: ["लाइसोसोम", "माइटोकॉन्ड्रिया", "राइबोसोम", "गॉल्जीकाय"],
      answerIndex: 1,
      explanation: "माइटोकॉन्ड्रिया को कोशिका का पावरहाउस कहा जाता है क्योंकि यह कोशिकीय श्वसन द्वारा ऊर्जा (ATP) उत्पन्न करता है।"
    }
  ],
  current_affairs: [
    {
      id: "ca1",
      title: "Rajasthan Budget 2026-27: Major Announcements and Benefits",
      content: "The Rajasthan Government presented the budget for 2026-27 with significant allocations for infrastructure development, education, youth employment, and agriculture. Major updates include recruitment drives for 1 Lakh government positions and scholarships for topper students.",
      publishedDate: new Date().toISOString(),
      type: "daily"
    },
    {
      id: "ca2",
      title: "Weekly Current Affairs Summary - 1st Week of July 2026",
      content: "Here is a digest of key national and international events. 1. Bharatiya Nyaya Sanhita updates. 2. Sports awards. 3. New summits on green energy. Practice MCQs below for full coverage.",
      publishedDate: new Date(Date.now() - 172800000).toISOString(),
      type: "weekly"
    }
  ],
  previous_papers: [
    {
      id: "pyq1",
      examName: "RAS Pre",
      year: 2023,
      subjectId: "rajasthan-gk",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "3.5 MB"
    },
    {
      id: "pyq2",
      examName: "REET Level 2",
      year: 2022,
      subjectId: "pedagogy",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      fileSize: "2.8 MB"
    }
  ],
  exam_updates: [
    {
      id: "up1",
      title: "REET 2026 Official Notification & Vacancy Details Out",
      category: "notification",
      content: "The REET board has announced the syllabus and official dates for REET 2026 examinations. Application starting from next week.",
      link: "https://education.rajasthan.gov.in",
      publishedAt: new Date().toISOString()
    },
    {
      id: "up2",
      title: "CET Senior Secondary Admit Card 2026 Released - Download Now",
      category: "admit-card",
      content: "Download links for RSMSSB CET senior secondary admit card are active. Direct link inside.",
      link: "https://rsmssb.rajasthan.gov.in",
      publishedAt: new Date(Date.now() - 86400000).toISOString()
    }
  ],
  banners: [
    {
      id: "home-hero",
      type: "hero",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&auto=format&fit=crop&q=80",
      title: "Crack Every Rajasthan & Central Exam!",
      subtitle: "Learn Smart • Practice Better • Succeed Faster. Join our channel 'Strong Competitor' on YouTube for free high-quality video courses.",
      actionLink: "/mcq"
    },
    {
      id: "promo-banner",
      type: "promo",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80",
      title: "Special PDF Sale - 50% Off",
      subtitle: "Get all handwritten notes & BNS / Constitution guides now at half price.",
      actionLink: "/pdfs/premium"
    }
  ],
  settings: {
    logoText: "STRONG COMPETITOR",
    tagline: "Learn Smart • Practice Better • Crack Every Exam",
    email: "contact@strongcompetitor.com",
    phone: "+91 9876543210",
    youtubeUrl: "https://www.youtube.com/@strongcompetitor",
    telegramUrl: "https://t.me/strongcompetitor",
    razorpayKey: "rzp_test_mockKey12345",
    adminPassword: "admin123"
  }
};

// Helper for local mock storage operations
const getLocalDb = () => {
  if (typeof window === "undefined") return DEFAULT_DATABASE;
  
  const saved = localStorage.getItem("strong_competitor_db");
  if (!saved) {
    localStorage.setItem("strong_competitor_db", JSON.stringify(DEFAULT_DATABASE));
    return DEFAULT_DATABASE;
  }
  return JSON.parse(saved);
};

const saveLocalDb = (data: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("strong_competitor_db", JSON.stringify(data));
  }
};

// Generic CRUD helper
export const dbGet = async (collectionName: string): Promise<any[]> => {
  if (isFirebaseMock) {
    const localDb = getLocalDb();
    return (localDb as any)[collectionName] || [];
  }
  
  try {
    const q = collection(db, collectionName);
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Firebase error reading ${collectionName}. Falling back.`, error);
    return (getLocalDb() as any)[collectionName] || [];
  }
};

export const dbGetById = async (collectionName: string, id: string): Promise<any> => {
  if (isFirebaseMock) {
    const list = await dbGet(collectionName);
    return list.find(item => item.id === id) || null;
  }

  try {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  } catch (error) {
    console.error(`Firebase error reading doc ${id} from ${collectionName}`, error);
    const list = getLocalDb()[collectionName] || [];
    return list.find((item: any) => item.id === id) || null;
  }
};

export const dbAdd = async (collectionName: string, data: any): Promise<string> => {
  const newId = Math.random().toString(36).substr(2, 9);
  const dataWithId = { id: newId, ...data };
  
  if (isFirebaseMock) {
    const localDb = getLocalDb();
    if (!localDb[collectionName]) localDb[collectionName] = [];
    localDb[collectionName].push(dataWithId);
    saveLocalDb(localDb);
    return newId;
  }

  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (error) {
    console.error(`Firebase error adding to ${collectionName}`, error);
    const localDb = getLocalDb();
    if (!localDb[collectionName]) localDb[collectionName] = [];
    localDb[collectionName].push(dataWithId);
    saveLocalDb(localDb);
    return newId;
  }
};

export const dbSet = async (collectionName: string, id: string, data: any): Promise<void> => {
  if (isFirebaseMock) {
    const localDb = getLocalDb();
    if (!localDb[collectionName]) localDb[collectionName] = [];
    const index = localDb[collectionName].findIndex((item: any) => item.id === id);
    
    if (index > -1) {
      localDb[collectionName][index] = { ...localDb[collectionName][index], ...data };
    } else {
      localDb[collectionName].push({ id, ...data });
    }
    saveLocalDb(localDb);
    return;
  }

  try {
    await setDoc(doc(db, collectionName, id), data, { merge: true });
  } catch (error) {
    console.error(`Firebase error writing doc ${id} in ${collectionName}`, error);
    const localDb = getLocalDb();
    if (!localDb[collectionName]) localDb[collectionName] = [];
    const index = localDb[collectionName].findIndex((item: any) => item.id === id);
    if (index > -1) {
      localDb[collectionName][index] = { ...localDb[collectionName][index], ...data };
    } else {
      localDb[collectionName].push({ id, ...data });
    }
    saveLocalDb(localDb);
  }
};

export const dbDelete = async (collectionName: string, id: string): Promise<void> => {
  if (isFirebaseMock) {
    const localDb = getLocalDb();
    if (localDb[collectionName]) {
      localDb[collectionName] = localDb[collectionName].filter((item: any) => item.id !== id);
      saveLocalDb(localDb);
    }
    return;
  }

  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error(`Firebase error deleting doc ${id} from ${collectionName}`, error);
    const localDb = getLocalDb();
    if (localDb[collectionName]) {
      localDb[collectionName] = localDb[collectionName].filter((item: any) => item.id !== id);
      saveLocalDb(localDb);
    }
  }
};

// Specific helper functions
export const getSettings = async () => {
  if (isFirebaseMock) {
    return getLocalDb().settings;
  }
  try {
    const docRef = doc(db, "settings", "global");
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : getLocalDb().settings;
  } catch {
    return getLocalDb().settings;
  }
};

export const updateSettings = async (settings: any) => {
  if (isFirebaseMock) {
    const dbData = getLocalDb();
    dbData.settings = { ...dbData.settings, ...settings };
    saveLocalDb(dbData);
    return;
  }
  try {
    await setDoc(doc(db, "settings", "global"), settings, { merge: true });
  } catch {
    const dbData = getLocalDb();
    dbData.settings = { ...dbData.settings, ...settings };
    saveLocalDb(dbData);
  }
};
