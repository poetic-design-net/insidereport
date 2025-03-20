import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { timeoutPromise } from '$lib/utils';
import { fetchSanityData } from '$lib/sanity/client';
import { previewClient } from '$lib/server/sanity';

export const load: PageServerLoad = async ({ params, depends, locals }) => {
  // Add dependency to allow manual reloading
  depends('app:blogPost');
  
  // Get preview state from locals
  const { preview } = locals;
  
  const { slug } = params;
  
  if (!slug) {
    throw error(404, 'Post not found');
  }

  try {
    // Query for the post with the given slug
    const postQuery = `
      *[_type == "post" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        excerpt,
        mainImage,
        publishedAt,
        body,
        author->{
          name,
          image
        },
        categories[]->{
          _id,
          title
        },
        "relatedPosts": *[_type == "post" && slug.current != $slug && count(categories[@._ref in ^.^.categories[]._ref]) > 0] | order(publishedAt desc) [0...3] {
          _id,
          title,
          slug,
          excerpt,
          mainImage,
          publishedAt,
          author->{
            name,
            image
          }
        }
      }
    `;
    
    // Fetch post data with timeout using fetchSanityData with the previewClient when in preview mode
    const post = await timeoutPromise(
      fetchSanityData(postQuery, { slug }, preview, preview ? previewClient : null),
      15000 // 15 second timeout
    );
    
    if (!post) {
      throw error(404, 'Post not found');
    }

    return {
      post,
      status: 'success',
      preview
    };
  } catch (err) {
    console.error('Error loading blog post:', err);
    
    // Return error state that can be handled in the component
    return {
      post: null,
      status: 'error',
      error: err instanceof Error ? err.message : 'Error loading blog post',
      preview
    };
  }
};
