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
    city: 'Islamabad, Pakistan',
  },
  pricePerBot: 35,
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
};
