import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, User, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { getTravelGuides, fallbackPosts, TravelPost } from "@/lib/wordpress";

// Next.js ISR: পেজটি ব্যাকগ্রাউন্ডে ১২০ সেকেন্ড পর পর ক্যাশ আপডেট করবে, ভিজিটর সবসময় ০ সেকেন্ডে পেজ পাবে
export const revalidate = 120;

export default async function BlogPage() {
  // ক্যাশড ডেটা ফেচ (ওয়ার্ডপ্রেস দেরি করলে ফলব্যাক ডেটা দিয়ে সাথে সাথে পেজ রেন্ডার করবে)
  const posts: TravelPost[] = await getTravelGuides();
  const displayPosts = posts && posts.length > 0 ? posts : fallbackPosts;

  const featuredPost = displayPosts[0];
  const gridPosts = displayPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 sm:py-20 text-slate-900 notranslate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100 text-teal-900 text-xs sm:text-sm font-bold mb-4 border border-teal-200/80">
            <BookOpen className="w-4 h-4 text-teal-700" /> ভ্রমণ অভিজ্ঞতা ও গাইডলাইন
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tight leading-tight">
            ট্রাভলা <span className="text-teal-600">ভ্রমণ গাইড</span>
          </h1>
          <p className="mt-4 text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            বাংলাদেশের আনাচে-কানাচে ভ্রমণের বিস্তারিত তথ্য, সেরা রুট প্ল্যান, খরচ ও প্রয়োজনীয় ভ্রমণ টিপস।
          </p>
        </div>

        {/* Featured Post (First Post) */}
        {featuredPost && (
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100">
                <Image
                  src={featuredPost.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80"}
                  alt={featuredPost.title}
                  fill
                  priority
                  unoptimized
                  className="object-cover"
                />
                <span className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-md">
                  ফিচার্ড গাইড
                </span>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
                    {featuredPost.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-teal-600" /> {featuredPost.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-snug hover:text-teal-600 transition">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span>{featuredPost.date}</span>
                  </div>

                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-black text-teal-600 hover:text-teal-700 group"
                  >
                    <span>পড়ুন</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={post.image || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80"}
                      alt={post.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-lg">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-[11px] font-bold text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-teal-600" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-slate-950 leading-snug line-clamp-2 group-hover:text-teal-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100/80 mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" /> {post.author}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-teal-600 hover:text-teal-700 group"
                  >
                    <span>বিস্তারিত</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}