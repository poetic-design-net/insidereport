import { createClient } from '@sanity/client'
import {
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_STUDIO_URL,
} from "$env/static/public";
import type { SanityClient } from '@sanity/client';

// Create a standard client for published content
export const client = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-15',
  useCdn: true,
  stega: {
    enabled: true,
    studioUrl: PUBLIC_SANITY_STUDIO_URL,
  },
})

// Add a wrapper function with better error handling
export const fetchSanityData = async <T>(
  query: string, 
  params = {}, 
  usePreview = false,
  previewClient?: SanityClient | null
): Promise<T> => {
  try {
    // Use the provided preview client or fall back to the regular client
    const activeClient = usePreview && previewClient ? previewClient : client;
    const options = { stega: usePreview };
    return await activeClient.fetch<T>(query, params, options);
  } catch (error) {
    console.error('Sanity fetch error:', error);
    // Rethrow with more context
    throw new Error(`Failed to fetch data from Sanity: ${error instanceof Error ? error.message : String(error)}`);
  }
}
