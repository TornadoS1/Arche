// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';

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
  markdown: {
    // GFM footnotes are used as the source list of each page
    processor: satteri({
      features: {
        gfm: {
          footnotes: { label: 'Quellen', backLabel: 'Zurück zum Text (Quelle {reference})' },
        },
      },
    }),
  },
  integrations: [
    mdx(),
    sitemap(),
  ],
});
