import type { PageServerLoad } from './$types';
import type { Image } from '@sanity/types';
import { timeoutPromise } from '$lib/utils';
import { fetchSanityData } from '$lib/sanity/client';
import { previewClient } from '$lib/server/sanity';

// Define types for our data
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: Image;
  images?: Image[];  // Hinzugefügt für mehrere Bilder
  publishedAt?: string;
  author?: {
    name: string;
    image?: Image
  };
  categories?: Array<{
    _id: string;
    title: string
  }>;
  tags?: Array<{
    _id: string;
    title: string
  }>;
}

export interface Category {
  _id: string;
  title: string;
}

export interface PageData {
  posts: Post[];
  heroPosts: Post[];  // Neue Property für Posts mit hero-Tag
  featuredPost?: Post;
  categories: Category[];
  status: 'success' | 'error';
  error?: string;
  preview?: boolean;
}

export const load: PageServerLoad = async ({ depends, locals }) => {
  // Add dependency to allow manual reloading
  depends('app:blogData');
  
  // Get preview state from locals
  const { preview } = locals;
  console.log("Client in load function:", locals.client);
  console.log("Client config token:", locals.client.config().token);

  try {
    // Define queries
    const featuredPostQuery = `
      *[_type == "post" && count((tags[]->title)[@ in ["featured"]]) > 0][0] {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        images,
        publishedAt,
        author->{
          name,
          image
        },
        categories[]->{
          _id,
          title
        },
        tags[]->{
          _id,
          title
        }
      }
    `;

    // Neue Query für Posts mit dem Tag "hero"
    const heroPostsQuery = `
      *[_type == "post" && count((tags[]->title)[@ in ["hero"]]) > 0] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        images,
        publishedAt,
        author->{
          name,
          image
        },
        categories[]->{
          _id,
          title
        },
        tags[]->{
          _id,
          title
        }
      }
    `;

    const postsQuery = `
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        images,
        publishedAt,
        author->{
          name,
          image
        },
        categories[]->{
          _id,
          title
        },
        tags[]->{
          _id,
          title
        }
      }
    `;

    const categoriesQuery = `
      *[_type == "category"] {
        _id,
        title
      }
    `;

    // Use Promise.all to fetch posts and categories in parallel with timeout and improved error handling
    const postsPromise = timeoutPromise<Post[]>(
      fetchSanityData(postsQuery, {}, preview, preview ? previewClient : null),
      15000 // 15 second timeout
    );
    
    const categoriesPromise = timeoutPromise<Category[]>(
      fetchSanityData(categoriesQuery, {}, preview, preview ? previewClient : null),
      10000 // 10 second timeout
    );
    
    const featuredPostPromise = timeoutPromise<Post | null>(
      fetchSanityData(featuredPostQuery, {}, preview, preview ? previewClient : null),
      10000 // 10 second timeout
    );
    
    // Neue Promise für die Hero-Posts
    const heroPostsPromise = timeoutPromise<Post[]>(
      fetchSanityData(heroPostsQuery, {}, preview, preview ? previewClient : null),
      10000 // 10 second timeout
    );

    const [posts, categories, featuredPost, heroPosts] = await Promise.all([
      postsPromise,
      categoriesPromise,
      featuredPostPromise,
      heroPostsPromise
    ]);

    // Return data with loading state
    return {
      posts: posts.filter(post => !featuredPost || post._id !== featuredPost._id),
      heroPosts: heroPosts || [],  // Füge die Hero-Posts hinzu
      featuredPost: featuredPost || undefined,
      categories,
      status: 'success',
      preview
    } as PageData;
  } catch (err) {
    console.error('Error loading blog data:', err);
    // Instead of throwing an error, return error state that can be handled in the component
    return {
      posts: [],
      heroPosts: [],  // Leeres Array im Fehlerfall
      featuredPost: undefined,
      categories: [],
      status: 'error',
      error: err instanceof Error ? err.message : 'Error loading blog data',
      preview
    } as PageData;
  }
};