import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    // Full <title> for search results; falls back to "title – site name"
    seoTitle: z.string().optional(),
    navTitle: z.string(),
    description: z.string(),
    order: z.number(),
    ogImage: z.string().optional(),
    toc: z.boolean().default(true),
    // 'article' pages get Article structured data, 'page' only breadcrumbs
    type: z.enum(['article', 'page']).default('article'),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { pages };
