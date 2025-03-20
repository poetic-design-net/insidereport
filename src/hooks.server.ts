import { createRequestHandler, setServerClient } from '@sanity/svelte-loader'
import { serverClient, previewClient } from '$lib/server/sanity'
import type { Handle } from '@sveltejs/kit'

// Set the server client for the loader
setServerClient(serverClient)

// Create a request handler that handles preview mode and sets up loadQuery
const sanityHandler = createRequestHandler()

// Custom handle function to add preview mode to locals
export const handle: Handle = async ({ event, resolve }) => {
  // Check if preview mode is enabled
  const preview = event.cookies.get('sanity-preview') === 'true'
  
  // Add preview flag to locals
  event.locals.preview = preview
  
  // Log preview mode status
  console.log('Preview mode:', preview ? 'enabled' : 'disabled')
  
  // If in preview mode, set the preview client
  if (preview) {
    setServerClient(previewClient)
  }
  
  // Pass to Sanity handler
  return sanityHandler({ event, resolve })
}
