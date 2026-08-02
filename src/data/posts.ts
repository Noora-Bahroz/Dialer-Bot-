export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  tag: string;
  readMinutes: number;
};

export const posts: Post[] = [
  {
    slug: 'warm-handoff-beats-cold-transfer',
    title: 'Why warm handoff beats cold transfer on busy floors',
    excerpt:
      'Agents close more when they inherit context — not a silent dump into an unknown call. Here is how Dialer Bot frames the pass.',
    tag: 'Operations',
    date: '2026-07-28',
    author: 'Uzair Naseer',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    readMinutes: 5,
    content: `
<p class="bl-lead">Cold transfers punish everyone. The lead repeats themselves. The agent starts blind. The supervisor sees talk time without progress.</p>
<p>Warm handoff is the opposite: the bot finishes qualification, announces the pass, and lands a context card on the closer’s seat — so the human opens with recognition, not interrogation.</p>
<h2>What the closer should see</h2>
<p>On Dialer Bot floors, that card carries the locked answers plus the last clarifying turn. At minimum:</p>
<ul>
  <li>ZIP / geography signal</li>
  <li>Intent label from the live score</li>
  <li>Subsidy, load, or product cue for the book</li>
  <li>Last bot turn — what the lead just confirmed</li>
</ul>
<blockquote>If your transfer still sounds like “please hold for the next available,” you are paying closer rates for opener work.</blockquote>
<h2>Fix the pass before you buy seats</h2>
<p>Start with one campaign pack. Measure connect-to-close after warm transfer. Only then scale bots. WhatsApp us if you want that teardown on your dialer.</p>
`,
  },
  {
    slug: 'aca-opener-packs-that-survive-qa',
    title: 'ACA opener packs that survive QA week',
    excerpt:
      'Hardcode the compliance-critical turns, let the model handle hesitation, and freeze winners after a fair A/B window.',
    tag: 'Campaigns',
    date: '2026-07-12',
    author: 'Dialer Bot Team',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">ACA seasons punish vague bots. QA wants the same disclosures every time; leads want a conversation that does not feel scripted.</p>
<p>The fix is layered: lock turns one through three, then allow adaptive clarification once intent starts to form.</p>
<h2>Ship packs, not one-off scripts</h2>
<p>Opener pack studio lets you run two ACA greetings against the same scoring rules. Freeze the winner. Archive the dud. Your compliance checklist stays intact because the mandatory lines never floated into free generation.</p>
<ul>
  <li>Lock disclosure and identity turns</li>
  <li>A/B only the flexible greeting frame</li>
  <li>Keep scoring thresholds identical across packs</li>
</ul>
<h2>Gate before you pitch</h2>
<p>Pair packs with quiet-hour gates and DNC checks before the pitch. Qualification speed means nothing if the call should never have dialed.</p>
`,
  },
  {
    slug: 'pace-governor-for-dialer-rpm',
    title: 'Matching dialer RPM without burying your closers',
    excerpt:
      'Concurrent bots feel great until agents drown. A pace governor keeps qualification ambitious and seats human.',
    tag: 'Dialer sync',
    date: '2026-06-20',
    author: 'Dialer Bot Team',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">Dialer Bot can outrun a floor if you let it. Concurrent bots feel great until agents drown in warm transfers with nowhere to sit.</p>
<p>The pace governor caps concurrent bots, respects dialer RPM, and throttles when ready seats disappear. Qualification stays hungry; handoffs stay humane.</p>
<h2>Treat governor settings like staffing</h2>
<p>Supervisors should revisit caps when campaigns spike or night shifts thin out. A morning ACA blitz and a quiet dispatch afternoon rarely share the same limit.</p>
<ul>
  <li>Cap concurrent bots to dialer RPM</li>
  <li>Throttle when agent seats saturate</li>
  <li>Revisit affinity routing before blaming the voice model</li>
</ul>
<blockquote>If your agents say “the bot is too fast,” check governor limits and affinity first.</blockquote>
`,
  },
  {
    slug: 'truck-dispatch-bots-first-questions',
    title: 'Truck dispatch bots: the first questions that matter',
    excerpt:
      'Load availability, lane, and timing beat small talk. Lock those turns, then let the bot recover from messy answers.',
    tag: 'Dispatch',
    date: '2026-05-30',
    author: 'Uzair Naseer',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">Dispatch floors live on specifics. A bot that chats about the weather wastes a driver’s patience and a broker’s minute.</p>
<p>Dialer Bot customers lock load, lane, and timing questions early, then allow flexible follow-ups when answers are partial or noisy.</p>
<h2>Lock the turns that move freight</h2>
<ul>
  <li>Load availability</li>
  <li>Lane / geography</li>
  <li>Timing / delivery window</li>
</ul>
<p>Warm handoff to the right desk — flatbed vs reefer, regional vs OTR — is where affinity routing earns its keep. The transcript vault helps ops coach phrasing that drivers actually answer.</p>
<h2>Build the pack with your openers</h2>
<p>Bring your top ten opener lines on WhatsApp and we will map them into a locked-plus-adaptive flow.</p>
`,
  },
  {
    slug: 'transcript-vault-for-supervisors',
    title: 'Transcript vaults beat “listen to this hour of tape”',
    excerpt:
      'Search for intent labels and ZIP codes. Coach from evidence, not vibes. Keep recordings where compliance expects them.',
    tag: 'QA',
    date: '2026-05-08',
    author: 'Dialer Bot Team',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">Supervisors should not scrub recordings hoping to hear one bad disclosure. A searchable transcript vault turns QA into queries.</p>
<p>Search for intent labels and ZIP codes. Coach from evidence, not vibes. Keep recordings where compliance expects them.</p>
<h2>Query the floor, don’t binge tape</h2>
<ul>
  <li><code>subsidy_yes</code> and similar intent labels</li>
  <li>Wrong ZIP / geography misses</li>
  <li>Angry escalate and silent abandon</li>
</ul>
<p>Pair vault search with disposition webhooks so CRM truth matches what the bot decided. When marketing asks why FE volume dipped, you answer with dispositions — not folklore.</p>
<blockquote>Enterprise floors can tune retention windows; starter bots still get vault basics that make coaching possible in week one.</blockquote>
`,
  },
  {
    slug: 'when-to-buy-enterprise-bots',
    title: 'When $35/bot is enough — and when to go enterprise',
    excerpt:
      'One campaign lane loves simple pricing. Multi-book floors with custom compliance usually need a WhatsApp quote.',
    tag: 'Pricing',
    date: '2026-04-16',
    author: 'Uzair Naseer',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    readMinutes: 3,
    content: `
<p class="bl-lead">Dialer Bot’s public price is deliberate: <strong>$35 per bot</strong>. That lane fits a single inbound receptionist or one outbound book with standard handoff.</p>
<p>You get scoring, vault access, and WhatsApp onboarding without a procurement novel.</p>
<h2>Stay on starter when…</h2>
<ul>
  <li>One campaign lane is enough</li>
  <li>Standard warm handoff covers the floor</li>
  <li>You want clarity before a custom matrix</li>
</ul>
<h2>Go enterprise when…</h2>
<ul>
  <li>You need many bots across books</li>
  <li>Seat affinity spans teams</li>
  <li>Custom quiet-hour or compliance rules apply</li>
  <li>Priority tuning matters during enrollment spikes</li>
</ul>
<p>We quote enterprise on WhatsApp so the number matches your floor — not a generic tier page. Unsure which lane you are? Message dialer type, seat count, and campaign list. We will say starter or enterprise in one reply.</p>
`,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
