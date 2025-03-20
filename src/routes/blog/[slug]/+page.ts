import type { PageLoad } from './$types';
import type { Image } from '@sanity/types';
import type { Post } from '../../+page';

// Define types for blog post detail page
export interface BlogPost extends Post {
  body: any[];
  relatedPosts?: Post[];
}

export interface BlogPageData {
  post: BlogPost | null;
  status: 'success' | 'error';
  error?: string;
  preview?: boolean;
  query?: string;
  params?: Record<string, any>;
}

// Client-side load function to pass data from server
export const load: PageLoad = async ({ data }) => {
  // Simply pass through the data from the server
  return data;
};
