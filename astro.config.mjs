// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  site: process.env.PUBLIC_SITE_URL || 'https://powerjet-uk.com',
  adapter: netlify(),
  integrations: [],
  vite: {
    plugins: [tailwindcss()],
  },
});