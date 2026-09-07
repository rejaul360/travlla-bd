export interface DestinationItem {
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

export interface TravelPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  category: string;
}

// ব্যাকআপ ডেটা (সার্ভার স্লো হলে যাতে ইউজার সাথে সাথে পেজ দেখতে পায়)
export const fallbackDestinations: DestinationItem[] = [
  {
    id: "1",
    title: "সেন্টমার্টিন প্রবাল দ্বীপ",
    subtitle: "নীল জলরাশি ও প্রবাল দ্বীপ",
    price: 8500,
    duration: "৩ দিন ২ রাত",
    rating: "4.9",
    reviews: 128,
    badge: "সীজন স্পেশাল",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    highlights: ["বিলাসবহুল জাহাজে সমুদ্র ভ্রমণ", "ছেঁড়াদ্বীপ ও প্রবাল পাথরে ট্র্যাকিং", "বিচ ভিউ রিসোর্টে রাত্রিযাপন"]
  },
  {
    id: "2",
    title: "সাজেক ভ্যালি",
    subtitle: "মেঘের উপত্যকা ও পাহাড়",
    price: 8500,
    duration: "৩ দিন ২ রাত",
    rating: "4.9",
    reviews: 150,
    badge: "সবচেয়ে জনপ্রিয়",
    image: "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80",
    highlights: ["রুইলুই পাড়া ভ্রমণ", "কংলাক পাহাড়ে মেঘ দর্শন", "সাজেক সানসেট ভিউ"]
  },
  {
    id: "3",
    title: "বান্দরবান",
    subtitle: "মেঘ, পাহাড় আর ঝর্ণা",
    price: 7200,
    duration: "৩ দিন ২ রাত",
    rating: "4.8",
    reviews: 95,
    badge: "অ্যাডভেঞ্চার",
    image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80",
    highlights: ["নীলগিরি ও নীলাচল", "বগালেক ক্যাম্পিং", "স্বর্ণ মন্দির"]
  }
];

export const fallbackPosts: TravelPost[] = [
  {
    id: 1,
    slug: "saint-martin-travel-guide",
    title: "সেন্টমার্টিন ভ্রমণের সেরা সময় ও ট্রাভেল গাইড",
    excerpt: "প্রবাল দ্বীপে যাওয়ার পরিকল্পনা করছেন? জাহাজ বুকিং থেকে শুরু করে রিসোর্ট পছন্দের বিস্তারিত নিয়মাবলি জেনে নিন...",
    content: "সেন্টমার্টিন ভ্রমণের বিস্তারিত গাইডলাইন...",
    date: "১ সেপ্টেম্বর ২০২৬",
    readTime: "৪ মিনিট পড়া",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    author: "ট্রাভলা টিম",
    category: "ভ্রমণ টিপস"
  }
];

// টাইমআউট হেল্পার (৪ সেকেন্ডের বেশি সময় লাগলে রিকোয়েস্ট আটকে না রেখে ব্যাকআপ ডেটা লোড করবে)
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

// 1. Fetch all destinations
export async function getDestinations(): Promise<DestinationItem[]> {
  try {
    const res = await fetchWithTimeout("https://ams.wpelitee.com/wp-json/travlla/v1/destinations", {
      next: { revalidate: 120 }, // ২ মিনিট ক্যাশ
    }, 4500);

    if (!res.ok) throw new Error("Destination fetch failed");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackDestinations;
  } catch (err) {
    console.warn("WordPress destinations delayed/failed, using fallback data.");
    return fallbackDestinations;
  }
}

// 2. Fetch all travel guide posts (অপ্টিমাইজড ফিল্ডস)
export async function getTravelGuides(): Promise<TravelPost[]> {
  try {
    // শুধুমাত্র প্রয়োজনীয় ফিল্ড ফেচ করা হচ্ছে (_fields যোগ করায় সাইজ ৯০% কমে দ্রুত লোড হয়)
    const url = "https://ams.wpelitee.com/wp-json/wp/v2/posts?_embed=author,wp:term,wp:featuredmedia&per_page=9&_fields=id,slug,title,excerpt,content,date,_links,_embedded";
    
    const res = await fetchWithTimeout(url, {
      next: { revalidate: 180 }, // ৩ মিনিট ক্যাশ
    }, 4500);

    if (!res.ok) throw new Error("Posts fetch failed");
    const posts = await res.json();

    if (!Array.isArray(posts) || posts.length === 0) return fallbackPosts;

    return posts.map((p: any) => {
      let featuredMedia = "";
      if (p._embedded?.["wp:featuredmedia"]?.[0]) {
        const media = p._embedded["wp:featuredmedia"][0];
        featuredMedia = media.source_url || media.media_details?.sizes?.medium_large?.source_url || "";
      }

      const authorName = p._embedded?.author?.[0]?.name || "ট্রাভলা টিম";
      const categoryName = p._embedded?.["wp:term"]?.[0]?.[0]?.name || "ভ্রমণ গাইড";
      const words = p.content?.rendered ? p.content.rendered.replace(/<[^>]+>/g, "").split(/\s+/).length : 0;
      const readTime = `${Math.max(2, Math.ceil(words / 180))} মিনিট পড়া`;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title?.rendered || "",
        excerpt: p.excerpt?.rendered ? p.excerpt.rendered.replace(/<[^>]+>/g, "").trim() : "",
        content: p.content?.rendered || "",
        date: new Date(p.date).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }),
        readTime,
        image: featuredMedia || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        author: authorName,
        category: categoryName,
      };
    });
  } catch (err) {
    console.warn("WordPress posts delayed/failed, using fallback data.");
    return fallbackPosts;
  }
}

export const getAllPosts = getTravelGuides;

// 3. Fetch single blog post by slug
export async function getSingleGuide(slug: string): Promise<TravelPost | null> {
  try {
    const res = await fetchWithTimeout(
      `https://ams.wpelitee.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=author,wp:term,wp:featuredmedia`,
      { next: { revalidate: 180 } },
      4500
    );

    if (!res.ok) return null;
    const posts = await res.json();
    if (!posts || posts.length === 0) return null;

    const p = posts[0];
    let featuredMedia = "";
    if (p._embedded?.["wp:featuredmedia"]?.[0]) {
      const media = p._embedded["wp:featuredmedia"][0];
      featuredMedia = media.source_url || media.media_details?.sizes?.large?.source_url || "";
    }

    const authorName = p._embedded?.author?.[0]?.name || "ট্রাভলা টিম";
    const categoryName = p._embedded?.["wp:term"]?.[0]?.[0]?.name || "ভ্রমণ গাইড";
    const words = p.content?.rendered ? p.content.rendered.replace(/<[^>]+>/g, "").split(/\s+/).length : 0;
    const readTime = `${Math.max(2, Math.ceil(words / 180))} মিনিট পড়া`;

    return {
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered || "",
      excerpt: p.excerpt?.rendered ? p.excerpt.rendered.replace(/<[^>]+>/g, "").trim() : "",
      content: p.content?.rendered || "",
      date: new Date(p.date).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }),
      readTime,
      image: featuredMedia,
      author: authorName,
      category: categoryName,
    };
  } catch (err) {
    console.error("Error fetching single guide:", err);
    return null;
  }
}

export const getPostBySlug = getSingleGuide;