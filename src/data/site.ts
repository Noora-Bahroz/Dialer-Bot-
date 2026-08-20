/** Shared Dialer Bot site facts & CTAs */
export const site = {
  name: 'Dialer Bot',
  domain: 'dialerbot.online',
  url: 'https://dialerbot.online',
  demoUrl: 'https://demo.dialerbot.online',
  email: 'Query@dialerbot.online',
  phoneDisplay: '+92 311 6877887',
  phoneE164: '923116877887',
  address: {
    line1: 'Office 12',
    line2: 'Pakistan Town Phase 2',
    city: 'Islamabad',
    region: 'Islamabad Capital Territory',
    postalCode: '44000',
    country: 'PK',
  },
  pricePerBot: 35,
} as const;

/** Demo URL with UTM so we can see which CTA drives sales */
export function demoLink(content: string, campaign = 'sales') {
  const u = new URL(site.demoUrl);
  u.searchParams.set('utm_source', 'dialerbot_online');
  u.searchParams.set('utm_medium', 'website');
  u.searchParams.set('utm_campaign', campaign);
  u.searchParams.set('utm_content', content);
  return u.toString();
}

export const demo = {
  header: demoLink('header'),
  footer: demoLink('footer'),
  sticky: demoLink('sticky_mobile'),
  homeHero: demoLink('home_hero'),
  homeChip: demoLink('home_service_chip'),
  features: demoLink('features'),
  pricing: demoLink('pricing'),
  pricingStarter: demoLink('pricing_starter'),
  company: demoLink('company'),
  contact: demoLink('contact'),
  blog: demoLink('blog'),
  solution: demoLink('solution_page'),
} as const;

export function waLink(message?: string) {
  const base = `https://wa.me/${site.phoneE164}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const wa = {
  general: waLink("Hi Dialer Bot — I'd like to learn more."),
  start: waLink("Hi Dialer Bot — I'd like to get started."),
  enterprise: waLink('Hi Dialer Bot — I need enterprise / multi-bot pricing.'),
  careers: waLink("Hi Dialer Bot — I'm interested in a role on your team."),
  support: waLink('Hi Dialer Bot — I have a support question.'),
  afterContact: waLink(
    "Hi Dialer Bot — I just sent the contact form on dialerbot.online and want to continue on WhatsApp.",
  ),
};
