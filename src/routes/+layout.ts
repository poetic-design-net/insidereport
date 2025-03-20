import { setPreviewing } from '@sanity/svelte-loader'
import type { LayoutLoad } from './$types'
import type { Image } from '@sanity/types';

// Define types for our data (duplicated from server)
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

// Client-side load function to handle preview state
export const load: LayoutLoad = ({ data }) => {
  // Set the preview state for the client
  setPreviewing(data.preview)
  
  // Pass through the data from the server
  return data;
};
