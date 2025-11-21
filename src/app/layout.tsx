import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdsense from "@/components/GoogleAdsense";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steam Library Comparator - Compare Game Libraries & Playtime",
  description: "Free tool to compare Steam game libraries with friends. See shared games, playtime statistics, achievements, and find your next co-op adventure. No login required!",
  keywords: ["steam", "game library", "compare", "steam comparator", "playtime", "achievements", "gaming", "steam friends"],
  authors: [{ name: "Steam Library Comparator" }],
  openGraph: {
    title: "Steam Library Comparator",
    description: "Compare Steam game libraries with friends - playtime, achievements, and shared games",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics />
        <GoogleAdsense />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        <header className="max-w-7xl mx-auto p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E8D5FF] bg-white/50 backdrop-blur-sm">
          <a href="/" className="font-semibold text-[#5A5A5A] hover:text-[#D4B3FF] transition-colors">
            Steam Library Comparator
          </a>
          <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
            <a className="text-[#8B8B8B] hover:text-[#D4B3FF] transition-colors" href="/about">About</a>
            <a className="text-[#8B8B8B] hover:text-[#D4B3FF] transition-colors" href="/contact">Contact</a>
            <a className="text-[#8B8B8B] hover:text-[#D4B3FF] transition-colors" href="/report-bug">Report Bug</a>
            <a className="text-[#8B8B8B] hover:text-[#D4B3FF] transition-colors" href="/privacy">Privacy</a>
            <a className="text-[#8B8B8B] hover:text-[#D4B3FF] transition-colors" href="/terms">Terms</a>
          </nav>
        </header>
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
