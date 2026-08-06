import { site } from './site';

export const SITE_URL = `https://${site.domain}`;
export const DEFAULT_OG_IMAGE = '/images/dialerbot-home-01.webp';
export const DEFAULT_DESCRIPTION =
  'AI voice bots that qualify inbound and outbound calls for call centers, truck dispatch, ACA, FE, and HI — then warm-handoff closable leads to agents.';

function parseMonthlySalaryRange(compensation: string | null) {
  if (!compensation) return null;
  const nums = compensation.match(/\d[\d,]*/g)?.map((n) => Number(n.replaceAll(',', ''))).filter((n) => Number.isFinite(n)) || [];
  if (!nums.length) return null;

  const [min, max] = nums.length >= 2 ? [Math.min(nums[0], nums[1]), Math.max(nums[0], nums[1])] : [nums[0], nums[0]];
  if (min <= 0 || max <= 0) return null;

  return {
    '@type': 'MonetaryAmount',
    currency: 'PKR',
    value: {
      '@type': 'QuantitativeValue',
      minValue: min,
      maxValue: max,
      unitText: 'MONTH',
    },
  };
}

export function absoluteUrl(path = '/') {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return new URL(clean, SITE_URL).href;
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: 'DialerBot',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/dialerbot-logo-square.png'),
      width: 512,
      height: 512,
    },
    image: absoluteUrl('/images/dialerbot-logo-square.png'),
    email: site.email,
    telephone: site.phoneDisplay,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: 'Islamabad',
      addressCountry: 'PK',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.phoneDisplay,
      contactType: 'sales',
      availableLanguage: ['English'],
    },
    sameAs: [site.demoUrl],
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/dialerbot-logo-square.png'),
        width: 512,
        height: 512,
      },
    },
    hasPart: [
      { '@type': 'WebPage', name: 'Features', url: absoluteUrl('/features') },
      { '@type': 'WebPage', name: 'Pricing', url: absoluteUrl('/pricing') },
      { '@type': 'WebPage', name: 'Contact', url: absoluteUrl('/contact') },
      { '@type': 'WebPage', name: 'Careers', url: absoluteUrl('/careers') },
      { '@type': 'WebPage', name: 'Blog', url: absoluteUrl('/blog') },
      { '@type': 'WebPage', name: 'Company', url: absoluteUrl('/company') },
    ],
    potentialAction: {
      '@type': 'ViewAction',
      name: 'Try live demo',
      target: site.demoUrl,
    },
  };
}

/** Helps Google understand primary nav destinations (sitelinks are still algorithmic). */
export function siteNavigationJsonLd() {
  const links = [
    { name: 'Features', path: '/features' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Company', path: '/company' },
    { name: 'Contact', path: '/contact' },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Primary navigation',
    itemListElement: links.map((link, i) => ({
      '@type': 'SiteNavigationElement',
      position: i + 1,
      name: link.name,
      url: absoluteUrl(link.path),
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a,
      },
    })),
  };
}

export function definedTermJsonLd(term: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term,
    description,
    url: absoluteUrl(path),
    inDefinedTermSet: absoluteUrl('/llms.txt'),
  };
}

export function webPageJsonLd(opts: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: opts.name,
    description: opts.description,
    url: absoluteUrl(opts.path),
    isPartOf: {
      '@type': 'WebSite',
      name: site.name,
      url: SITE_URL,
    },
  };
}

export function articleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  author: string;
  image: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(post.image),
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/dialerbot-logo-square.png'),
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
  };
}

export function jobPostingJsonLd(job: {
  id: number;
  title: string;
  description: string;
  niche: string;
  type: string;
  location: string;
  compensation: string | null;
  posted_at: string;
}) {
  const employment =
    job.type.toLowerCase().includes('intern') ? 'INTERN'
    : job.type.toLowerCase().includes('part') ? 'PART_TIME'
    : job.type.toLowerCase().includes('contract') ? 'CONTRACTOR'
    : 'FULL_TIME';
  const salary = parseMonthlySalaryRange(job.compensation);

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    identifier: {
      '@type': 'PropertyValue',
      name: site.name,
      value: String(job.id),
    },
    datePosted: job.posted_at,
    employmentType: employment,
    hiringOrganization: {
      '@type': 'Organization',
      name: site.name,
      sameAs: SITE_URL,
      logo: absoluteUrl('/images/dialerbot-logo-square.png'),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location.includes('Remote') ? 'Remote' : 'Islamabad',
        addressCountry: 'PK',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'PK',
    },
    baseSalary: salary || undefined,
    directApply: true,
    industry: job.niche,
    url: absoluteUrl(`/careers/${job.id}`),
  };
}
