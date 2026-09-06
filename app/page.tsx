"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Compass, MapPin, Calendar, Users, Search, ArrowRight, 
  Star, ShieldCheck, Clock, Award, Sparkles, CheckCircle2, 
  Heart, Send, Check, ChevronLeft, ChevronRight 
} from "lucide-react";

interface DestinationItem {
  id: string;
  post_id?: number;
  slug?: string;
  title: string;
  subtitle: string;
  price: number;
  duration: string;
  rating: string;
  reviews: number;
  badge?: string;
  image?: string;
  highlights: string[];
}

const TRAVEL_STYLES = [
  { id: "all", name: "সবগুলো স্পট", count: "সব ভ্রমণ", icon: "✨" },
  { id: "beach", name: "সমুদ্র সৈকত", count: "১২+ ট্যুর", icon: "🏖️" },
  { id: "hills", name: "পাহাড় ও ট্র্যাকিং", count: "১৮+ ট্যুর", icon: "⛰️" },
  { id: "lake", name: "হাওড় ও জলরাশি", count: "৬+ ট্যুর", icon: "🚤" },
  { id: "nature", name: "চা বাগান ও প্রকৃতি", count: "৯+ ট্যুর", icon: "🍃" },
  { id: "roadtrip", name: "রোমাঞ্চকর রোডট্রিপ", count: "৫+ ট্যুর", icon: "🚙" },
  { id: "heritage", name: "ঐতিহাসিক স্থান", count: "৭+ ট্যুর", icon: "🕌" },
  { id: "camping", name: "ক্যাম্পিং ও অ্যাডভেঞ্চার", count: "৮+ ট্যুর", icon: "⛺" },
];

const REVIEWS = [
  {
    name: "তানভীর আহমেদ",
    location: "ঢাকা",
    tour: "সাজেক ভ্যালি প্রিমিয়াম ট্যুর",
    comment: "চমৎকার আয়োজন ছিল! রিসোর্টের রুম ভিউ থেকে শুরু করে চাঁদের গাড়ির ড্রাইভ—সবকিছুতেই প্রফেশনালিজম ছিল। ফ্যামিলি নিয়ে ভ্রমণ করার জন্য বেস্ট চয়েস।",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "ফারিহা তাসনিম",
    location: "চট্টগ্রাম",
    tour: "টাঙ্গুয়ার হাওড় হাউসবোট",
    comment: "হাউসবোটের খাবার আর সার্ভিস অতুলনীয়। নীলাদ্রি লেক ও যাদুকাটা নদী ঘুরে দেখার অভিজ্ঞতা অসাধারণ ছিল। পুরো টিম খুবই হেল্পফুল।",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    name: "মাহমুদুল হাসান",
    location: "সিলেট",
    tour: "কক্সবাজার রিলাক্স ট্যুর",
    comment: "কোনো হিডেন খরচ নেই, যা কমিট করেছিল ঠিক তাই পেয়েছি। হোটেল নির্বাচন ও পরিবহন ব্যবস্থা বেশ আরামদায়ক ছিল। ধন্যবাদ ট্রাভলা বিডি!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"
  },
];

const FAQS = [
  {
    q: "বুকিং করার জন্য কি অগ্রিম কোনো পেমেন্ট করতে হবে?",
    a: "না, অনলাইনে বুকিং ফর্ম পূরণের পর আমাদের কাস্টমার রিপ্রেজেনটেটিভ সরাসরি আপনার নম্বরে ফোন করবেন। ট্যুরের যাবতীয় শিডিউল নিশ্চিত করার পরই শুধুমাত্র নির্ধারিত নিয়ম প্রযোজ্য হবে।"
  },
  {
    q: "আমরা কি নিজেদের সুবিধাজনক তারিখে কাস্টম ট্যুর করতে পারব?",
    a: "হ্যাঁ, যেকোনো গ্রুপ, পরিবার বা করপোরেট ট্যুরের জন্য আমরা সম্পূর্ণ কাস্টমাইজড ভ্রমণ প্যাকেজ ও রুট সাজিয়ে দিয়ে থাকি।"
  },
  {
    q: "ট্যুর চলাকালীন সময়ে নিরাপত্তার ব্যবস্থা কেমন?",
    a: "আমাদের প্রতিটি ট্যুরে থাকেন অভিজ্ঞ স্থানীয় গাইড এবং ২৪/৭ সাপোর্ট টিম। নারী, বয়োজ্যেষ্ঠ ও শিশুদের সুরক্ষাকে আমরা সর্বোচ্চ অগ্রাধিকার দেই।"
  },
  {
    q: "প্যাকেজে সাধারণত কী কী অন্তর্ভুক্ত থাকে?",
    a: "মানসম্মত হোটেল/রিসোর্ট স্টে, খাবার (প্যাকেজভেদে), অভ্যন্তরীণ পরিবহন এবং অভিজ্ঞ লোকাল গাইড সহায়তা প্যাকেজের আওতায় থাকে।"
  }
];

export default function HomePage() {
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetch("https://ams.wpelitee.com/wp-json/travlla/v1/destinations")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data);
        }
      })
      .catch((err) => console.error("Error fetching destinations:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDestinations = destinations.filter((item) => {
    if (activeCategory === "all") return true;
    const searchTarget = `${item.title} ${item.subtitle} ${item.slug || ""}`.toLowerCase();
    if (activeCategory === "beach") return searchTarget.includes("কক্সবাজার") || searchTarget.includes("সমুদ্র");
    if (activeCategory === "hills") return searchTarget.includes("সাজেক") || searchTarget.includes("বান্দরবান") || searchTarget.includes("পাহাড়");
    if (activeCategory === "lake") return searchTarget.includes("টাঙ্গুয়ার") || searchTarget.includes("হাওড়");
    if (activeCategory === "nature") return searchTarget.includes("শ্রীমঙ্গল") || searchTarget.includes("চা বাগান");
    if (activeCategory === "roadtrip") return searchTarget.includes("সাজেক") || searchTarget.includes("কক্সবাজার");
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] notranslate text-slate-900 overflow-x-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[680px] lg:min-h-[750px] flex items-center justify-center pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
            alt="Bangladesh Travel Landscape"
            fill
            priority
            className="object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40" />
          <div className="absolute inset-0 bg-teal-950/20 mix-blend-multiply" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-teal-300 text-sm font-bold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-teal-400" />
              বাংলাদেশের বিশ্বস্ত ট্যুর ও ট্রাভেল পার্টনার
            </span>
            
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.12] drop-shadow-md">
              মেঘ, পাহাড় আর সমুদ্রের টানে <br />
              <span className="text-teal-400">খুঁজে নিন আপনার স্বপ্নের গন্তব্য</span>
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto drop-shadow-sm font-medium">
              সাজেক, কক্সবাজার, বান্দরবান কিংবা টাঙ্গুয়ার হাওড়—প্রতিটি ট্যুরেই পাচ্ছেন প্রিমিয়াম রিসোর্ট, লোকাল গাইড ও শতভাগ নিরাপদ ভ্রমণ।
            </p>
          </motion.div>

          {/* Search Box With Entrance Animation */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="mt-14 max-w-4xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-950/50 border border-white/60"
          >
            <form action="/booking" method="GET" className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              
              <div className="sm:col-span-4 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-500 transition">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" /> গন্তব্যস্থল
                </label>
                <select name="dest" className="w-full bg-transparent text-base font-bold text-slate-900 outline-none cursor-pointer">
                  {destinations.length > 0 ? (
                    destinations.map((d) => (
                      <option key={d.id} value={d.post_id || d.id}>
                        {d.title}
                      </option>
                    ))
                  ) : (
                    <option value="">গন্তব্য লোড হচ্ছে...</option>
                  )}
                </select>
              </div>

              <div className="sm:col-span-3 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-500 transition">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" /> ভ্রমণের তারিখ
                </label>
                <input 
                  type="date" 
                  name="date"
                  className="w-full bg-transparent text-base font-bold text-slate-900 outline-none cursor-pointer"
                />
              </div>

              <div className="sm:col-span-3 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-500 transition">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-teal-600" /> যাত্রী সংখ্যা
                </label>
                <select name="guests" className="w-full bg-transparent text-base font-bold text-slate-900 outline-none cursor-pointer">
                  <option value="1">১ জন (সোলো)</option>
                  <option value="2">২ জন (কাপল/ফ্রেন্ডস)</option>
                  <option value="4">৪ জন (ফ্যামিলি)</option>
                  <option value="6">৬+ জন (গ্রুপ)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full min-h-[60px] py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition active:scale-[0.98] cursor-pointer"
                >
                  <Search className="w-5 h-5" />
                  <span>খুঁজুন</span>
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      </section>

      {/* 2. CATEGORY SLIDER WITH CONTROLS */}
      <section className="py-6 border-b border-slate-200/80 bg-white sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="flex items-center justify-between gap-4">
            
            <button
              onClick={slideLeft}
              className="hidden md:flex w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 hover:text-teal-700 items-center justify-center shadow-sm shrink-0 transition active:scale-95"
              aria-label="Previous categories"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div
              ref={sliderRef}
              className="flex items-center gap-4 overflow-x-auto scrollbar-none py-2 scroll-smooth w-full"
            >
              {TRAVEL_STYLES.map((style) => {
                const isActive = activeCategory === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setActiveCategory(style.id)}
                    className={`shrink-0 flex items-center gap-3.5 px-6 py-3.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-teal-50/90 border-teal-600 text-teal-950 shadow-md ring-4 ring-teal-600/10 scale-[1.02]" 
                        : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl shrink-0 leading-none select-none">
                      {style.icon}
                    </span>
                    <div>
                      <h4 className="text-base font-extrabold leading-tight whitespace-nowrap">
                        {style.name}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium mt-0.5 block whitespace-nowrap">{style.count}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={slideRight}
              className="hidden md:flex w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-slate-700 hover:text-teal-700 items-center justify-center shadow-sm shrink-0 transition active:scale-95"
              aria-label="Next categories"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

          </div>
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS (STAGGERED ANIMATION) */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
          >
            <div>
              <span className="text-sm font-bold text-teal-700 uppercase tracking-widest block mb-2">জনপ্রিয় ভ্রমণ স্পট</span>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
                {activeCategory === "all" ? "টপ রেটেড ট্যুর গন্তব্য" : `${TRAVEL_STYLES.find(s => s.id === activeCategory)?.name} প্যাকেজ`}
              </h2>
            </div>
            
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-black text-base border border-teal-200/60 transition group self-start sm:self-auto"
            >
              <span>সব গন্তব্য দেখুন</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredDestinations.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/9] relative w-full overflow-hidden bg-slate-950">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <Compass className="w-16 h-16 text-slate-700" />
                        </div>
                      )}
                    </div>

                    <div className="p-7">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {item.badge ? (
                          <span className="px-3.5 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                            {item.badge}
                          </span>
                        ) : <span />}

                        {item.rating && (
                          <div className="flex items-center gap-1 text-amber-500 text-sm font-black">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{item.rating}</span>
                            {item.reviews > 0 && (
                              <span className="text-slate-400 text-xs font-normal">({item.reviews})</span>
                            )}
                          </div>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-slate-950 tracking-tight leading-snug">{item.title}</h3>
                      {item.subtitle && (
                        <p className="text-sm text-slate-600 font-medium mt-1 flex items-center gap-1.5 line-clamp-1">
                          <MapPin className="w-4 h-4 text-teal-600 shrink-0" /> {item.subtitle}
                        </p>
                      )}

                      {item.highlights && item.highlights.length > 0 && (
                        <ul className="mt-5 space-y-2 text-sm font-medium text-slate-700 border-t border-slate-100 pt-4">
                          {item.highlights.slice(0, 3).map((point: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5 stroke-[3]" />
                              <span className="line-clamp-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="p-7 pt-0">
                    <div className="flex items-center justify-between py-4 border-t border-slate-100 mb-5">
                      <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                        <Clock className="w-4 h-4 text-teal-600" /> {item.duration}
                      </span>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-medium">১ জনের জন্য</span>
                        <span className="text-2xl font-black text-slate-950">
                          ৳{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/booking?dest=${item.post_id || item.id}`}
                      className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-600/25 transition active:scale-95"
                    >
                      <span>বুকিং কনফার্ম করুন</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
              <p className="text-slate-600 text-lg font-bold">
                {loading ? "ডেস্টিনেশন লোড হচ্ছে..." : "এই ক্যাটাগরিতে বর্তমানে কোনো ট্যুর নেই। অন্য ক্যাটাগরি সিলেক্ট করুন।"}
              </p>
            </div>
          )}

        </div>
      </section>

      {/* 4. POPULAR HOT DEALS SECTION */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-2">হট ডিলস</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              জনপ্রিয় ট্যুর প্যাকেজসমূহ
            </h2>
            <p className="mt-3 text-slate-400 text-base leading-relaxed">
              আমাদের সবচেয়ে জনপ্রিয় প্যাকেজগুলোর জনপ্রতি খরচ দেখে এখনই সহজে বুকিং নিশ্চিত করুন।
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.slice(0, 3).map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-slate-800/90 rounded-3xl p-8 border border-slate-700 hover:border-teal-500/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
                      {item.badge || "পপুলার প্যাকেজ"}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                      <Clock className="w-4 h-4 text-teal-400" /> {item.duration}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 mb-6 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0" /> {item.subtitle || item.title}
                  </p>

                  <div className="space-y-3 pt-5 border-t border-slate-700/80 mb-8">
                    {item.highlights.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-700/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">জনপ্রতি খরচ</span>
                    <span className="text-3xl font-black text-teal-400">৳{item.price.toLocaleString()}</span>
                  </div>

                  <Link
                    href={`/booking?dest=${item.post_id || item.id}`}
                    className="py-3 px-6 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition"
                  >
                    বুক করুন
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. WHY BOOK WITH US SECTION */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">আমাদের বৈশিষ্ট্য</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              কেন ট্রাভলা বিডি বেছে নেবেন?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                title: "১০০% নিরাপদ ভ্রমণ",
                desc: "নারী, পরিবার ও শিশুদের জন্য সর্বোচ্চ নিরাপত্তা নিশ্চিত করে আমরা প্রতিটি ট্যুর পরিচালনা করি।"
              },
              {
                icon: <Award className="w-7 h-7" />,
                title: "অভিজ্ঞ লোকাল গাইড",
                desc: "প্রতিটি গন্তব্যের দক্ষ ও পরিচিত লোকাল গাইড সবসময় আপনার সুবিধার্থে পাশে থাকবেন।"
              },
              {
                icon: <Sparkles className="w-7 h-7" />,
                title: "বেস্ট প্রাইস গ্যারান্টি",
                desc: "কোনো হিডেন চার্জ নেই। রিসোর্ট ও ট্রাভেলিংয়ে আমরা সরাসরি সেরা কর্পোরেট ডিল অফার করি।"
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: "২৪/৭ কাস্টমার কেয়ার",
                desc: "ভ্রমণ শুরুর পূর্ব থেকে শেষ হওয়া পর্যন্ত সার্বক্ষণিক ফোন ও হোয়াটসঅ্যাপ সাপোর্ট।"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-teal-200 transition"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. TESTIMONIALS & USER REVIEWS SECTION */}
      <section className="py-20 lg:py-24 bg-[#f8fafc] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">পর্যটকদের মতামত</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              ভ্রমণকারীদের বাস্তব অভিজ্ঞতা
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              আমাদের সাথে ভ্রমণ করার পর পর্যটকদের অমূল্য মতামত ও রিভিউ।
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((rev, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <p className="text-base text-slate-700 leading-relaxed mb-6 italic">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-5 border-t border-slate-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden relative bg-slate-200 shrink-0">
                    <Image src={rev.avatar} alt={rev.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-950 text-base">{rev.name}</h5>
                    <span className="text-xs text-slate-400 block">{rev.tour} • {rev.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-2">সাধারণ জিজ্ঞাসা</span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
              সচরাচর জিজ্ঞাসিত প্রশ্নাবলি
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  className="rounded-2xl border border-slate-200/90 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full py-5 px-6 sm:px-8 text-left font-bold text-base sm:text-lg text-slate-900 bg-white hover:bg-slate-50 flex items-center justify-between gap-4 transition"
                  >
                    <span>{faq.q}</span>
                    <span className="text-2xl text-teal-600 font-bold shrink-0">{isOpen ? "−" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="px-6 sm:px-8 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 8. NEWSLETTER / CALL TO ACTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-3xl p-8 sm:p-14 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl shadow-teal-900/10"
          >
            <div className="max-w-xl text-center lg:text-left">
              <span className="px-3.5 py-1.5 rounded-full bg-white/15 text-xs font-bold text-teal-100 border border-white/20 mb-3 inline-block">
                ১০% স্পেশাল ছাড়
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                ট্যুর গাইড ও অফার পেতে সাবস্ক্রাইব করুন
              </h3>
              <p className="mt-2 text-base text-teal-100/90 leading-relaxed">
                আপনার পরবর্তী ভ্রমণের স্পেশাল ডিসকাউন্ট কুপন ও সেরা গন্তব্যের তথ্য সরাসরি ইমেইলে পাঠিয়ে দেওয়া হবে।
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="আপনার ইমেইল এড্রেস লিখুন..."
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-teal-200/60 text-base outline-none focus:bg-white/20 transition"
                required
              />
              <button
                type="submit"
                className="py-4 px-7 rounded-2xl bg-white hover:bg-teal-50 text-teal-950 font-black text-base shrink-0 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4 text-teal-800" />
                <span>যুক্ত হন</span>
              </button>
            </form>
          </motion.div>
        </div>
      </section>

    </div>
  );
}