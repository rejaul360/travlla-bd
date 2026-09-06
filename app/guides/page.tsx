import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, Calendar, ArrowRight, User, Compass } from "lucide-react";
import { getTravelGuides } from "@/lib/wordpress";

export const revalidate = 60;

export default async function GuidesPage() {
  const guides = await getTravelGuides();
  const featured = guides.length > 0 ? guides[0] : null;
  const restGuides = guides.slice(1);

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 sm:py-20 notranslate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-4 border border-teal-200/60">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" /> ভ্রমণের টিপস ও অভিজ্ঞতা
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            ভ্রমণ গাইড ও <span className="text-teal-600">জরুরি টিপস</span>
          </h1>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            কোন ঋতুতে কোথায় যাবেন, প্যাকিং কীভাবে করবেন এবং বাজেটের মধ্যে আরামদায়ক ভ্রমণের যাবতীয় সঠিক তথ্য জানুন।
          </p>
        </div>

        {/* Featured Top Editorial Story */}
        {featured && (
          <div className="mb-16 bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              <div className="lg:col-span-7 relative h-72 sm:h-96 w-full bg-slate-900 overflow-hidden">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                    <Compass className="w-16 h-16 text-slate-600" />
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
                      {featured.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-teal-600" /> {featured.readTime}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-snug mb-3">
                    {featured.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                    {featured.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{featured.date}</span>
                  </div>

                  <Link
                    href={`/guides/${featured.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 hover:gap-2 transition-all"
                  >
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Guides Grid */}
        {restGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {restGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-52 relative w-full bg-slate-900 overflow-hidden">
                    {guide.image ? (
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        unoptimized
                        className="object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                        <Compass className="w-12 h-12 text-slate-600" />
                      </div>
                    )}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                      {guide.category}
                    </span>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" /> {guide.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> {guide.readTime}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-950 tracking-tight leading-snug line-clamp-2 mb-2">
                      {guide.title}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {guide.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 sm:p-7 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {guide.author}
                    </span>

                    <Link
                      href={`/guides/${guide.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 hover:gap-1.5 transition-all"
                    >
                      <span>পড়ুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !featured && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold">
              বর্তমানে কোনো ভ্রমণ গাইড পাওয়া যায়নি। WordPress ড্যাশবোর্ড থেকে Posts যোগ করুন।
            </p>
          </div>
        )}

      </div>
    </div>
  );
}