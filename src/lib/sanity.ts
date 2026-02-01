// src/lib/sanity.ts
import { createClient } from '@sanity/client';

// Get environment variables with multiple fallback checks
const projectId = 
  import.meta.env.SANITY_PROJECT_ID || 
  import.meta.env.PUBLIC_SANITY_PROJECT_ID || 
  '84258b3v'; // Hard-coded fallback

const dataset = 
  import.meta.env.SANITY_DATASET || 
  import.meta.env.PUBLIC_SANITY_DATASET || 
  'staging'; // Hard-coded fallback

const apiVersion = 
  import.meta.env.SANITY_API_VERSION || 
  import.meta.env.PUBLIC_SANITY_API_VERSION || 
  '2024-01-01'; // Hard-coded fallback

const token = import.meta.env.SANITY_TOKEN;

// Log for debugging (will show in build logs)
console.log('🔍 Sanity Config Check:');
console.log('  Project ID:', projectId);
console.log('  Dataset:', dataset);
console.log('  API Version:', apiVersion);

// Create Sanity client
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: dataset === 'production',
  token,
});

// Export configuration
export const sanityConfig = {
  projectId,
  dataset,
  apiVersion,
  useCdn: dataset === 'production',
  environment: import.meta.env.MODE || 'development',
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

export function getCurrentDataset(): string {
  return dataset;
}

export function isProduction(): boolean {
  return dataset === 'production';
}

export function isStaging(): boolean {
  return dataset === 'staging';
}