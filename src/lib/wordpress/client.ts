import { BlogPost } from '@/types';
import { MOCK_BLOG_POSTS } from './mock-data';

interface WPPostItem {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  jetpack_featured_media_url?: string;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
    author?: Array<{ name: string }>;
    'wp:term'?: Array<Array<{ name: string }>>;
  };
}

function getApiEndpoint(url: string, path = '/posts'): string {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  if (cleanUrl.includes('.wordpress.com')) {
    const siteDomain = cleanUrl.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    return `https://public-api.wordpress.com/wp/v2/sites/${siteDomain}${path}`;
  }
  return `${cleanUrl}/wp-json/wp/v2${path}`;
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!wpApiUrl) {
    return MOCK_BLOG_POSTS;
  }

  try {
    const endpoint = `${getApiEndpoint(wpApiUrl, '/posts')}?_embed&per_page=10`;
    const res = await fetch(endpoint, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.warn('WordPress API returned status', res.status, 'fallback to mock data');
      return MOCK_BLOG_POSTS;
    }

    const data: WPPostItem[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return MOCK_BLOG_POSTS;
    }

    return data.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title?.rendered?.replace(/<[^>]+>/g, '') || '',
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      content: post.content?.rendered || '',
      date: new Date(post.date).toLocaleDateString('vi-VN'),
      author_name: post._embedded?.author?.[0]?.name || 'PharmaDi Chuyên Môn',
      featured_image:
        post.jetpack_featured_media_url ||
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000',
      category_name: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Tri thức Y Dược',
    }));
  } catch (error) {
    console.warn('Failed to fetch from WordPress API, using fallback data:', error);
    return MOCK_BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

  if (!wpApiUrl) {
    return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }

  try {
    const endpoint = `${getApiEndpoint(wpApiUrl, '/posts')}?slug=${slug}&_embed`;
    const res = await fetch(endpoint, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null;
    }

    const data: WPPostItem[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null;
    }

    const post = data[0];
    return {
      id: post.id,
      slug: post.slug,
      title: post.title?.rendered?.replace(/<[^>]+>/g, '') || '',
      excerpt: post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || '',
      content: post.content?.rendered || '',
      date: new Date(post.date).toLocaleDateString('vi-VN'),
      author_name: post._embedded?.author?.[0]?.name || 'PharmaDi Chuyên Môn',
      featured_image:
        post.jetpack_featured_media_url ||
        post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1000',
      category_name: post._embedded?.['wp:term']?.[0]?.[0]?.name || 'Tri thức Y Dược',
    };
  } catch (error) {
    return MOCK_BLOG_POSTS.find((p) => p.slug === slug) || null;
  }
}
