import {createClient} from '@sanity/client'
import createImageUrlBuilder from '@sanity/image-url'

// Get environment variables
const projectId = import.meta.env.PUBLIC_SANITY_STUDIO_PROJECT_ID
const dataset = import.meta.env.PUBLIC_SANITY_STUDIO_DATASET || 'production'
const apiVersion = import.meta.env.PUBLIC_SANITY_STUDIO_API_VERSION || '2026-01-31'

// Validate environment variables are set
if (!projectId) {
  throw new Error(
    'Missing SANITY_PROJECT_ID environment variable. Please add it to your .env file.'
  )
}

// Validate required environment variables
if (!projectId) {
  throw new Error('❌ Missing SANITY_PROJECT_ID environment variable');
}

if (!dataset) {
  throw new Error('❌ Missing SANITY_DATASET environment variable');
}

// Create Sanity client
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: dataset === 'production', // Only use CDN cache in production
  perspective: 'published', // 'published' or 'previewDrafts'
});

// Export configuration for debugging
export const sanityConfig = {
  projectId,
  dataset,
  useCdn: dataset === 'production',
  environment: import.meta.env.MODE,
};

// Development logging
if (import.meta.env.DEV) {
  console.group('📦 Sanity Configuration');
  console.log('Project ID:', projectId);
  console.log('Dataset:', dataset);
  console.log('API Version:', apiVersion);
  console.log('Using CDN:', dataset === 'production');
  console.log('Environment:', import.meta.env.MODE);
  console.groupEnd();
}

// Helper function to get dataset name (useful for debugging)
export function getCurrentDataset(): string {
  return dataset;
}

// Helper function to check if we're in production
export function isProduction(): boolean {
  return dataset === 'production';
}

// Helper function to check if we're in staging
export function isStaging(): boolean {
  return dataset === 'staging';
}


// Helper for generating image URLs
const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: any) {
  return builder.image(source)
}