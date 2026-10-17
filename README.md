# archenoahmythos.de

Static rebuild of www.archenoahmythos.de with [Astro](https://astro.build), deployed to GitHub Pages.

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # output in dist/
```

- Content: `src/content/pages/*.mdx` (one file per page, slug = file name)
- Components for the page pattern: `SintflutCheck`, `Ergebnis`, `Fazit`, `Figure`, `FurtherLinks`
- Images: `src/assets/images/` (optimized to WebP at build time)
- Redirects for old URLs (`/startseite`, `/ökologie`) live in `astro.config.mjs`
- Deploy: `.github/workflows/deploy.yml` on push to `main`
