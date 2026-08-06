// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// This site is server-rendered, so the guard in src/lib/sanity.ts only runs when
// a page is requested. Checking here as well means a context that forgot to set
// its dataset fails the Netlify build instead of deploying and erroring later.
const isNetlifyBuild =
  process.env.NETLIFY === 'true' && process.env.NETLIFY_DEV !== 'true';

if (
  isNetlifyBuild &&
  !process.env.SANITY_DATASET &&
  !process.env.PUBLIC_SANITY_DATASET
) {
  throw new Error(
    'SANITY_DATASET is not set for this deploy context. Add it to the matching ' +
      '[context.*.environment] block in netlify.toml.'
  );
}

export default defineConfig({
  output: 'server',
  site: process.env.PUBLIC_SITE_URL || 'https://powerjet-uk.com',
  adapter: netlify(),
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});
