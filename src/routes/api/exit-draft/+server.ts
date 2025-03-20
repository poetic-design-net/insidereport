import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// This endpoint disables draft mode by removing the cookie
export const GET: RequestHandler = async ({ url, cookies }) => {
  // Remove the preview cookie
  cookies.delete('sanity-preview', { path: '/' });
  
  // Redirect back to the page the user was viewing, or to the home page
  const redirectTo = url.searchParams.get('redirect') || '/';
  throw redirect(307, redirectTo);
};
