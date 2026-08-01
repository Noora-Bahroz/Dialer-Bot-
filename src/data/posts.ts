export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
};

export const posts: Post[] = [
  {
    slug: 'funnel-conversion-playbook',
    title: 'The funnel conversion playbook for modern teams',
    excerpt:
      'Practical steps to turn attention into revenue with clearer messaging and smarter automation.',
    content: `<p>High-performing funnels start with a sharp promise and a frictionless path to action. Map every step from first click to paid conversion, then remove anything that does not help the visitor decide.</p>
<p>Cryzel teams use segmentation, personalized sequences, and clear reporting to spot drop-offs early. Pair creative testing with lifecycle emails so each cohort gets the message that fits their stage.</p>
<p>Measure what matters: activation, retention, and revenue per campaign — not vanity opens alone.</p>`,
    date: '2026-04-02',
    author: 'Alex Rivera',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
  },
  {
    slug: 'email-campaigns-that-convert',
    title: 'Email campaigns that reach inboxes and drive results',
    excerpt: 'Design visually engaging messages that earn trust and move people to take the next step.',
    content: `<p>Great email is equal parts craft and timing. Lead with a benefit-led subject line, keep the layout scannable, and give every message one primary CTA.</p>
<p>Use Cryzel’s personalization and segmentation tools to send the right offer to the right audience. Track clicks into product experiences, not just list growth.</p>`,
    date: '2026-03-11',
    author: 'Sam Okonkwo',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
  },
  {
    slug: 'building-customer-loyalty',
    title: 'Building customer loyalty with smarter retention loops',
    excerpt: 'Retention is a product experience. Here is how to keep customers coming back.',
    content: `<p>Loyalty compounds when onboarding is clear, support is fast, and follow-ups feel helpful rather than noisy. Create loops that celebrate milestones and re-engage quietly when activity drops.</p>
<p>Combine in-app cues with thoughtful email so customers always know the next valuable action.</p>`,
    date: '2026-02-20',
    author: 'Mia Chen',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
