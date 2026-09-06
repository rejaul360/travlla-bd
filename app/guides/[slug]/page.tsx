import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, User, Compass, Share2 } from "lucide-react";
import { getSingleGuide, getTravelGuides } from "@/lib/wordpress";

export const revalidate = 60;

export async function generateStaticParams() {
  const guides = await getTravelGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export default async function SingleGuidePage({ params }: { params: { slug: string } }) {
  const guide = await getSingleGuide(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 sm:py-20 notranslate">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 mb-8 hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" /> সব ভ্রমণ গাইডে ফিরে যান
        </Link>

        {/* Header Metadata */}
        <div className="space-y-4 mb-8">
          <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
            {guide.category}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            {guide.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-2 border-b border-slate-200/80 pb-6">
            <span className="flex items-center gap-1.5 font-semibold text-slate-800">
              <User className="w-4 h-4 text-teal-600" /> {guide.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> {guide.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> {guide.readTime}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        {guide.image && (
          <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-slate-900 mb-12 shadow-sm border border-slate-200">
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              priority
              unoptimized
              className="object-cover"
            />
          </div>
        )}

        {/* WordPress Article HTML Content */}
        <div 
          className="prose prose-slate max-w-none prose-lg leading-relaxed text-slate-800 
            prose-headings:font-black prose-headings:text-slate-950 prose-headings:tracking-tight 
            prose-a:text-teal-600 prose-a:font-bold hover:prose-a:text-teal-700 
            prose-img:rounded-3xl prose-img:shadow-sm"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />

        {/* Bottom Booking CTA Card */}
        <div className="mt-16 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block mb-1">
              ভ্রমণের প্রস্তুতি নিচ্ছেন?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              আমাদের সাথে পছন্দের ট্যুর প্ল্যান করুন
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              নিরাপদ রিসোর্ট বুকিং, আরামদায়ক ভ্রমণ ও লোকাল গাইড সহায়তা।
            </p>
          </div>

          <Link
            href="/destinations"
            className="py-3 px-6 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs whitespace-nowrap transition active:scale-95 shadow-md"
          >
            প্যাকেজগুলো দেখুন
          </Link>
        </div>

      </article>
    </div>
  );
}