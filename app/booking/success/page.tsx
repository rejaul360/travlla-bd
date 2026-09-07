"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
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

  const [allDestinations, setAllDestinations] = useState<DestinationItem[]>(fallbackDestinations as any);
  const [currentPackage, setCurrentPackage] = useState<DestinationItem | null>(null);
  const [guests, setGuests] = useState<number>(!isNaN(guestsParam) && guestsParam > 0 ? guestsParam : 1);
  const [selectedTier, setSelectedTier] = useState<string>("Standard");
  const [travelDate, setTravelDate] = useState<string>(dateParam);
  
  // নতুন: পেমেন্ট মেথড স্টেট
  const [paymentMethod, setPaymentMethod] = useState<"online" | "later">("online");

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const isDirectFromCard = Boolean(destParam.trim());

  const findDestination = (data: DestinationItem[]) => {
    if (!isDirectFromCard) return null;
    const decoded = decodeURIComponent(destParam).trim().toLowerCase();
    return data.find(d => 
      String(d.id) === decoded || 
      (d.slug && d.slug.toLowerCase() === decoded) || 
      d.title.toLowerCase().includes(decoded)
    ) || null;
  };

  useEffect(() => {
    if (isDirectFromCard) {
      const match = findDestination(fallbackDestinations as any);
      if (match) setCurrentPackage(match);
    }
  }, [destParam, isDirectFromCard]);

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
      .catch(() => console.warn("Using cached destinations"));
  }, [destParam, isDirectFromCard]);

  const currentTierObj = TIERS.find((t) => t.id === selectedTier) || TIERS[0];
  const basePrice = currentPackage?.price || 0;
  const pricePerPerson = Math.round(basePrice * currentTierObj.multiplier);
  const totalEstimate = pricePerPerson * guests;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackage) {
      setStatus({ type: "error", message: "দয়া করে তালিকা থেকে একটি ট্যুর প্যাকেজ নির্বাচন করুন।" });
      return;
    }
    setLoading(true);
    setStatus(null);

    // ১. অনলাইন পেমেন্ট (SSLCommerz)
    if (paymentMethod === "online") {
      try {
        const res = await fetch("/api/payment/initiate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            destination: currentPackage.title,
            travelers: guests,
            packageType: currentTierObj.name,
            totalAmount: totalEstimate,
            notes: formData.notes,
          }),
        });

        const data = await res.json();
        if (data?.url) {
          // সরাসরি SSLCommerz পেমেন্ট পেজে চলে যাবে
          window.location.href = data.url;
        } else {
          throw new Error(data.message || "পেমেন্ট গেটওয়ে লোড করা সম্ভব হয়নি।");
        }
      } catch (err: any) {
        setStatus({ type: "error", message: err.message || "গেটওয়েতে সমস্যা হয়েছে।" });
        setLoading(false);
      }
    } 
    // ২. পে লেটার (Pay Later / Cash)
    else {
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
          message: "আপনার বুকিং সফলভাবে গ্রহণ করা হয়েছে! আমাদের টিম দ্রুত ফোনে যোগাযোগ করবে।",
        });

        setFormData({ name: "", email: "", phone: "", notes: "" });
        setTravelDate("");
        setTimeout(() => setStatus(null), 4500);
      } catch (err: any) {
        setStatus({ type: "error", message: err.message || "কোনো সমস্যা হয়েছে।" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      
      {/* LEFT COLUMN: DESTINATIONS & FORM */}
      <div className="lg:col-span-8 space-y-10">

        {/* ধাপ ১: ট্যুর গ্রিড */}
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

        {/* ব্যানার মোড */}
        {currentPackage && (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm">
            <div className="relative w-full aspect-[16/9] bg-slate-950 overflow-hidden">
              {currentPackage.image && (
                <Image
                  src={currentPackage.image}
                  alt={currentPackage.title}
                  fill
                  priority
                  unoptimized
                  className="object-contain w-full h-full"
                />
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
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    router.push("/booking");
                    setCurrentPackage(null);
                  }}
                  className="text-sm sm:text-base font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" /> অন্য গন্তব্য নির্বাচন করুন
                </button>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950">
                {currentPackage.title}
              </h2>
            </div>
          </div>
        )}

        {/* বুকিং ও পেমেন্ট ফর্ম */}
        <div className="bg-white rounded-3xl p-7 sm:p-12 border border-slate-200/90 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* তারিখ ও মেম্বার */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-teal-600" /> ১. ভ্রমণের তারিখ নির্বাচন করুন *
                </label>
                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-300 focus:border-teal-600 outline-none text-base font-semibold text-slate-800 bg-slate-50/70 transition"
                />
              </div>

              <div>
                <label className="block text-sm sm:text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" /> ২. ভ্রমণকারী সদস্য সংখ্যা *
                </label>
                <div className="flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    className="w-14 h-14 rounded-2xl border border-slate-300 bg-slate-50 font-black text-slate-800 hover:bg-slate-100 text-2xl flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <div className="flex-1 py-3.5 px-6 rounded-2xl bg-slate-50/80 border border-slate-300 text-center">
                    <span className="text-xl sm:text-2xl font-black text-slate-950">{guests} জন</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuests(guests + 1)}
                    className="w-14 h-14 rounded-2xl border border-slate-300 bg-slate-50 font-black text-slate-800 hover:bg-slate-100 text-2xl flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* প্যাকেজ টিয়ার */}
            <div>
              <label className="block text-sm sm:text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" /> ৩. প্যাকেজ ক্যাটাগরি বেছে নিন
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {TIERS.map((tier) => (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`p-6 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      selectedTier === tier.id
                        ? "border-teal-600 bg-teal-50/70 ring-4 ring-teal-600/10"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-extrabold text-slate-950 text-base sm:text-lg">{tier.name}</p>
                      {selectedTier === tier.id && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* যোগাযোগের তথ্য */}
            <div className="space-y-6 pt-8 border-t border-slate-200">
              <h4 className="text-lg sm:text-xl font-black text-slate-950">৪. আপনার যোগাযোগের তথ্য দিন</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">আপনার নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: মোঃ রেজাউল ইসলাম"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 text-slate-900 focus:border-teal-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-2">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="০১৭১৭-৯৮০৯১৭"
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 text-slate-900 focus:border-teal-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-300 text-slate-900 focus:border-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-800 mb-2">বিশেষ কোনো চাহিদা বা নোট</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="রিসোর্ট ভিউ, খাবারের স্পেশাল চাহিদা বা পিকআপ পয়েন্ট..."
                  className="w-full px-5 py-3 rounded-2xl border border-slate-300 text-slate-900 focus:border-teal-600 outline-none"
                />
              </div>
            </div>

            {/* ৫. পেমেন্ট মেথড সিলেকশন */}
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <label className="block text-base sm:text-lg font-black text-slate-950">
                ৫. পেমেন্ট পদ্ধতি বেছে নিন
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentMethod("online")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === "online"
                      ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-950 text-sm sm:text-base">অনলাইন পেমেন্ট (ইনস্ট্যান্ট কনফার্ম)</p>
                    <p className="text-xs text-slate-500 mt-0.5">বিকাশ, নগদ, রকেট, ডেবিট/ক্রেডিট কার্ড</p>
                  </div>
                  {paymentMethod === "online" && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
                </div>

                <div
                  onClick={() => setPaymentMethod("later")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === "later"
                      ? "border-teal-600 bg-teal-50/50 ring-2 ring-teal-600/20"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-950 text-sm sm:text-base">পরে পরিশোধ করুন (Pay Later)</p>
                    <p className="text-xs text-slate-500 mt-0.5">ফোনে কথা বলে নিশ্চিত করার পর পরিশোধযোগ্য</p>
                  </div>
                  {paymentMethod === "later" && <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />}
                </div>
              </div>
            </div>

            {/* সাবমিট বাটন */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-8 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-black rounded-2xl shadow-xl shadow-teal-600/30 text-base sm:text-lg transition flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>প্রসেসিং হচ্ছে...</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    <span>{paymentMethod === "online" ? "পেমেন্ট করতে এগিয়ে যান" : "বুকিং নিশ্চিত করুন"}</span>
                  </span>
                )}
              </button>

              {status && (
                <div
                  className={`mt-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border-2 ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                      : "bg-red-50 text-red-900 border-red-200"
                  }`}
                >
                  {status.type === "success" ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{status.message}</span>
                </div>
              )}
            </div>

          </form>
        </div>

      </div>

      {/* RIGHT COLUMN: REAL-TIME SUMMARY */}
      <div className="lg:col-span-4 sticky top-28">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-xl font-black text-white">বুকিং সামারি</h3>
            <span className="text-xs font-bold px-2.5 py-1 bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/30">
              লাইভ হিসাব
            </span>
          </div>

          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between items-start gap-2 text-slate-300">
              <span className="text-slate-400">নির্বাচিত গন্তব্য:</span>
              <span className="font-extrabold text-teal-400 text-right">
                {currentPackage ? currentPackage.title : "প্যাকেজ নির্বাচন করুন"}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">ভ্রমণের মেয়াদ:</span>
              <span className="font-bold text-white">{currentPackage?.duration || "—"}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">প্যাকেজ ধরন:</span>
              <span className="font-bold text-white">{currentTierObj.name}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">ভ্রমণকারী সংখ্যা:</span>
              <span className="font-black text-white bg-slate-800 px-3 py-0.5 rounded-lg border border-slate-700">
                {guests} জন
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">জনপ্রতি খরচ:</span>
              <span className="font-bold text-white">
                {currentPackage ? `৳${pricePerPerson.toLocaleString()}` : "৳০"}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-300 block">মোট খরচ:</span>
                <span className="text-[11px] text-slate-400">({guests} জনের সর্বমোট)</span>
              </div>
              <span className="text-3xl font-black text-teal-400">
                ৳{totalEstimate.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>SSLCommerz এনক্রিপ্টেড পেমেন্ট গেটওয়ে</span>
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
        <div className="text-center max-w-3xl mx-auto mb-14">
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