"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  CreditCard, 
  Download, 
  Search, 
  FileText, 
  Lock, 
  CheckCircle, 
  ChevronRight, 
  ShoppingBag,
  ExternalLink,
  Loader2,
  X,
  Smartphone
} from "lucide-react";
import { dbGet } from "@/lib/db";

function PremiumPdfsContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("id");

  const [pdfs, setPdfs] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  
  // Purchased PDFs tracks unlocked PDFs stored in localStorage
  const [purchasedPdfs, setPurchasedPdfs] = useState<string[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<any>(null);
  
  // Checkout flow states
  const [checkoutStep, setCheckoutStep] = useState<"detail" | "pay-methods" | "verifying" | "success">("detail");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dbGet("pdfs").then((p) => {
      const prem = p.filter((item) => item.isPremium);
      setPdfs(prem);
      if (highlightId) {
        const found = prem.find(item => item.id === highlightId);
        if (found) {
          setSelectedPdf(found);
          setCheckoutStep("detail");
        }
      }
    });
    dbGet("subjects").then(setSubjects);
    
    // Load purchased IDs from localStorage
    const saved = localStorage.getItem("purchased_premium_pdfs");
    if (saved) {
      setPurchasedPdfs(JSON.parse(saved));
    }
  }, [highlightId]);

  const handleBuyClick = (pdf: any) => {
    setSelectedPdf(pdf);
    // If already purchased, skip to success or download
    if (purchasedPdfs.includes(pdf.id)) {
      setCheckoutStep("success");
    } else {
      setCheckoutStep("detail");
    }
  };

  const handleSelectPaymentMethod = (method: string) => {
    setSelectedMethod(method);
    setCheckoutStep("verifying");
    setIsProcessing(true);

    // Simulate Payment Gateway call (Razorpay/UPI API callback)
    setTimeout(() => {
      setIsProcessing(false);
      setCheckoutStep("success");
      
      // Update purchased cache
      const updated = [...purchasedPdfs, selectedPdf.id];
      setPurchasedPdfs(updated);
      localStorage.setItem("purchased_premium_pdfs", JSON.stringify(updated));
    }, 2500);
  };

  const filteredPdfs = pdfs.filter((pdf) => {
    const matchesSearch = 
      pdf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pdf.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === "all" || pdf.subjectId === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary-dark tracking-tight flex items-center">
            <ShoppingBag className="w-8 h-8 mr-2 text-accent" />
            <span>Premium PDF Store</span>
          </h1>
          <p className="text-slate-500 font-semibold text-sm">
            High-quality hand-written PDF guides and short summaries. Unlock instantly.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass-card p-6 rounded-2xl border border-white grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Search Title</label>
          <div className="relative flex items-center bg-slate-50 border border-slate-200 focus-within:border-primary rounded-xl px-3 py-1.5 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search premium books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent focus:outline-none text-slate-800 text-xs font-semibold py-2"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject Category</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3.5 text-xs font-semibold focus:outline-none focus:border-primary"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Premium PDF grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPdfs.map((pdf) => {
          const isOwned = purchasedPdfs.includes(pdf.id);
          return (
            <div 
              key={pdf.id} 
              className="glass-card rounded-2xl overflow-hidden border border-white p-5 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="aspect-[4/3] bg-slate-50 rounded-xl flex items-center justify-center relative border border-slate-100 shadow-inner">
                  <FileText className="w-14 h-14 text-slate-300" />
                  {isOwned ? (
                    <span className="absolute top-2.5 right-2.5 bg-green-500 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg uppercase flex items-center shadow-sm">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Unlocked
                    </span>
                  ) : (
                    <span className="absolute top-2.5 right-2.5 bg-accent text-white font-extrabold text-[10px] px-2.5 py-1 rounded-lg uppercase flex items-center shadow-sm">
                      <Lock className="w-3 h-3 mr-1" /> ₹{pdf.price}
                    </span>
                  )}
                  <span className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                    {pdf.language}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    {subjects.find((s) => s.id === pdf.subjectId)?.name || "Premium Series"}
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
                <span className="text-xs text-slate-400 font-bold">{pdf.fileSize} ({pdf.pagesCount} Pages)</span>
                {isOwned ? (
                  <a
                    href={pdf.fileUrl}
                    download
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md flex items-center space-x-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleBuyClick(pdf)}
                    className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md transition-all duration-300"
                  >
                    Get Premium PDF
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredPdfs.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-400 font-bold space-y-2">
            <p className="text-lg">No Premium PDFs available.</p>
            <p className="text-sm font-medium">Please check back later or try search query again.</p>
          </div>
        )}
      </div>

      {/* Checkout detail / Payment Gateway Drawer Modal */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedPdf(null)} />
          
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-slate-200 z-10 animate-fade-in flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                {checkoutStep === "detail" && "Product Details"}
                {checkoutStep === "pay-methods" && "Choose Payment Method"}
                {checkoutStep === "verifying" && "Securing Connection"}
                {checkoutStep === "success" && "Payment Successful"}
              </h3>
              <button 
                onClick={() => setSelectedPdf(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-grow">
              {/* Step 1: Details */}
              {checkoutStep === "detail" && (
                <div className="space-y-4">
                  <div className="aspect-[4/3] bg-primary/5 rounded-xl flex items-center justify-center relative border border-slate-100 shadow-inner">
                    <FileText className="w-16 h-16 text-primary/10" />
                    <span className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                      {selectedPdf.language}
                    </span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base text-slate-800">{selectedPdf.title}</h4>
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">{selectedPdf.description}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs font-bold text-slate-600">
                    <div className="flex justify-between">
                      <span>Total Pages:</span>
                      <span>{selectedPdf.pagesCount} Pages</span>
                    </div>
                    <div className="flex justify-between">
                      <span>File Size:</span>
                      <span>{selectedPdf.fileSize}</span>
                    </div>
                    <div className="flex justify-between text-slate-800 text-sm font-extrabold pt-2 border-t border-slate-200">
                      <span>Price:</span>
                      <span className="text-accent-dark">₹{selectedPdf.price}</span>
                    </div>
                  </div>

                  {/* Previews display */}
                  {selectedPdf.previewPages && selectedPdf.previewPages.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Sample Preview Pages</label>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPdf.previewPages.map((preview: string, idx: number) => (
                          <div key={idx} className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shadow-sm relative">
                            <img src={preview} alt="Sample Page" className="object-cover w-full h-full" />
                            <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-all" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setCheckoutStep("pay-methods")}
                    className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold shadow-md transform hover:-translate-y-0.5 transition-all text-sm"
                  >
                    Proceed to Pay (₹{selectedPdf.price})
                  </button>
                </div>
              )}

              {/* Step 2: Payment Gateways */}
              {checkoutStep === "pay-methods" && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex justify-between items-center text-xs font-bold text-slate-600">
                    <span>Amount Due:</span>
                    <span className="text-slate-800 text-sm font-extrabold">₹{selectedPdf.price}</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Select Method</label>
                    
                    <button
                      onClick={() => handleSelectPaymentMethod("UPI (PhonePe, GPay)")}
                      className="w-full p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 flex items-center justify-between text-left transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">UPI / QR Codes</p>
                          <p className="text-[10px] text-slate-400 font-semibold">PhonePe, Google Pay, Paytm, Bhim</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleSelectPaymentMethod("Cards (Razorpay)")}
                      className="w-full p-4 rounded-xl border border-slate-200 hover:border-primary hover:bg-primary/5 flex items-center justify-between text-left transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs font-extrabold text-slate-800">Credit / Debit Card</p>
                          <p className="text-[10px] text-slate-400 font-semibold">Visa, Mastercard, RuPay, Maestro</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Verifying */}
              {checkoutStep === "verifying" && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800">Verifying Payment</h4>
                    <p className="text-xs text-slate-500 font-semibold">Processing via secure Razorpay checkout gateway...</p>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {checkoutStep === "success" && (
                <div className="py-6 flex flex-col items-center justify-center text-center space-y-5">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base text-slate-800">Purchase Complete!</h4>
                    <p className="text-xs text-slate-500 font-semibold">
                      Your purchase of <strong>{selectedPdf.title}</strong> was processed. You can download the file below.
                    </p>
                  </div>
                  <a
                    href={selectedPdf.fileUrl}
                    download
                    className="bg-green-600 hover:bg-green-700 text-white w-full py-3.5 rounded-xl font-bold shadow-md flex items-center justify-center space-x-2 text-sm transition-colors"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Premium PDF</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PremiumPdfs() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-bold text-slate-500">Loading store...</div>}>
      <PremiumPdfsContent />
    </Suspense>
  );
}
