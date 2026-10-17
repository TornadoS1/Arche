// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// Set BASE_PATH=/Arche for the github.io preview; unset once the custom domain is live
const base = (process.env.BASE_PATH || '').replace(/\/$/, '');

export default defineConfig({
  site: 'https://www.archenoahmythos.de',
  base: base || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // GitHub Pages has no server-side redirects; Astro emits meta-refresh pages with rel=canonical
  redirects: {
    // Redirect targets are not prefixed with base automatically
    '/startseite': `${base}/`,
    '/ökologie': `${base}/oekologie/`,
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
});
