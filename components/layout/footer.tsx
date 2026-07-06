"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, Send, ChevronRight, Award } from "lucide-react";
import { getSettings } from "@/lib/db";

const Youtube = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function Footer() {
  const [settings, setSettings] = useState({
    logoText: "STRONG COMPETITOR",
    tagline: "Learn Smart • Practice Better • Crack Every Exam",
    email: "contact@strongcompetitor.com",
    phone: "+91 9876543210",
    youtubeUrl: "https://www.youtube.com/@strongcompetitor",
    telegramUrl: "https://t.me/strongcompetitor"
  });

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const footerLinks = [
    { name: "Subject Index", href: "/subjects" },
    { name: "Video Lectures", href: "/videos" },
    { name: "Free Study Materials", href: "/pdfs/free" },
    { name: "Premium PDFs", href: "/pdfs/premium" },
    { name: "MCQ Tests", href: "/mcq" },
    { name: "Daily Current Affairs", href: "/current-affairs" },
    { name: "Exam Notifications", href: "/exam-updates" },
  ];

  return (
    <footer className="bg-primary-dark text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & Tagline */}
          <div className="space-y-4 col-span-1 md:col-span-1.5">
            <span className="font-extrabold text-2xl tracking-tight text-white flex items-center">
              {settings.logoText.split(" ")[0]}
              <span className="text-accent ml-1 font-black">
                {settings.logoText.split(" ").slice(1).join(" ") || "COMPETITOR"}
              </span>
            </span>
            <p className="text-sm text-slate-400 font-medium leading-relaxed max-w-xs">
              {settings.tagline}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a 
                href={settings.youtubeUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href={settings.telegramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white transition-all duration-300"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase">Quick Navigation</h3>
            <ul className="space-y-2.5">
              {footerLinks.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-accent flex items-center text-sm font-semibold transition-all">
                    <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase">Practice Hub</h3>
            <ul className="space-y-2.5">
              {footerLinks.slice(4).map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-accent flex items-center text-sm font-semibold transition-all">
                    <ChevronRight className="w-3.5 h-3.5 mr-1 text-slate-600" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base tracking-wide uppercase">Contact Us</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-0.5 text-accent" />
                <a href={`mailto:${settings.email}`} className="text-slate-400 hover:text-white transition-all break-all">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-accent" />
                <a href={`tel:${settings.phone}`} className="text-slate-400 hover:text-white transition-all">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2 pt-2 text-xs text-slate-500 font-bold border-t border-slate-800">
                <Award className="w-4.5 h-4.5 text-accent" />
                <span>Admin managed EdTech platform</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} Strong Competitor. All rights reserved. Created for YouTube learning & practice.</p>
        </div>
      </div>
    </footer>
  );
}
