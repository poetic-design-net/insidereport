import type { LayoutServerLoad } from './$types';
import type { Image } from '@sanity/types';
import { fetchSanityData } from '$lib/sanity/client';
import { timeoutPromise } from '$lib/utils';
import { previewClient } from '$lib/server/sanity';

// Define types for our data
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: Image;
  publishedAt?: string;
  author?: { 
    name: string; 
    image?: Image 
  };
  categories?: Array<{ 
    _id: string; 
    title: string 
  }>;
}

export interface Category {
  _id: string;
  title: string;
}

export interface LayoutData {
  categories: Category[];
  posts: Post[];
  preview: boolean;
}

// Use the server-side load function to access preview state
export const load: LayoutServerLoad = async ({ locals, depends }) => {
  // Add dependency to allow manual reloading
  depends('app:layoutData');
  
  // Get preview state from locals (set by createRequestHandler)
  const { preview } = locals;
  
  try {
    // Define queries
    const categoriesQuery = `
      *[_type == "category"] {
        _id,
        title
      }
    `;
    
    const recentPostsQuery = `
      *[_type == "post"] | order(publishedAt desc)[0...6] {
        _id,
        title,
        slug,
        mainImage,
        publishedAt,
        categories[]->{
          _id,
          title
        }
      }
    `;

    // Fetch categories and recent posts in parallel using fetchSanityData
    const [categories, posts] = await Promise.all([
      timeoutPromise(
        fetchSanityData<Category[]>(categoriesQuery, {}, preview, preview ? previewClient : null),
        10000 // 10 second timeout
      ),
      timeoutPromise(
        fetchSanityData<Post[]>(recentPostsQuery, {}, preview, preview ? previewClient : null),
        15000 // 15 second timeout
      )
    ]);

    return {
      categories,
      posts,
      preview
    };
  } catch (err) {
    console.error('Error loading layout data:', err);
    
    // Return empty data on error
    return {
      categories: [],
      posts: [],
      preview
    };
  }
};
