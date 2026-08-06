// src/lib/sanity.ts
import { createClient } from '@sanity/client';

// Connection details come from the deploy context (see netlify.toml).
// A missing value is a misconfiguration, not something to guess at: a silent
// fallback would serve another dataset's content with no visible error, so we
// fail instead. Local dev keeps a default so `npm run dev` works without a .env.
const projectId =
  import.meta.env.SANITY_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  (import.meta.env.DEV ? '84258b3v' : undefined);

const dataset =
  import.meta.env.SANITY_DATASET ||
  import.meta.env.PUBLIC_SANITY_DATASET ||
  (import.meta.env.DEV ? 'staging' : undefined);

// Not environment-specific: a pinned API date is a real default, not a guess.
const apiVersion =
  import.meta.env.SANITY_API_VERSION ||
  import.meta.env.PUBLIC_SANITY_API_VERSION ||
  '2024-01-01';

if (!projectId || !dataset) {
  throw new Error(
    `Sanity is not configured (projectId: ${projectId ? 'set' : 'missing'}, ` +
      `dataset: ${dataset ? 'set' : 'missing'}). Set SANITY_PROJECT_ID and ` +
      'SANITY_DATASET for this deploy context in netlify.toml.'
  );
}

const token = import.meta.env.SANITY_TOKEN;

// Create Sanity client
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: dataset === 'production',
  token,
});
