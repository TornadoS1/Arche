// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.archenoahmythos.de',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // GitHub Pages has no server-side redirects; Astro emits meta-refresh pages with rel=canonical
  redirects: {
    '/startseite': '/',
    '/ökologie': '/oekologie',
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
});
