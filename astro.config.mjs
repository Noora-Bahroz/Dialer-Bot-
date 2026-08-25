// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    // Mumbai — closest to Turso ap-south-1 and Pakistan visitors
    regions: ['bom1'],
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
