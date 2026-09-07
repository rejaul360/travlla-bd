"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, Users, MapPin, Sparkles, 
  CheckCircle2, AlertCircle, Loader2, Phone, Mail, User, 
  CreditCard, Clock, Star, ArrowLeft, ShieldCheck, Check,
  Compass, LayoutGrid
} from "lucide-react";
import { fallbackDestinations } from "@/lib/wordpress";

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

const TIERS = [
  { id: "Standard", name: "স্ট্যান্ডার্ড প্যাকেজ", multiplier: 1, desc: "মানসম্মত রিসোর্ট ও শেয়ার্ড পরিবহন ব্যবস্থা" },
  { id: "Deluxe", name: "ডিলাক্স প্যাকেজ", multiplier: 1.35, desc: "প্রিমিয়াম ভিউ রিসোর্ট ও আরামদায়ক এসি ট্রাভেল" },
];

function BookingFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const destParam = searchParams.get("dest") || "";
  const dateParam = searchParams.get("date") || "";
  const guestsParam = parseInt(searchParams.get("guests") || "1", 10);

  // ০ সেকেন্ডে ইনস্ট্যান্ট লোড করার জন্য শুরুতেই লোকাল ফলব্যাক ডেটা সেট রাখা হয়েছে
  const [allDestinations, setAllDestinations] = useState<DestinationItem[]>(fallbackDestinations as any);
  const [currentPackage, setCurrentPackage] = useState<DestinationItem | null>(null);
  const [guests, setGuests] = useState<number>(!isNaN(guestsParam) && guestsParam > 0 ? guestsParam : 1);
  const [selectedTier, setSelectedTier] = useState<string>("Standard");
  const [travelDate, setTravelDate] = useState<string>(dateParam);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const isDirectFromCard = Boolean(destParam.trim());

  // হেল্পার: ডেস্টিনেশন খোঁজার ফাংশন
  const findDestination = (data: DestinationItem[]) => {
    if (!isDirectFromCard) return null;

    const rawTarget = destParam.trim().toLowerCase();
    const decodedTarget = decodeURIComponent(destParam).trim().toLowerCase();

    let found = data.find((d) => String(d.post_id) === rawTarget || String(d.id) === rawTarget);
    if (!found) {
      found = data.find((d) => d.slug && d.slug.toLowerCase() === decodedTarget);
    }
    if (!found) {
      found = data.find((d) => 
        d.title.toLowerCase().includes(decodedTarget) || 
        decodedTarget.includes(d.title.toLowerCase())
      );
    }
    if (!found) {
      if (rawTarget.includes("tanguar") || decodedTarget.includes("টাঙ্গুয়ার") || decodedTarget.includes("হাওড়")) {
        found = data.find(d => d.title.includes("টাঙ্গুয়ার") || d.title.includes("হাওড়"));
      } else if (rawTarget.includes("cox") || decodedTarget.includes("কক্সবাজার")) {
        found = data.find(d => d.title.includes("কক্সবাজার"));
      } else if (rawTarget.includes("sajek") || decodedTarget.includes("সাজেক")) {
        found = data.find(d => d.title.includes("সাজেক"));
      } else if (rawTarget.includes("bandarban") || decodedTarget.includes("বান্দরবান")) {
        found = data.find(d => d.title.includes("বান্দরবান"));
      } else if (rawTarget.includes("sreemangal") || decodedTarget.includes("শ্রীমঙ্গল")) {
        found = data.find(d => d.title.includes("শ্রীমঙ্গল"));
      }
    }
    return found || null;
  };

  // মাউন্টের সাথে সাথেই ইনিশিয়াল প্যাকেজ ম্যাচিং (নো ওয়েটিং)
  useEffect(() => {
    if (isDirectFromCard) {
      const match = findDestination(fallbackDestinations as any);
      if (match) setCurrentPackage(match);
    }
  }, [destParam, isDirectFromCard]);

  // ব্যাকগ্রাউন্ডে ওয়ার্ডপ্রেসের সাথে লাইভ সিঙ্ক (UI আটকাবে না)
  useEffect(() => {
    fetch("https://ams.wpelitee.com/wp-json/travlla/v1/destinations", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: DestinationItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllDestinations(data);
          if (isDirectFromCard) {
            const match = findDestination(data);
            if (match) setCurrentPackage(match);
          }
        }
      })
      .catch(() => {
        console.warn("Using local cache for destinations");
      });
  }, [destParam, isDirectFromCard]);

  const currentTierObj = TIERS.find((t) => t.id === selectedTier) || TIERS[0];
  const basePrice = currentPackage?.price || 0;
  const pricePerPerson = Math.round(basePrice * currentTierObj.multiplier);
  const totalEstimate = pricePerPerson * guests;

  const handleInputChange = (field: string, value: string) => {
    if (status) setStatus(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackage) {
      setStatus({
        type: "error",
        message: "দয়া করে বুকিং করার জন্য তালিকা থেকে যেকোনো একটি ট্যুর প্যাকেজ নির্বাচন করুন।",
      });
      return;
    }
    setLoading(true);
    setStatus(null);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: currentPackage.title,
        travel_date: travelDate,
        guests: guests,
        package: currentTierObj.name,
        total_estimate: totalEstimate,
        notes: formData.notes,
      };

      const res = await fetch("https://ams.wpelitee.com/wp-json/travlla/v1/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "বুকিং সম্পন্ন করা যায়নি।");

      setStatus({
        type: "success",
        message: "আপনার বুকিং অনুরোধটি সফলভাবে গ্রহণ করা হয়েছে! আমাদের টিম দ্রুত ফোনে যোগাযোগ করে নিশ্চিত করবে।",
      });

      setFormData({ name: "", email: "", phone: "", notes: "" });
      setTravelDate("");

      // ৪ সেকেন্ড পর স্ট্যাটাস অটোমেটিক চলে যাবে
      setTimeout(() => setStatus(null), 4000);
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      
      {/* LEFT COLUMN: DESTINATION SELECTOR / HERO CARD + BOOKING FORM */}
      <div className="lg:col-span-8 space-y-10">

        {/* কেস ১: ইউজার যদি সরাসরি বুকিং পেজে আসে (তখন ছোট মিনি গ্রিড দেখাবে) */}
        {!isDirectFromCard && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block mb-1">
                  ধাপ ১: পছন্দ নির্বাচন
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-950 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-teal-600" /> কোন ট্যুরটিতে যেতে চান বেছে নিন
                </h3>
              </div>
              {currentPackage && (
                <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                  সিলেক্টেড: {currentPackage.title}
                </span>
              )}
            </div>

            {/* কমপ্যাক্ট মিনি কার্ড গ্রিড */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allDestinations.map((item) => {
                const isSelected = currentPackage?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (status) setStatus(null);
                      setCurrentPackage(item);
                    }}
                    className={`text-left p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between group cursor-pointer ${
                      isSelected
                        ? "border-teal-600 bg-teal-50/60 ring-4 ring-teal-600/10 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60"
                    }`}
                  >
                    <div>
                      <div className="aspect-[16/10] relative w-full rounded-xl overflow-hidden bg-slate-950 mb-3">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-contain w-full h-full group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                            <Compass className="w-8 h-8 text-slate-700" />
                          </div>
                        )}
                        {isSelected && (
                          <span className="absolute top-2 right-2 p-1 rounded-full bg-teal-600 text-white shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-extrabold text-slate-950 line-clamp-1 group-hover:text-teal-700 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {item.subtitle || item.title}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{item.duration}</span>
                      <span className="font-black text-slate-950 text-sm">
                        ৳{item.price.toLocaleString()}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {!currentPackage && (
              <p className="mt-4 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
                * অনুগ্রহ করে উপরের যেকোনো একটি কার্ডে ক্লিক করে গন্তব্য নির্ধারণ করুন।
              </p>
            )}
          </div>
        )}

        {/* কেস ২: কার্ড থেকে আসলে সরাসরি সিঙ্গেল প্যাকেজ ডিটেইলস ব্যানার (অথবা সরাসরি এসে উপরে সিলেক্ট করার পর) */}
        {currentPackage && (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm">
            <div className="relative w-full aspect-[16/9] bg-slate-950 overflow-hidden">
              {currentPackage.image ? (
                <Image
                  src={currentPackage.image}
                  alt={currentPackage.title}
                  fill
                  priority
                  unoptimized
                  className="object-contain w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-slate-600" />
                </div>
              )}
            </div>

            <div className="p-7 sm:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {currentPackage.badge && (
                    <span className="px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 text-sm font-bold border border-teal-200/80 shadow-xs">
                      {currentPackage.badge}
                    </span>
                  )}
                  {currentPackage.rating && (
                    <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-900 text-sm font-bold border border-amber-200/80">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{currentPackage.rating}</span>
                      {currentPackage.reviews > 0 && (
                        <span className="text-slate-500 text-xs sm:text-sm font-medium">({currentPackage.reviews} রিভিউ)</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    router.push("/booking");
                    setCurrentPackage(null);
                  }}
                  className="text-sm sm:text-base font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 hover:underline group cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> অন্য গন্তব্য নির্বাচন করুন
                </button>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-tight">
                {currentPackage.title}
              </h2>
              {currentPackage.subtitle && (
                <p className="text-base sm:text-lg text-slate-600 font-medium mt-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-600 shrink-0" /> {currentPackage.subtitle}
                </p>
              )}

              <div className="mt-7 py-5 px-6 sm:px-8 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-slate-800">
                  <Clock className="w-5 h-5 text-teal-600" /> মেয়াদ: {currentPackage.duration}
                </span>
                <div className="text-left sm:text-right">
                  <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500 block mb-0.5">বেস প্যাকেজ রেট</span>
                  <span className="text-2xl sm:text-3xl font-black text-teal-700">
                    ৳{currentPackage.price.toLocaleString()} <span className="text-sm sm:text-base font-normal text-slate-500">/ জনপ্রতি</span>
                  </span>
                </div>
              </div>

              {currentPackage.highlights && currentPackage.highlights.length > 0 && (
                <div className="mt-8 pt-7 border-t border-slate-100">
                  <span className="text-sm font-bold uppercase tracking-wider text-slate-500 block mb-4">
                    প্যাকেজের প্রধান আকর্ষণসমূহ
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {currentPackage.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm sm:text-base font-medium text-slate-800">
                        <div className="w-5 h-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* BOOKING FORM */}
        <div className="bg-white rounded-3xl p-7 sm:p-12 border border-slate-200/90 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Travel Date & Travelers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" /> ১. ভ্রমণের তারিখ নির্বাচন করুন *
                </label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => {
                    if (status) setStatus(null);
                    setTravelDate(e.target.value);
                  }}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none text-base sm:text-lg font-semibold text-slate-800 bg-slate-50/70 transition"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" /> ২. ভ্রমণকারী সদস্য সংখ্যা *
                </label>
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (status) setStatus(null);
                      setGuests(Math.max(1, guests - 1));
                    }}
                    className="w-14 h-14 rounded-2xl border border-slate-300 bg-slate-50 font-black text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition active:scale-95 text-2xl flex items-center justify-center shadow-xs cursor-pointer"
                    aria-label="Decrease traveler"
                  >
                    -
                  </button>
                  <div className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-50/80 border border-slate-300 text-center">
                    <span className="text-xl sm:text-2xl font-black text-slate-950">{guests} জন</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (status) setStatus(null);
                      setGuests(guests + 1);
                    }}
                    className="w-14 h-14 rounded-2xl border border-slate-300 bg-slate-50 font-black text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition active:scale-95 text-2xl flex items-center justify-center shadow-xs cursor-pointer"
                    aria-label="Increase traveler"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Package Category Tier */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" /> ৩. প্যাকেজ ক্যাটাগরি বেছে নিন
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {TIERS.map((tier) => (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => {
                      if (status) setStatus(null);
                      setSelectedTier(tier.id);
                    }}
                    className={`p-6 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      selectedTier === tier.id
                        ? "border-teal-600 bg-teal-50/70 ring-4 ring-teal-600/10 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-extrabold text-slate-950 text-base sm:text-lg">{tier.name}</p>
                      {selectedTier === tier.id && (
                        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Information */}
            <div className="space-y-6 pt-8 border-t border-slate-200">
              <h4 className="text-lg sm:text-xl font-black text-slate-950">৪. আপনার যোগাযোগের তথ্য দিন</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-teal-600" /> আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="পুরো নাম লিখুন (যেমন: মো: তানভীর আহমেদ)"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-teal-600" /> মোবাইল নম্বর *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="০১৭০০-০০০০০০"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-600" /> ইমেইল ঠিকানা
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-800 mb-2">
                  অতিরিক্ত চাহিদা বা বিশেষ নোট (যদি থাকে)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="রিসোর্ট ভিউ, পিকআপ লোকেশন বা বিশেষ কোনো চাহিদা থাকলে বিস্তারিত লিখুন..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 outline-none transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 px-8 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-black rounded-2xl shadow-xl shadow-teal-600/30 text-lg sm:text-xl transition flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>বুকিং প্রসেস করা হচ্ছে...</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-3">
                    <CreditCard className="w-6 h-6" />
                    <span>বুকিং কনফার্ম করুন</span>
                  </span>
                )}
              </button>

              {status && (
                <div
                  className={`mt-6 p-5 rounded-2xl flex items-start gap-3.5 text-base sm:text-lg transition-all ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-900 border-2 border-emerald-200"
                      : "bg-red-50 text-red-900 border-2 border-red-200"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed font-semibold">{status.message}</span>
                </div>
              )}
            </div>

          </form>
        </div>

      </div>

      {/* RIGHT COLUMN: STICKY REAL-TIME PRICING & SUMMARY */}
      <div className="lg:col-span-4 sticky top-28">
        <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-9 shadow-2xl border border-slate-800">
          <h3 className="text-xl sm:text-2xl font-black text-white mb-6 border-b border-slate-800 pb-4 flex items-center justify-between">
            <span>বুকিং সামারি</span>
            <span className="text-xs font-bold px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
              লাইভ হিসাব
            </span>
          </h3>

          <div className="space-y-5 text-base sm:text-lg">
            <div className="flex justify-between items-start gap-3 text-slate-300">
              <span className="text-slate-400 font-medium shrink-0">নির্বাচিত গন্তব্য:</span>
              <span className="font-extrabold text-teal-400 text-right">
                {currentPackage ? currentPackage.title : "প্যাকেজ নির্বাচন করুন"}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-medium">ভ্রমণের মেয়াদ:</span>
              <span className="font-bold text-white">
                {currentPackage ? currentPackage.duration : "—"}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-medium">প্যাকেজ ধরন:</span>
              <span className="font-bold text-white">{currentTierObj.name}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-medium">ভ্রমণকারী সংখ্যা:</span>
              <span className="font-black text-white bg-slate-800 px-3.5 py-1 rounded-xl border border-slate-700">
                {guests} জন
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400 font-medium">১ জনের খরচ (জনপ্রতি):</span>
              <span className="font-bold text-white">
                {currentPackage ? `৳${pricePerPerson.toLocaleString()}` : "৳০"}
              </span>
            </div>

            <div className="pt-6 border-t border-slate-800 flex justify-between items-baseline">
              <div>
                <span className="text-base sm:text-lg font-bold text-slate-200 block">মোট প্রাক্কলিত খরচ:</span>
                <span className="text-xs sm:text-sm text-slate-400 font-medium">({guests} জনের সর্বমোট খরচ)</span>
              </div>
              <span className="text-3xl sm:text-4xl font-black text-teal-400 tracking-tight">
                ৳{totalEstimate.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-slate-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-300 text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" /> ১০০% নিরাপদ বুকিং প্রসেস
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              অনলাইনে এখন কোনো কার্ড পেমেন্ট করতে হবে না। বুকিং পাঠানোর পর আমাদের প্রতিনিধি সরাসরি ফোনে যোগাযোগ করে কনফার্ম করবেন।
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 sm:py-20 notranslate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-900 text-xs sm:text-sm font-bold mb-4 border border-teal-200/80">
            <Sparkles className="w-4 h-4 text-teal-700" /> সহজ ৩ ধাপে বুকিং
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            আপনার পছন্দের <span className="text-teal-600">ট্যুর বুক করুন</span>
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            গন্তব্য নির্বাচন করুন, সদস্য সংখ্যা ও তারিখ দিয়ে সরাসরি ট্যুর বুকিং নিশ্চিত করুন।
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-24 font-bold text-slate-500 text-lg">লোড হচ্ছে...</div>}>
          <BookingFormInner />
        </Suspense>

      </div>
    </div>
  );
}