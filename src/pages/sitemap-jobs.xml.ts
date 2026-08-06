import type { APIRoute } from 'astro';
import { getOpenJobs } from '../db/db';

export const prerender = false;

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Missing site URL configuration.', { status: 500 });
  }

  const origin = site.toString().replace(/\/$/, '');
  const jobs = await getOpenJobs();

  const urls = [
    {
      loc: `${origin}/careers`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '0.9',
    },
    ...jobs.map((job) => ({
      loc: `${origin}/careers/${job.id}`,
      lastmod: new Date(job.updated_at || job.posted_at).toISOString(),
      changefreq: 'daily',
      priority: '0.8',
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${xmlEscape(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=1800',
    },
  });
};
