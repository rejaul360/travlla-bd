"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Phone, Menu, X, CalendarCheck, MapPin } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs notranslate">
      {/* Top micro bar */}
      <div className="bg-slate-900 text-slate-200 text-sm py-2.5 px-4 sm:px-6 lg:px-8 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>সুন্দর বাংলাদেশ অন্বেষণ করুন</span>
          </div>
          <div className="flex items-center gap-6 text-xs sm:text-sm">
            <a href="tel:+8801700000000" className="flex items-center gap-1.5 hover:text-teal-400 transition">
              <Phone className="w-3.5 h-3.5 text-teal-400" />
              <span>+880 1717980917</span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">কাস্টম ট্যুর প্ল্যান চান?</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30 group-hover:scale-105 transition-transform">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight block leading-none">
                ট্রাভলা<span className="text-teal-600">.বিডি</span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 block mt-1">
                ঘুরে দেখুন বাংলাদেশ
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (16px font standard) */}
          <nav className="hidden lg:flex items-center gap-8 text-base font-bold text-slate-800">
            <Link href="/" className="hover:text-teal-600 transition">হোম</Link>
            <Link href="/destinations" className="hover:text-teal-600 transition">গন্তব্যসমূহ</Link>
            <Link href="/blog" className="hover:text-teal-600 transition">ভ্রমণ গাইড</Link>
            <Link href="/booking" className="hover:text-teal-600 transition">ট্যুর বুকিং</Link>
            <Link href="/contact" className="hover:text-teal-600 transition">যোগাযোগ</Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-base font-bold shadow-lg shadow-teal-600/25 active:scale-95 transition"
            >
              <CalendarCheck className="w-5 h-5" />
              <span>ট্যুর বুক করুন</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-50"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-6 py-8 space-y-5 text-lg font-bold text-slate-900 shadow-xl">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block py-2">হোম</Link>
          <Link href="/destinations" onClick={() => setMobileMenuOpen(false)} className="block py-2">গন্তব্যসমূহ</Link>
          <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="block py-2">ভ্রমণ গাইড</Link>
          <Link href="/booking" onClick={() => setMobileMenuOpen(false)} className="block py-2">ট্যুর বুকিং</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block py-2">যোগাযোগ</Link>
          
          <div className="pt-4 border-t border-slate-100">
            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 rounded-2xl bg-teal-600 text-white text-base font-black flex items-center justify-center gap-2 shadow-md shadow-teal-600/30"
            >
              <CalendarCheck className="w-5 h-5" /> ট্যুর বুক করুন
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}