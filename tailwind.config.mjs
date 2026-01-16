// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            p: {
              marginTop: '1.5em',    // Increase top margin
              marginBottom: '1.5em', // Increase bottom margin
            },
          },
        },
        lg: {
          css: {
            p: {
              marginTop: '2em',      // Even more space for prose-lg
              marginBottom: '2em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}