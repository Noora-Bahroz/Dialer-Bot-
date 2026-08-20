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
    title: 'Warm Transfer vs. Cold Transfer: Which Is Better for Sales Teams?',
    excerpt:
      'A qualified lead should not have to repeat the entire conversation to your agent. Learn how context-rich transfers make the handoff faster and more productive.',
    tag: 'Sales',
    date: '2026-07-28',
    author: 'Uzair Naseer',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&q=80',
    readMinutes: 5,
    content: `
<p class="bl-lead">Cold transfers punish everyone. The lead repeats themselves. The agent starts blind. The supervisor sees talk time without progress.</p>
<p>Warm transfer is the opposite: the bot finishes qualification, announces the pass, and lands context on the closer’s seat — so the human opens with recognition, not interrogation.</p>
<h2>What the closer should see</h2>
<p>On DialerBot floors, that context carries the answers collected so far plus the last clarifying turn. At minimum:</p>
<ul>
  <li>Geography or location signal</li>
  <li>Whether the lead met your qualification criteria</li>
  <li>Product or campaign cue for the book</li>
  <li>Last bot turn — what the lead just confirmed</li>
</ul>
<blockquote>If your transfer still sounds like “please hold for the next available,” you are paying closer rates for opener work.</blockquote>
<h2>Fix the pass before you scale</h2>
<p>Start with one campaign. Measure what happens after warm transfer. Only then scale bots. Talk to sales if you want that teardown on your dialer.</p>
`,
  },
  {
    slug: 'aca-opener-packs-that-survive-qa',
    title: 'How to Build an AI Qualification Script That Actually Works',
    excerpt:
      'Good AI calling campaigns start with good questions. Learn how to structure opening questions, qualification criteria, objections, and handoff rules.',
    tag: 'Campaigns',
    date: '2026-07-12',
    author: 'DialerBot Team',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">Busy seasons punish vague bots. QA wants consistent disclosures; leads want a conversation that does not feel like a rigid recording.</p>
<p>The fix is layered: keep critical opening questions consistent, then allow the AI to clarify when answers are incomplete or hesitant.</p>
<h2>Ship campaign scripts, not one-off prompts</h2>
<p>Define the opening message, required questions, objections, transfer conditions, and end-call rules for each campaign. Freeze winners. Retire what fails QA.</p>
<ul>
  <li>Lock disclosure and identity turns</li>
  <li>Allow natural follow-ups around the locked framework</li>
  <li>Keep qualification criteria identical across script versions</li>
</ul>
<h2>Qualify before you pitch</h2>
<p>Pair scripts with operating rules — quiet hours, DNC, consent — before the pitch. Speed means nothing if the call should never have dialed.</p>
`,
  },
  {
    slug: 'pace-governor-for-dialer-rpm',
    title: 'How to Connect an AI Voice Agent to Your Existing Dialer',
    excerpt:
      "You don't always need to rebuild your call center to add AI. Here's how the AI layer can fit into your existing telephony and dialer infrastructure.",
    tag: 'Dialer Integration',
    date: '2026-06-20',
    author: 'DialerBot Team',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">DialerBot is designed to work alongside the dialer, SIP environment, or calling infrastructure your team already knows.</p>
<p>The AI operates as the conversation layer: it talks to the lead, qualifies the conversation, and transfers the right calls — without forcing a full stack replacement.</p>
<h2>Treat capacity like staffing</h2>
<p>Supervisors should revisit concurrent-bot limits when campaigns spike or night shifts thin out. A morning outbound blitz and a quiet afternoon rarely share the same limit.</p>
<ul>
  <li>Connect DialerBot to your existing dialer or SIP setup</li>
  <li>Keep agent workflows familiar</li>
  <li>Throttle when human seats saturate</li>
</ul>
<blockquote>If agents say “the bot is too fast,” check capacity and routing before blaming the voice model.</blockquote>
`,
  },
  {
    slug: 'truck-dispatch-bots-first-questions',
    title: 'When Should an AI Voice Bot Transfer to a Human?',
    excerpt:
      "The best AI agent isn't the one that talks the longest. It's the one that knows when the conversation belongs with a human.",
    tag: 'Dispatch',
    date: '2026-05-30',
    author: 'Uzair Naseer',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">Dispatch and sales floors live on specifics. A bot that chats forever wastes patience and talk time.</p>
<p>DialerBot customers lock the questions that matter early — availability, lane, timing, interest, eligibility — then transfer when the conversation needs human judgment.</p>
<h2>Transfer when value needs a person</h2>
<ul>
  <li>Qualification criteria are met</li>
  <li>The prospect asks for a human</li>
  <li>The conversation becomes complex or sensitive</li>
</ul>
<p>Warm transfer to the right desk is where routing earns its keep. Recordings and transcripts help ops coach phrasing that people actually answer.</p>
<h2>Build the campaign with your openers</h2>
<p>Bring your top opener lines and transfer rules. We'll help map them into a clear AI → human workflow.</p>
`,
  },
  {
    slug: 'transcript-vault-for-supervisors',
    title: 'Why Call Transcripts Matter More Than You Think',
    excerpt:
      'Recordings tell you what happened. Transcripts help you understand why it happened. Learn how QA teams use call data to improve AI campaigns and human agents.',
    tag: 'QA',
    date: '2026-05-08',
    author: 'DialerBot Team',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80',
    readMinutes: 4,
    content: `
<p class="bl-lead">Supervisors should not scrub hours of audio hoping to hear one bad disclosure. Searchable transcripts turn QA into queries.</p>
<p>Recordings tell you what happened. Transcripts help you understand why it happened — and coach from evidence, not vibes.</p>
<h2>Query the floor, don’t binge tape</h2>
<ul>
  <li>Qualified vs not-qualified outcomes</li>
  <li>Missed required information</li>
  <li>Angry escalate and silent abandon</li>
</ul>
<p>Pair transcripts with dispositions so CRM truth matches what the bot decided. When marketing asks why volume dipped, you answer with outcomes — not folklore.</p>
`,
  },
  {
    slug: 'when-to-buy-enterprise-bots',
    title: 'The Real Cost of AI Calling',
    excerpt:
      "AI calling isn't simply an LLM bill. Understand the different components behind the actual cost of an AI voice campaign — including software vs telephony.",
    tag: 'Pricing',
    date: '2026-04-16',
    author: 'Uzair Naseer',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    readMinutes: 3,
    content: `
<p class="bl-lead">DialerBot’s public software price starts at <strong>$35 per bot</strong>. That covers one campaign workflow — not every telephony or carrier charge in your environment.</p>
<p>AI calling isn’t simply an LLM bill. Software, voice infrastructure, SIP, and carrier usage can each contribute depending on how you deploy.</p>
<h2>Stay on starter when…</h2>
<ul>
  <li>One campaign lane is enough</li>
  <li>Standard warm transfer covers the floor</li>
  <li>You want clarity before a custom matrix</li>
</ul>
<h2>Go enterprise when…</h2>
<ul>
  <li>You need many bots across books</li>
  <li>Advanced routing spans teams</li>
  <li>Custom operating rules apply</li>
  <li>Priority support matters during volume spikes</li>
</ul>
<p>We quote enterprise directly so the number matches your floor — not a generic tier page. Unsure which lane you are? Share dialer type, seat count, and campaign list.</p>
`,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
