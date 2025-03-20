import { SANITY_VIEWER_TOKEN } from '$env/static/private'
import { createClient } from '@sanity/client'
import {
  PUBLIC_SANITY_DATASET,
  PUBLIC_SANITY_PROJECT_ID,
  PUBLIC_SANITY_STUDIO_URL,
} from "$env/static/public";
import { client } from '$lib/sanity/client'

// Create a server client with the viewer token
export const serverClient = client.withConfig({
  token: SANITY_VIEWER_TOKEN,
  stega: {
    enabled: true,
    studioUrl: PUBLIC_SANITY_STUDIO_URL,
  },
})

// Create a preview client for draft content
export const previewClient = createClient({
  projectId: PUBLIC_SANITY_PROJECT_ID,
  dataset: PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-15',
  useCdn: false, // Always false for preview
  perspective: 'previewDrafts',
  token: SANITY_VIEWER_TOKEN,
  stega: {
    enabled: true,
    studioUrl: PUBLIC_SANITY_STUDIO_URL,
  },
})

// Get the appropriate client based on preview mode
export const getServerClient = (usePreview = false) => 
  usePreview ? previewClient : serverClient
