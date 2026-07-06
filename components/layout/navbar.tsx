"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Search, Lock, Compass, ChevronDown } from "lucide-react";
import { getSettings } from "@/lib/db";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoText, setLogoText] = useState("STRONG COMPETITOR");

  // Load logo from storage/settings
  useEffect(() => {
    getSettings().then(settings => {
      if (settings?.logoText) setLogoText(settings.logoText);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Videos", href: "/videos" },
    { name: "Subjects", href: "/subjects" },
    { name: "Free PDFs", href: "/pdfs/free" },
    { name: "Premium PDFs", href: "/pdfs/premium" },
    { name: "MCQ Practice", href: "/mcq" },
    { name: "Current Affairs", href: "/current-affairs" },
    { name: "PYQs", href: "/previous-papers" },
    { name: "Exam Updates", href: "/exam-updates" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "glass-panel shadow-md py-3" 
          : "bg-transparent py-5"
      } border-b border-white/10`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight text-primary transition-colors hover:text-primary-dark">
              {logoText.split(" ")[0]}
              <span className="text-accent ml-1 font-black">
                {logoText.split(" ").slice(1).join(" ") || "COMPETITOR"}
              </span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? "text-primary bg-primary/10 border-b-2 border-primary" 
                      : "text-slate-600 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link 
              href="/admin" 
              className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-bold glass-panel border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </Link>
          </div>

          {/* Hamburger Menu Trigger */}
          <div className="xl:hidden flex items-center space-x-2">
            <Link 
              href="/admin" 
              className="p-2 text-slate-600 hover:text-primary rounded-lg hover:bg-slate-100 sm:hidden"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Navigation */}
      {isOpen && (
        <div className="xl:hidden animate-fade-in glass-panel fixed inset-x-0 top-[60px] max-h-[calc(100vh-60px)] overflow-y-auto border-t border-slate-200/50 shadow-2xl p-6">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive 
                      ? "text-primary bg-primary/10" 
                      : "text-slate-700 hover:text-primary hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-slate-200/50 my-4 pt-4">
              <Link 
                href="/admin" 
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 rounded-xl bg-primary text-white text-base font-bold shadow-md hover:bg-primary-dark transition-all duration-300"
              >
                <Lock className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
