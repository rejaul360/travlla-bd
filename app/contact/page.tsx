"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, Phone, Mail, Send, CheckCircle2, 
  MessageSquare, ShieldCheck, AlertCircle, Loader2, X 
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // সাকসেস মেসেজ আসলে ঠিক ৪ সেকেন্ড পর অটোমেটিক গায়েব হয়ে যাবে
  useEffect(() => {
    if (status?.type === "success") {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // ইনপুটে টাইপ শুরু করলেই সাথে সাথে মেসেজ মুছে যাবে
  const handleInputChange = (field: string, value: string) => {
    if (status) setStatus(null);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("https://ams.wpelitee.com/wp-json/travlla/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: "ওয়েবসাইট সাধারণ অনুসন্ধান",
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "মেসেজ পাঠানো সম্ভব হয়নি।");
      }

      setFormData({ name: "", email: "", phone: "", message: "" });
      setStatus({ 
        type: "success", 
        message: "ধন্যবাদ! আপনার বার্তাটি আমাদের কাছে পৌঁছেছে। দ্রুত যোগাযোগ করা হবে।" 
      });
    } catch (err: unknown) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "কোনো সমস্যা হয়েছে। আবার চেষ্টা করুন।",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] py-14 sm:py-24 notranslate text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal-100 text-teal-900 text-sm font-bold mb-4 border border-teal-200/80">
            <MessageSquare className="w-4 h-4 text-teal-700" /> সার্বক্ষণিক সহায়তা
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            আমাদের সাথে <span className="text-teal-600">যোগাযোগ করুন</span>
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            যেকোনো ভ্রমণ সংক্রান্ত তথ্য, কাস্টম ট্যুর প্যাকেজ তৈরি অথবা করপোরেট বুকিংয়ের জন্য আমাদের মেসেজ পাঠান।
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
              <h3 className="text-2xl font-black text-white border-b border-slate-800 pb-4">
                অফিস ও হেল্পডেস্ক
              </h3>

              <div className="space-y-6 text-base sm:text-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base sm:text-lg">প্রধান কার্যালয়</h5>
                    <p className="text-slate-400 text-sm sm:text-base mt-1 leading-relaxed">
                      হাউস-২৪, রোড-১১, ব্লক-ডি, গুলশান-২, ঢাকা-১২১২, বাংলাদেশ।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base sm:text-lg">হেল্পলাইন ও হোয়াটসঅ্যাপ</h5>
                    <a href="tel:+8801700000000" className="text-teal-400 font-bold block mt-1 hover:underline">
                      +৮৮০ ১৭০০-০০০০০০
                    </a>
                    <span className="text-slate-400 text-xs sm:text-sm">২৪ ঘণ্টা খোলা (সপ্তাহে ৭ দিন)</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base sm:text-lg">ইমেইল ঠিকানা</h5>
                    <p className="text-slate-400 text-sm sm:text-base mt-1">support@travllabd.com</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center gap-3 text-sm text-slate-300">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0" />
                <span>আমরা আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ গোপনীয়তা বজায় রাখি।</span>
              </div>
            </div>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 mb-8">
              একটি বার্তা পাঠান
            </h3>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-bold text-slate-900 mb-2">আপনার পুরো নাম *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="নাম লিখুন"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-base font-bold text-slate-900 mb-2">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="০১৭০০-০০০০০০"
                    className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-base font-bold text-slate-900 mb-2">আপনার বার্তা লিখুন *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="আপনার ট্যুর পরিকল্পনা, তারিখ অথবা যেকোনো জিজ্ঞাসা বিস্তারিত লিখুন..."
                  className="w-full px-5 py-4 rounded-2xl border border-slate-300 text-base text-slate-900 placeholder:text-slate-400 focus:border-teal-600 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 px-8 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-black text-lg rounded-2xl shadow-xl shadow-teal-600/30 transition flex items-center justify-center gap-3 active:scale-[0.99] cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>পাঠানো হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>মেসেজ পাঠান</span>
                  </>
                )}
              </button>

              {status && (
                <div
                  className={`p-5 rounded-2xl flex items-center justify-between text-base font-bold border-2 transition-all duration-300 animate-in fade-in ${
                    status.type === "success"
                      ? "bg-emerald-50 text-emerald-900 border-emerald-200"
                      : "bg-rose-50 text-rose-900 border-rose-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {status.type === "success" ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                    )}
                    <span>{status.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus(null)}
                    aria-label="বার্তা বন্ধ করুন"
                    className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-black/5 transition cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}