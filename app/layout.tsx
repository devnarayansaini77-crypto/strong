import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Strong Competitor — Premium EdTech & Practice Portal",
  description: "Learn Smart, Practice Better, and Crack Every Competitive Exam. Watch free video lectures, download PDFs, and practice topic-wise MCQs.",
  keywords: ["Rajasthan GK", "Indian Polity", "Constitution", "REET", "RAS", "CET", "Strong Competitor", "Mock Tests", "Current Affairs"],
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
