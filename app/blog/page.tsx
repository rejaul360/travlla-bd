import BlogCard from "@/app/components/BlogCard";
import { Sparkles } from "lucide-react";

// পেজটি ব্যাকগ্রাউন্ডে ৬০ সেকেন্ড ক্যাশ থাকবে (ইউজার ইনস্ট্যান্ট ০.১ সেকেন্ডে পেজ পাবে)
export const revalidate = 60;

interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  featured_image_url?: string;
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          large?: { source_url?: string };
          full?: { source_url?: string };
        };
      };
    }>;
    author?: Array<{ name: string }>;
    "wp:term"?: Array<Array<{ name: string }>>;
  };
}

async function getPosts() {
  try {
    // শুধুমাত্র লাইভ ওয়ার্ডপ্রেস থেকে আসল পোস্ট টানবে (কোনো ডামি স্লাগ ছাড়া)
    const res = await fetch(
      "https://ams.wpelitee.com/wp-json/wp/v2/posts?_embed=author,wp:term,wp:featuredmedia&per_page=12",
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];
    const posts: WPPost[] = await res.json();

    if (!Array.isArray(posts)) return [];

    return posts.map((post) => {
      const media = post._embedded?.["wp:featuredmedia"]?.[0];
      const image =
        post.featured_image_url ||
        media?.source_url ||
        media?.media_details?.sizes?.large?.source_url ||
        media?.media_details?.sizes?.full?.source_url ||
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80";

      const author = post._embedded?.author?.[0]?.name || "ট্রাভলা টিম";
      const category = post._embedded?.["wp:term"]?.[0]?.[0]?.name || "ভ্রমণ গাইড";

      return {
        id: post.id,
        slug: post.slug, // ওয়ার্ডপ্রেসের ১০০% আসল স্লাগ
        title: post.title.rendered,
        excerpt: post.excerpt.rendered.replace(/<[^>]+>/g, "").trim(),
        date: new Date(post.date).toLocaleDateString("bn-BD", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        readTime: "২ মিনিট পড়া",
        image: image,
        author: author,
        category: category,
      };
    });
  } catch (error) {
    console.error("Error fetching live posts:", error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#fafbfc] py-12 sm:py-20 notranslate">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold mb-4 border border-teal-200/60">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" /> সেরা ভ্রমণ অভিজ্ঞতা
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            ঘুরে দেখার গল্প ও <span className="text-teal-600">ভ্রমণ গাইড</span>
          </h1>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            সাজেক, কক্সবাজার, শ্রীমঙ্গল কিংবা বান্দরবান — সঠিক ভ্রমণ পরিকল্পনা, বাজেট ও প্রয়োজনীয় তথ্যের নির্ভরযোগ্য সংগ্রহশালা।
          </p>
        </div>

        {/* Blog Post Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 text-sm font-semibold">কোনো ব্লগ পোস্ট পাওয়া যায়নি।</p>
          </div>
        )}

      </div>
    </div>
  );
}