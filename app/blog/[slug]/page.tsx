import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, Clock, ArrowLeft, User, Share2, 
  Sparkles, CheckCircle2, Bookmark, MessageSquare 
} from "lucide-react";

export const revalidate = 0; // ক্যাশিং এড়িয়ে লাইভ ওয়ার্ডপ্রেস ডাটা পাওয়ার জন্য

interface WPPostDetail {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  date: string;
  featured_image_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          full?: { source_url?: string };
          large?: { source_url?: string };
        };
      };
    }>;
    author?: Array<{ name: string; avatar_urls?: Record<string, string>; description?: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
}

async function getPostBySlug(slug: string): Promise<WPPostDetail | null> {
  try {
    const res = await fetch(
      `https://ams.wpelitee.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    if (!Array.isArray(posts) || posts.length === 0) return null;
    return posts[0];
  } catch (error) {
    console.error("Error fetching single post:", error);
    return null;
  }
}

export default async function SinglePostPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Safe Image Extraction (যেভাবে BlogCard-এ সাকসেসফুলি এসেছে)
  const imageUrl =
    post.featured_image_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.full?.source_url ||
    post._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.sizes?.large?.source_url ||
    "";

  const titleText = post.title?.rendered || "";
  const contentHtml = post.content?.rendered || "";
  const authorName = post._embedded?.author?.[0]?.name || "ট্রাভলা টিম";
  const categoryName = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "ভ্রমণ গাইড";
  const formattedDate = new Date(post.date).toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#fafbfc] py-10 sm:py-16 notranslate text-slate-900">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-bold text-slate-700 hover:text-teal-700 hover:border-teal-200 transition shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>সব ব্লগে ফিরে যান</span>
          </Link>

          <span className="px-3.5 py-1.5 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200/60">
            {categoryName}
          </span>
        </div>

        {/* Post Title & Metadata */}
        <header className="mb-10 text-center sm:text-left">
          <h1 
            className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-[1.2] mb-6"
            dangerouslySetInnerHTML={{ __html: titleText }}
          />

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 py-4 border-y border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-black">
                {authorName.charAt(0)}
              </div>
              <span>{authorName}</span>
            </div>

            <span className="text-slate-300">•</span>

            <span className="flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-teal-600" />
              {formattedDate}
            </span>

            <span className="text-slate-300">•</span>

            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-teal-600" />
              ২ মিনিট পড়া
            </span>
          </div>
        </header>

        {/* 100% VISIBLE FULL FEATURED IMAGE */}
        {imageUrl ? (
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-slate-900 mb-12 shadow-xl border border-slate-200/80">
            <Image
              src={imageUrl}
              alt={titleText || "Featured Image"}
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </div>
        ) : null}

        {/* POST CONTENT (BELOW FEATURED IMAGE) */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-200/80 shadow-sm mb-16">
          <div
            className="prose prose-slate prose-lg max-w-none 
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
              prose-headings:font-black prose-headings:text-slate-950 prose-headings:tracking-tight
              prose-a:text-teal-600 prose-a:font-bold hover:prose-a:text-teal-700
              prose-img:rounded-3xl prose-img:shadow-md prose-img:my-8
              prose-strong:text-slate-900 prose-strong:font-bold"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Social Share & Interaction Footer */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              পোস্টটি ভালো লাগলে বন্ধুদের সাথে শেয়ার করুন
            </span>

            <div className="flex items-center gap-2">
              <button 
                type="button" 
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition"
              >
                <Share2 className="w-3.5 h-3.5" /> শেয়ার
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM CTA: TOUR BOOKING PROMPT */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-3 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" /> সহজ বুকিং সুবিধা
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              আপনার পরবর্তী ভ্রমণের প্রস্তুতি নিচ্ছেন?
            </h3>
            <p className="mt-2 text-sm text-slate-300 max-w-xl">
              সাজেক, কক্সবাজার কিংবা টাঙ্গুয়ার হাওড়—আমাদের প্রিমিয়াম প্যাকেজে রয়েছে নিরাপদ রিসোর্ট স্টে এবং সার্বক্ষণিক সাপোর্ট।
            </p>
          </div>

          <Link
            href="/destinations"
            className="relative z-10 py-4 px-8 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm whitespace-nowrap transition active:scale-95 shadow-lg"
          >
            সব ট্যুর প্যাকেজ দেখুন
          </Link>
        </div>

      </article>
    </div>
  );
}