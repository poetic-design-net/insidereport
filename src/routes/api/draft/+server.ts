import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_SANITY_PREVIEW_SECRET } from '$env/static/public';

// This endpoint enables draft mode by setting a cookie
export const GET: RequestHandler = async ({ url, cookies }) => {
  // Validate the request
  const slug = url.searchParams.get('slug');
  const secret = url.searchParams.get('secret');
  const documentId = url.searchParams.get('id');
  const type = url.searchParams.get('type');
  
  // For debugging
  console.log('Draft mode request:', { slug, secret, documentId, type });
  console.log('Expected secret:', PUBLIC_SANITY_PREVIEW_SECRET);
  
  // Check the secret to prevent unauthorized access
  if (!secret) {
    throw error(401, 'No preview secret provided');
  }
  
  // More detailed logging for debugging
  console.log('Secret comparison:', { 
    received: secret, 
    expected: PUBLIC_SANITY_PREVIEW_SECRET,
    match: secret === PUBLIC_SANITY_PREVIEW_SECRET 
  });
  
  if (secret !== PUBLIC_SANITY_PREVIEW_SECRET) {
    throw error(401, `Invalid preview secret: ${secret}`);
  }

  // Enable draft mode by setting a cookie
  cookies.set('sanity-preview', 'true', {
    path: '/',
    httpOnly: false, // Allow JavaScript access
    maxAge: 60 * 60, // 1 hour
    sameSite: 'lax'
  });

  console.log('Preview mode enabled, redirecting...');

  // Redirect based on document type and slug
  if (type === 'post' && slug) {
    throw redirect(307, `/blog/${slug}`);
  } else if (slug) {
    throw redirect(307, `/blog/${slug}`);
  } else {
    throw redirect(307, '/');
  }
};
