import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight, Compass } from "lucide-react";

interface BlogPostProps {
  post: {
    id: number;
    slug: string;
    title: string | { rendered: string };
    excerpt?: string | { rendered: string };
    date?: string;
    readTime?: string;
    image?: string;
    author?: string;
    category?: string;
  };
}

export default function BlogCard({ post }: BlogPostProps) {
  // টাইটেল ও এক্সার্প্ট যদি অবজেক্ট বা স্ট্রিং যেকোনো ফরম্যাটেই আসুক, সেফলি হ্যান্ডেল করা
  const titleText = typeof post.title === "object" ? post.title.rendered : post.title;
  const rawExcerpt = typeof post.excerpt === "object" ? post.excerpt.rendered : (post.excerpt || "");
  const cleanExcerpt = rawExcerpt.replace(/<[^>]+>/g, "").trim();

  return (
    <article className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Featured Image */}
        <div className="h-52 relative w-full bg-slate-900 overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={titleText || "Blog image"}
              fill
              unoptimized
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
              <Compass className="w-12 h-12 text-slate-600" />
            </div>
          )}
          {post.category && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md text-white text-xs font-bold border border-white/10">
              {post.category}
            </span>
          )}
        </div>

        {/* Content Details */}
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-3 font-medium">
            {post.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-teal-600" /> {post.date}
              </span>
            )}
            {post.readTime && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" /> {post.readTime}
                </span>
              </>
            )}
          </div>

          <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2 leading-snug mb-2">
            <Link href={`/blog/${post.slug}`}>
              {titleText}
            </Link>
          </h3>

          {cleanExcerpt && (
            <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
              {cleanExcerpt}
            </p>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 sm:p-7 pt-0">
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" /> {post.author || "ট্রাভলা টিম"}
          </span>

          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 hover:gap-1.5 transition-all"
          >
            <span>পড়ুন</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}