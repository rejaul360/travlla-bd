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

// 1. Fetch all destinations from custom endpoint
export async function getDestinations(): Promise<DestinationItem[]> {
  try {
    const res = await fetch("https://ams.wpelitee.com/wp-json/travlla/v1/destinations", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    console.error("Error fetching destinations:", err);
    return [];
  }
}

// 2. Fetch all blog / travel guide posts with proper _embed featured media resolution
export async function getTravelGuides(): Promise<TravelPost[]> {
  try {
    const res = await fetch("https://ams.wpelitee.com/wp-json/wp/v2/posts?_embed=1&per_page=12", {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const posts = await res.json();

    return posts.map((p: any) => {
      // Safe extraction of WordPress Featured Image from _embedded
      let featuredMedia = "";
      if (p._embedded && p._embedded["wp:featuredmedia"] && p._embedded["wp:featuredmedia"][0]) {
        const mediaObj = p._embedded["wp:featuredmedia"][0];
        featuredMedia = 
          mediaObj.source_url || 
          mediaObj.media_details?.sizes?.full?.source_url || 
          mediaObj.media_details?.sizes?.large?.source_url || 
          "";
      }

      const authorName = p._embedded?.author?.[0]?.name || 'ট্রাভলা টিম';
      const categoryName = p._embedded?.['wp:term']?.[0]?.[0]?.name || 'ভ্রমণ গাইড';

      const words = p.content?.rendered ? p.content.rendered.replace(/<[^>]+>/g, '').split(/\s+/).length : 0;
      const readTime = `${Math.max(2, Math.ceil(words / 180))} মিনিট পড়া`;

      return {
        id: p.id,
        slug: p.slug,
        title: p.title?.rendered || '',
        excerpt: p.excerpt?.rendered ? p.excerpt.rendered.replace(/<[^>]+>/g, '').trim() : '',
        content: p.content?.rendered || '',
        date: new Date(p.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
        readTime,
        image: featuredMedia,
        author: authorName,
        category: categoryName,
      };
    });
  } catch (err) {
    console.error("Error fetching travel guides:", err);
    return [];
  }
}

// 3. Alias for blog page
export const getAllPosts = getTravelGuides;

// 4. Fetch single blog post by slug with _embed
export async function getSingleGuide(slug: string): Promise<TravelPost | null> {
  try {
    const res = await fetch(`https://ams.wpelitee.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const posts = await res.json();
    if (!posts || posts.length === 0) return null;

    const p = posts[0];
    let featuredMedia = "";
    if (p._embedded && p._embedded["wp:featuredmedia"] && p._embedded["wp:featuredmedia"][0]) {
      const mediaObj = p._embedded["wp:featuredmedia"][0];
      featuredMedia = 
        mediaObj.source_url || 
        mediaObj.media_details?.sizes?.full?.source_url || 
        mediaObj.media_details?.sizes?.large?.source_url || 
        "";
    }

    const authorName = p._embedded?.author?.[0]?.name || 'ট্রাভলা টিম';
    const categoryName = p._embedded?.['wp:term']?.[0]?.[0]?.name || 'ভ্রমণ গাইড';

    const words = p.content?.rendered ? p.content.rendered.replace(/<[^>]+>/g, '').split(/\s+/).length : 0;
    const readTime = `${Math.max(2, Math.ceil(words / 180))} মিনিট পড়া`;

    return {
      id: p.id,
      slug: p.slug,
      title: p.title?.rendered || '',
      excerpt: p.excerpt?.rendered ? p.excerpt.rendered.replace(/<[^>]+>/g, '').trim() : '',
      content: p.content?.rendered || '',
      date: new Date(p.date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
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

// 5. Alias for single post
export const getPostBySlug = getSingleGuide;