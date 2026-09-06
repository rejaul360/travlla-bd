import Link from "next/link";
import Image from "next/image";
import { Compass, Star, Clock, MapPin, ArrowRight, Check } from "lucide-react";
import { getDestinations } from "@/lib/wordpress";

export const revalidate = 60;

export default async function DestinationsPage() {
  const destinations = await getDestinations();

  return (
    <div className="min-h-screen bg-[#fafbfc] py-14 sm:py-24 notranslate text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header (H1: 56px scale) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal-100 text-teal-900 text-sm font-bold mb-4 border border-teal-200/80">
            <Compass className="w-4 h-4 text-teal-700" /> প্রিমিয়াম ভ্রমণ গন্তব্যসমূহ
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            বাংলাদেশের সবচেয়ে সুন্দর <br className="hidden sm:block" />
            <span className="text-teal-600">পর্যটন স্থানগুলো ঘুরে দেখুন</span>
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            আপনার পছন্দের যেকোনো প্যাকেজ বেছে নিন। প্রতিটি ট্যুরেই আমরা দিচ্ছি সর্বোচ্চ নিরাপত্তা, আরামদায়ক হোটেল ও সার্বক্ষণিক গাইড সুবিধা।
          </p>
        </div>

        {/* Grid List */}
        {destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {destinations.map((item) => (
              <div
                key={item.id}
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

                  <div className="p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {item.badge ? (
                        <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
                          {item.badge}
                        </span>
                      ) : <span />}

                      {item.rating && (
                        <div className="flex items-center gap-1.5 text-amber-500 text-sm font-black">
                          <Star className="w-4 h-4 fill-amber-400" />
                          <span>{item.rating}</span>
                          {item.reviews > 0 && (
                            <span className="text-slate-400 text-xs font-medium">({item.reviews})</span>
                          )}
                        </div>
                      )}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-base text-slate-600 font-medium mt-1 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-teal-600 shrink-0" /> {item.subtitle}
                      </p>
                    )}

                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mt-6 border-t border-slate-100 pt-5 space-y-2.5">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                          প্যাকেজের প্রধান আকর্ষণ
                        </span>
                        <ul className="space-y-2 text-sm sm:text-base font-medium text-slate-700">
                          {item.highlights.slice(0, 3).map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <Check className="w-4 h-4 text-teal-600 shrink-0 mt-1 stroke-[3]" />
                              <span className="line-clamp-1">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-7 sm:p-8 pt-0">
                  <div className="flex items-center justify-between py-4 border-t border-slate-100 text-slate-600 mb-5">
                    <span className="flex items-center gap-2 text-base font-bold">
                      <Clock className="w-5 h-5 text-teal-600" /> {item.duration}
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
                    <span>প্যাকেজ বুক করুন</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200">
            <p className="text-slate-600 text-lg font-bold">
              কোনো ডেস্টিনেশন পাওয়া যায়নি। WordPress ড্যাশবোর্ড থেকে Destinations যোগ করুন।
            </p>
          </div>
        )}

      </div>
    </div>
  );
}