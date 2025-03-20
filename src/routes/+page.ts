import type { PageLoad } from './$types';
import type { Image } from '@sanity/types';

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
  categories: Category[];
  status: 'success' | 'error';
  error?: string;
  preview?: boolean;
}

// Client-side load function that just passes through the data from the server
export const load: PageLoad = async ({ data }) => {
  return data;
};
