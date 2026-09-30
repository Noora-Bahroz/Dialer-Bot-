// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    // NOTE: `regions` is not a supported VercelServerlessConfig key in
    // @astrojs/vercel 11.x and was silently dropped from the build output, so
    // it never pinned Mumbai. To pin a region, add a vercel.json with
    // "functions": { "dist/server/entry.mjs": { "regions": ["bom1"] } }.
    maxDuration: 60,
  }),
  site: 'https://dialerbot.online',
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/login') &&
        !page.includes('/applicant/') &&
        !page.includes('/recruiter/') &&
        !/\/careers\/\d+\/apply/.test(page) &&
        !page.includes('/api/'),
      serialize(item) {
        // Keep homepage + paths aligned with absoluteUrl() / trailingSlash:never
        const bare = item.url.replace(/\/$/, '');
        item.url = bare || 'https://dialerbot.online';
        return item;
      },
    }),
  ],
});
