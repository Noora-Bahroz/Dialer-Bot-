// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
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
    }),
  ],
});
