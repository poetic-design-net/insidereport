import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {media} from 'sanity-plugin-media'
import {codeInput} from '@sanity/code-input'
import {table} from '@sanity/table'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
import {presentationTool} from 'sanity/presentation'
import {createClient} from '@sanity/client'

// Get the token from the environment variable
const token = process.env.SANITY_STUDIO_PREVIEW_TOKEN;

// Create a client for fetching data in the locate function
const client = createClient({
  projectId: 'orxpe38r',
  dataset: 'production',
  apiVersion: '2024-03-15',
  useCdn: false,
  token: token, // Add the token for accessing draft content
  perspective: 'previewDrafts', // Use the preview perspective
})

export default defineConfig({
  name: 'default',
  title: 'inside-report',

  projectId: 'orxpe38r',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    media(),
    codeInput(),
    table(),
    unsplashImageAsset(),
    presentationTool({
      previewUrl: {
        // Use VERCEL_URL in production, fallback to localhost for development
        origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173',
        preview: '/',
        previewMode: {
          enable: '/api/draft?secret=inside-report-preview-secret',
          disable: '/api/exit-draft',
        },
      },
      
      // Define a custom locate function
      locate: (document) => {
        // For debugging
        console.log('Locate function called with document:', document);
        console.log('Using token:', token ? 'Yes' : 'No');
        
        // Only handle post documents
        if (document.type === 'post') {
          // Get the document ID
          const documentId = document.id;
          
          if (!documentId) {
            console.error('No document ID found');
            return null;
          }
          
          // Handle draft IDs (they start with "drafts.")
          const publishedId = documentId.replace(/^drafts\./, '');
          
          // Return an observable that fetches the slug
          return {
            locations: [
              {
                title: 'Loading...',
                href: '/',
              },
            ],
            params: {
              id: documentId,
              type: document.type,
            },
            async fetch() {
              try {
                // Fetch the slug from both the draft and published document
                const query = `*[_id in [$draftId, $publishedId]][0].slug.current`;
                console.log('Fetching with query:', query, 'and IDs:', { draftId: documentId, publishedId });
                
                const slug = await client.fetch(query, { 
                  draftId: documentId,
                  publishedId: publishedId
                });
                
                console.log('Post document slug:', slug);
                
                if (slug) {
                  return {
                    locations: [
                      {
                        title: 'Web Preview',
                        href: `/blog/${slug}`,
                      },
                    ],
                    params: {
                      slug,
                      id: documentId,
                      type: document.type,
                    },
                  }
                }
                
                // If no slug found, try a different approach
                console.log('No slug found with first query, trying direct approach');
                
                // Try to fetch the document directly and extract the slug
                const doc = await client.fetch(
                  `*[_id == $id][0]`,
                  { id: documentId }
                );
                
                console.log('Fetched document:', doc);
                
                if (doc && doc.slug && doc.slug.current) {
                  const docSlug = doc.slug.current;
                  console.log('Found slug in document:', docSlug);
                  
                  return {
                    locations: [
                      {
                        title: 'Web Preview',
                        href: `/blog/${docSlug}`,
                      },
                    ],
                    params: {
                      slug: docSlug,
                      id: documentId,
                      type: document.type,
                    },
                  }
                }
                
                return {
                  locations: [
                    {
                      title: 'No slug found',
                      href: '/',
                    },
                  ],
                  params: {
                    id: documentId,
                    type: document.type,
                  },
                }
              } catch (error) {
                console.error('Error fetching slug:', error);
                return {
                  locations: [
                    {
                      title: 'Error',
                      href: '/',
                    },
                  ],
                  params: {
                    id: documentId,
                    type: document.type,
                  },
                }
              }
            },
          }
        }
        
        // Default to home page for other document types
        return {
          locations: [
            {
              title: 'Web Preview',
              href: '/',
            },
          ],
          params: {
            id: document.id,
            type: document.type,
          },
        }
      },
      
      // Add title for the Presentation tool
      title: 'Preview',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
