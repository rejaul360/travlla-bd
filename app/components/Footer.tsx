"use client";

import Link from "next/link";
import { Compass, Phone, Mail, MapPin, Send, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 notranslate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info (16px base font standard) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/30">
                <Compass className="w-7 h-7" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                ট্রাভলা<span className="text-teal-400">.বিডি</span>
              </span>
            </Link>

            <p className="text-base text-slate-400 leading-relaxed max-w-sm">
              বাংলাদেশের প্রতিটি কোণা আপনার নাগালের ভেতরে। সাজেক, কক্সবাজার ও পাহাড়ি অঞ্চল ভ্রমণকে সহজ, নিরাপদ ও স্মরণীয় করার বিশ্বস্ত মাধ্যম।
            </p>

            <div className="space-y-2.5 text-base text-slate-300 pt-2">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0" />
                <span>গুলশান-২, ঢাকা ১২১২, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <a href="tel:+8801700000000" className="hover:text-white transition">+৮৮০ ১৭০০-০০০০০০</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <span>support@travllabd.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-lg font-black text-white uppercase tracking-wider">জনপ্রিয় গন্তব্য</h4>
            <ul className="space-y-3 text-base font-semibold">
              <li><Link href="/booking?dest=sajek" className="hover:text-teal-400 transition">সাজেক ভ্যালি</Link></li>
              <li><Link href="/booking?dest=coxsbazar" className="hover:text-teal-400 transition">কক্সবাজার সমুদ্র সৈকত</Link></li>
              <li><Link href="/booking?dest=tanguar" className="hover:text-teal-400 transition">টাঙ্গুয়ার হাওড় হাউসবোট</Link></li>
              <li><Link href="/booking?dest=bandarban" className="hover:text-teal-400 transition">বান্দরবান নীলাচল</Link></li>
              <li><Link href="/booking?dest=sreemangal" className="hover:text-teal-400 transition">শ্রীমঙ্গল চা বাগান</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-lg font-black text-white uppercase tracking-wider">প্রয়োজনীয় লিংক</h4>
            <ul className="space-y-3 text-base font-semibold">
              <li><Link href="/destinations" className="hover:text-teal-400 transition">ভ্রমণ স্পট ও ডিল</Link></li>
              <li><Link href="/blog" className="hover:text-teal-400 transition">ট্যুর ব্লগ ও গাইড</Link></li>
              <li><Link href="/booking" className="hover:text-teal-400 transition">অনলাইন বুকিং</Link></li>
              <li><Link href="/contact" className="hover:text-teal-400 transition">যোগাযোগ করুন</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-lg font-black text-white uppercase tracking-wider">অফার ও আপডেট</h4>
            <p className="text-base text-slate-400 leading-relaxed">
              নতুন ট্যুর প্যাকেজ ও ডিসকাউন্টের খবর সবার আগে পেতে যুক্ত থাকুন।
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-3">
              <input
                type="email"
                placeholder="আপনার ইমেইল লিখুন"
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder:text-slate-500 text-base focus:border-teal-500 outline-none"
              />
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" /> যুক্ত হন
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-16 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ট্রাভলা.বিডি। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            বাংলাদেশের পর্যটন শিল্পের সেবায় নিয়োজিত <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}