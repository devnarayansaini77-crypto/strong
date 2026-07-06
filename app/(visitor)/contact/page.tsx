"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Send, MapPin, CheckCircle, Clock } from "lucide-react";
import { getSettings } from "@/lib/db";

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Contact() {
  const [settings, setSettings] = useState<any>({
    email: "contact@strongcompetitor.com",
    phone: "+91 9876543210",
    youtubeUrl: "https://www.youtube.com/@strongcompetitor",
    telegramUrl: "https://t.me/strongcompetitor"
  });

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: "", email: "", subject: "", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200/60 pb-6">
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">Contact Strong Competitor</h1>
        <p className="text-slate-500 font-semibold text-sm">
          Have queries about premium notes, payments, or study schedules? Send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info */}
        <div className="space-y-6 lg:col-span-1">
          <div className="glass-card p-6 rounded-3xl border border-white space-y-6">
            <h3 className="font-extrabold text-slate-800 text-lg">Support Channels</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">Email Address</h4>
                  <a href={`mailto:${settings.email}`} className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">Phone Number</h4>
                  <a href={`tel:${settings.phone}`} className="text-sm font-bold text-slate-700 hover:text-primary transition-colors">
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary border border-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wide">Location</h4>
                  <span className="text-sm font-bold text-slate-700">
                    Rajasthan, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Channels promotion */}
          <div className="glass-card p-6 rounded-3xl border border-white space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Social Communities</h3>
            <div className="flex flex-col space-y-2.5">
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              >
                <Youtube className="w-5 h-5 fill-current" />
                <span className="text-xs font-extrabold">Strong Competitor YouTube</span>
              </a>
              <a
                href={settings.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2.5 p-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-600 transition-colors"
              >
                <Send className="w-4.5 h-4.5 fill-current" />
                <span className="text-xs font-extrabold">Strong Competitor Telegram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 glass-card p-8 rounded-3xl border border-white space-y-6">
          <h3 className="font-extrabold text-slate-800 text-lg">Send Message</h3>

          {isSubmitted ? (
            <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-green-800 flex items-start space-x-3 animate-fade-in">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold">Message Sent Successfully!</h4>
                <p className="text-xs text-green-700 font-semibold">
                  Thank you for reaching out. We will review your message and reply via email within 24-48 hours.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="Enter your email"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Subject</label>
                <input
                  type="text"
                  value={formState.subject}
                  onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                  placeholder="Query topic (e.g. PDF Download, Payments)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder="Write your message here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-bold shadow-md hover:shadow-primary/20 transform hover:-translate-y-0.5 transition-all text-xs"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
