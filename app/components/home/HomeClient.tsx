"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Compass, MapPin, Calendar, Users, Search, ArrowRight, 
  Star, ShieldCheck, Clock, Award, Sparkles, CheckCircle2, 
  Heart, Send 
} from "lucide-react";

interface DestinationItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  rating: string;
  reviews: number;
  badge?: string;
  image?: string;
  highlights: string[];
  category?: string;
}

const TRAVEL_STYLES = [
  { id: "all", name: "সবগুলো", count: "সব স্পট", icon: "✨" },
  { id: "beach", name: "সমুদ্র সৈকত", count: "১২+ ট্যুর", icon: "🏖️" },
  { id: "hills", name: "পাহাড় ও ট্র্যাকিং", count: "১৮+ ট্যুর", icon: "⛰️" },
  { id: "lake", name: "হাওড় ও জলরাশি", count: "৬+ ট্যুর", icon: "🚤" },
  { id: "nature", name: "চা বাগান ও প্রকৃতি", count: "৯+ ট্যুর", icon: "🍃" },
  { id: "roadtrip", name: "রোমাঞ্চকর রোডট্রিপ", count: "৫+ ট্যুর", icon: "🚙" },
];

const PACKAGES = [
  {
    id: "coxsbazar",
    title: "কক্সবাজার রিল্যাক্স কাপল প্যাকেজ",
    dest: "কক্সবাজার সমুদ্র সৈকত",
    duration: "৩ দিন ২ রাত",
    price: 11000,
    features: ["ফাইভ স্টার রিসোর্ট ভিউ রুম", "এসি ভলভো বাস টিকিট", "ইনানী ও মেরিন ড্রাইভ কার"],
    badge: "বেস্ট সেলার",
  },
  {
    id: "sajek",
    title: "সাজেক মেঘ-বিলাস ফ্যামিলি ট্যুর",
    dest: "সাজেক ভ্যালি",
    duration: "৩ দিন ২ রাত",
    price: 14500,
    features: ["রিসোর্ট মেঘের উপরে বারান্দা", "প্রাইভেট মাহিন্দ্রা জিপ", "সব বেলার সুস্বাদু পাহাড়ি খাবার"],
    badge: "প্রিমিয়াম চয়েস",
  },
  {
    id: "bandarban",
    title: "বান্দরবান নীলগিরি ক্লাউড ক্যাম্প",
    dest: "বান্দরবান পার্বত্য জেলা",
    duration: "৩ দিন ২ রাত",
    price: 12500,
    features: ["নীলগিরি কটেজ স্টে", "অভিজ্ঞ ট্র্যাকার গাইড", "শৈলপ্রপাত ও স্বর্ণ মন্দির সাইটসিয়িং"],
    badge: "অ্যাডভেঞ্চার",
  },
];

const REVIEWS = [
  {
    name: "তানভীর আহমেদ",
    location: "ঢাকা",
    tour: "সাজেক মেঘ-বিলাস ট্যুর",
    rating: 5,
    comment: "সাজেক ট্যুরের ব্যবস্থাপনা অসাধারণ ছিল। চাঁদের গাড়ি থেকে শুরু করে রিসোর্টের ব্যালকনি ভিউ—সবকিছু ছিল নিখুঁত ও প্রিমিয়াম।",
  },
  {
    name: "ফারিহা জামান",
    location: "চট্টগ্রাম",
    tour: "টাঙ্গুয়ার হাওড় হাউসবোট",
    rating: 5,
    comment: "হাউসবোটের খাবার এবং পরিবেশ সত্যি চমৎকার ছিল। পরিবারের সবাইকে নিয়ে দারুণ ও নিরাপদ ভ্রমণ উপভোগ করেছি। ধন্যবাদ ট্রাভলা টিম!",
  },
  {
    name: "মাহমুদুল হাসান",
    location: "সিলেট",
    tour: "কক্সবাজার রিল্যাক্স প্যাকেজ",
    rating: 5,
    comment: "হোটেল চেক-ইন থেকে শুরু করে সার্বক্ষণিক সাপোর্ট—কোনো ঝামেলা ছাড়াই ছুটির দিনগুলো চমৎকার কেটেছে। শতভাগ রিকমেন্ডেড!",
  },
];

export default function HomeClient({ initialDestinations }: { initialDestinations: DestinationItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Filter items based on active category
  const filteredDestinations = initialDestinations.filter((item) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "beach") return item.id.includes("cox") || item.title.includes("কক্সবাজার") || item.subtitle.includes("সমুদ্র");
    if (activeCategory === "hills") return item.id.includes("sajek") || item.id.includes("bandarban") || item.title.includes("সাজেক") || item.title.includes("বান্দরবান");
    if (activeCategory === "lake") return item.id.includes("tanguar") || item.title.includes("হাওড়") || item.title.includes("টাঙ্গুয়ার");
    if (activeCategory === "nature") return item.id.includes("sreemangal") || item.title.includes("শ্রীমঙ্গল") || item.title.includes("চা বাগান");
    if (activeCategory === "roadtrip") return item.id.includes("sajek") || item.id.includes("cox");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] notranslate text-slate-900">
      
      {/* 1. CINEMATIC TRAVEL HERO SECTION WITH TRAVEL BACKGROUND IMAGE */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center pt-24 pb-20 overflow-hidden">
        
        {/* Background High-Resolution Travel Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Bangladesh Travel Landscape"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          {/* Layered Gradient Overlay for High Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-teal-950/20 mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 text-xs font-bold mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              বাংলাদেশের বিশ্বস্ত ট্যুর ও ট্রাভেল পার্টনার
            </span>
            
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
              মেঘ, পাহাড় আর সমুদ্রের টানে <br />
              <span className="text-teal-400">খুঁজে নিন আপনার স্বপ্নের গন্তব্য</span>
            </h1>
            
            <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-medium">
              সাজেক, কক্সবাজার, বান্দরবান কিংবা টাঙ্গুয়ার হাওড়—প্রতিটি ট্যুরেই পাচ্ছেন প্রিমিয়াম রিসোর্ট, লোকাল গাইড ও শতভাগ নিরাপদ ভ্রমণ।
            </p>
          </div>

          {/* Glassmorphic 3D Quick Search Box */}
          <div className="mt-12 max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-4 sm:p-5 shadow-2xl shadow-slate-950/50 border border-white/60">
            <form action="/booking" method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-center">
              
              <div className="sm:col-span-4 px-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400 transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" /> গন্তব্যস্থল
                </label>
                <select name="dest" className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer">
                  <option value="sajek">সাজেক ভ্যালি (মেঘের রাজ্য)</option>
                  <option value="coxsbazar">কক্সবাজার সমুদ্র সৈকত</option>
                  <option value="tanguar">টাঙ্গুয়ার হাওড় হাউসবোট</option>
                  <option value="bandarban">বান্দরবান নীলাচল</option>
                  <option value="sreemangal">শ্রীমঙ্গল চা বাগান</option>
                </select>
              </div>

              <div className="sm:col-span-3 px-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400 transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" /> ভ্রমণের তারিখ
                </label>
                <input 
                  type="date" 
                  name="date"
                  className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none cursor-pointer"
                />
              </div>

              <div className="sm:col-span-3 px-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-400 transition">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-600" /> যাত্রী সংখ্যা
                </label>
                <select name="guests" className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none cursor-pointer">
                  <option value="2">২ জন (কাপল/ফ্রেন্ডস)</option>
                  <option value="4">৪ জন (ফ্যামিলি)</option>
                  <option value="6">৬+ জন (গ্রুপ)</option>
                  <option value="1">১ জন (সোলো)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[56px] py-3.5 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>খুঁজুন</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      {/* 2. FULLY FUNCTIONAL TRAVEL STYLES / CATEGORY FILTER PILLS */}
      <section className="py-10 border-b border-slate-200/80 bg-white sticky top-16 z-30 shadow-sm/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {TRAVEL_STYLES.map((style) => {
              const isActive = activeCategory === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setActiveCategory(style.id)}
                  className={`shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-teal-50 border-teal-600 text-teal-900 shadow-md ring-2 ring-teal-600/20 scale-[1.02]" 
                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xl">{style.icon}</span>
                  <div>
                    <h4 className={`text-xs font-bold leading-tight ${isActive ? "text-teal-900" : "text-slate-900"}`}>
                      {style.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-medium">{style.count}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS (DYNAMICALLY FILTERED) */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">জনপ্রিয় ভ্রমণ স্পট</span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {activeCategory === "all" ? "টপ রেটেড ট্যুর গন্তব্য" : `${TRAVEL_STYLES.find(s => s.id === activeCategory)?.name} প্যাকেজসমূহ`}
              </h2>
            </div>
            
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-sm border border-teal-200/60 transition group self-start sm:self-auto"
            >
              <span>সব গন্তব্য দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredDestinations.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="h-56 relative overflow-hidden bg-slate-900">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-teal-700 to-slate-900 flex items-center justify-center">
                          <Compass className="w-12 h-12 text-white/30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {item.badge ? (
                          <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-bold shadow-md">
                            {item.badge}
                          </span>
                        ) : <span />}

                        {item.rating && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md text-amber-300 text-xs font-bold border border-white/10">
                            <Star className="w-3.5 h-3.5 fill-amber-300" />
                            <span>{item.rating}</span>
                            {item.reviews > 0 && (
                              <span className="text-white/70 text-[10px]">({item.reviews})</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-black text-white tracking-tight">{item.title}</h3>
                        {item.subtitle && (
                          <p className="text-xs text-teal-200 font-medium mt-0.5 flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3 h-3 text-teal-400 shrink-0" /> {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="space-y-2 text-xs font-medium text-slate-700 mb-2">
                          {item.highlights.slice(0, 3).map((point: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                              <span className="line-clamp-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <div className="flex items-center justify-between py-3 border-t border-slate-100 text-xs text-slate-500 mb-4">
                      <span className="flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> {item.duration}
                      </span>
                      <div>
                        <span className="text-[11px] text-slate-400 block text-right">জনপ্রতি শুরু</span>
                        <span className="text-lg font-black text-slate-950">
                          ৳{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/booking?dest=${item.id}`}
                      className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition"
                    >
                      <span>বুকিং কনফার্ম করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <p className="text-slate-500 text-sm font-semibold">
                এই ক্যাটাগরিতে বর্তমানে কোনো ট্যুর নেই। অন্য ক্যাটাগরি সিলেক্ট করুন।
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 4. POPULAR TOUR PACKAGES */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">হট ডিলস</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              জনপ্রিয় ট্যুর প্যাকেজসমূহ
            </h2>
            <p className="mt-3 text-slate-400 text-sm">
              সবচেয়ে বেশি বুক হওয়া স্পেশাল প্যাকেজগুলো দেখুন এবং সাশ্রয়ী খরচে ভ্রমণ করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 rounded-3xl p-8 border border-slate-700/80 hover:border-teal-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-bold">
                      {pkg.badge}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-400" /> {pkg.duration}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
                  <p className="text-xs text-slate-400 mb-6 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-teal-400" /> {pkg.dest}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-700/60 mb-8">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-700/60 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">মোট প্যাকেজ</span>
                    <span className="text-2xl font-black text-teal-400">৳{pkg.price.toLocaleString()}</span>
                  </div>

                  <Link
                    href={`/booking?dest=${pkg.id}`}
                    className="py-2.5 px-5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
                  >
                    বুক করুন
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. WHY BOOK WITH US */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">আমাদের বৈশিষ্ট্য</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              কেন ট্রাভলা বিডি বেছে নেবেন?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">১০০% নিরাপদ ভ্রমণ</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                নারী, পরিবার ও শিশুদের জন্য সর্বোচ্চ নিরাপত্তা নিশ্চিত করে আমরা প্রতিটি ট্যুর পরিচালনা করি।
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">অভিজ্ঞ লোকাল গাইড</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                প্রতিটি গন্তব্যের দক্ষ ও পরিচিত লোকাল গাইড সবসময় আপনার সুবিধার্থে পাশে থাকবেন।
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">বেস্ট প্রাইস গ্যারান্টি</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                কোনো হিডেন চার্জ নেই। রিসোর্ট ও ট্রাভেলিংয়ে আমরা সরাসরি সেরা কর্পোরেট ডিল অফার করি।
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">২৪/৭ কাস্টমার কেয়ার</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ভ্রমণ শুরুর পূর্ব থেকে শেষ হওয়া পর্যন্ত সার্বক্ষণিক ফোন ও হোয়াটসঅ্যাপ সাপোর্ট।
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. REVIEWS & TESTIMONIALS */}
      <section className="py-20 lg:py-24 bg-[#fafbfc] border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">রিভিউ ও মতামত</span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              যাত্রীদের বাস্তব অভিজ্ঞতা
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-slate-900">{rev.name}</h5>
                    <span className="text-[11px] text-slate-500">{rev.location}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full">
                    {rev.tour}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. NEWSLETTER & OPT-IN CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-3xl p-8 sm:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-teal-900/10">
            <div className="max-w-xl text-center lg:text-left">
              <span className="px-3.5 py-1 rounded-full bg-white/15 text-xs font-bold text-teal-100 border border-white/20 mb-3 inline-block">
                ১০% ছাড়ের অফার
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                ট্যুর গাইড ও অফার পেতে সাবস্ক্রাইব করুন
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-teal-100/90 leading-relaxed">
                আপনার পরবর্তী ভ্রমণের স্পেশাল ডিসকাউন্ট কুপন ও সেরা গন্তব্যের তথ্য সরাসরি ইমেইলে পাঠিয়ে দেওয়া হবে।
              </p>
            </div>

            <form action="#" className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="আপনার ইমেইল এড্রেস লিখুন..."
                className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-teal-200/60 text-sm outline-none focus:bg-white/20 transition"
                required
              />
              <button
                type="submit"
                className="py-3.5 px-6 rounded-2xl bg-white hover:bg-teal-50 text-teal-900 font-bold text-sm shrink-0 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <Send className="w-4 h-4 text-teal-800" />
                <span>যুক্ত হন</span>
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}