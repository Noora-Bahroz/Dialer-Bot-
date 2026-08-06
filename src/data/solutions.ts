import { site } from './site';

export type SolutionPage = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  definition: string;
  audience: string;
  problems: string[];
  howItWorks: string[];
  outcomes: string[];
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
};

export const solutions: SolutionPage[] = [
  {
    slug: 'aca-voice-bot',
    title: 'ACA Voice Bot',
    h1: 'ACA voice bots that qualify before agents dial back',
    description:
      'Dialer Bot ACA voice bots ask compliant first questions, score intent, and warm-handoff only closable ACA, FE, and HI leads to agents.',
    definition:
      'An ACA voice bot is an AI caller that runs your locked opener pack on ACA (and related FE/HI) campaigns, confirms basic eligibility intent, and transfers only scored leads to human agents with context — instead of dumping cold transfers into seats.',
    audience: 'Insurance calling floors running ACA, Final Expense, and Health Insurance outbound or inbound qualification.',
    problems: [
      'Agents burn seats on tire-kickers and incomplete openers',
      'QA fails when openers drift off-script',
      'Cold transfers waste closers who inherit zero context',
      'Volume spikes faster than hiring can keep up',
    ],
    howItWorks: [
      'Lock turns 1–3 for compliance and QA',
      'Score answers for intent and readiness',
      'Run quiet-hour / consent gates before the pitch deepens',
      'Warm-handoff with transcript context to the right seat',
    ],
    outcomes: [
      'Higher agent talk-time on closable leads',
      'Opener packs that survive QA reviews',
      'Searchable transcripts for supervisors',
      'Dialer-synced pace when campaigns ramp',
    ],
    faqs: [
      {
        q: 'Can Dialer Bot run ACA openers without replacing agents?',
        a: 'Yes. Dialer Bot clears the first questions and tire-kickers. Agents still close. It is a qualification layer, not a full replacement for licensed closers.',
      },
      {
        q: 'Can we freeze compliant ACA scripts?',
        a: 'Yes. First questions can be hardcoded. Follow-ups adapt only after intent starts to form, so QA and compliance stay stable.',
      },
      {
        q: 'Does it work for FE and HI too?',
        a: 'Yes. The same qualification pattern applies to Final Expense and Health Insurance campaign packs with different opener content.',
      },
    ],
    related: [
      { label: 'Warm handoff', href: '/solutions/warm-handoff' },
      { label: 'Features', href: '/features' },
      { label: 'ACA opener article', href: '/blog/aca-opener-packs-that-survive-qa' },
    ],
  },
  {
    slug: 'truck-dispatch-bot',
    title: 'Truck Dispatch Voice Bot',
    h1: 'Truck dispatch voice bots for the first questions that waste seats',
    description:
      'Dialer Bot for truck dispatch asks the first logistics questions, filters incomplete calls, and warm-handoffs ready conversations to dispatchers.',
    definition:
      'A truck dispatch voice bot is an AI voice layer that greets carriers or shippers, asks the first operational questions (equipment, lane, timing, availability), and only connects dispatchers when the call is worth human time.',
    audience: 'Truck dispatch teams, broker floors, and logistics call centers that still qualify loads and carriers by phone.',
    problems: [
      'Dispatchers lose time on incomplete or wrong-fit calls',
      'After-hours inquiries die before a human answers',
      'Notes are missing when a call finally reaches a seat',
      'Peak hours flood the floor without extra headcount',
    ],
    howItWorks: [
      'Answer and ask first dispatch questions consistently',
      'Capture lane, timing, and fit signals before transfer',
      'Score readiness so weak calls stay with the bot or get scheduled',
      'Warm-handoff with a short context packet to the dispatcher',
    ],
    outcomes: [
      'Dispatchers spend more time on workable conversations',
      'Fewer cold transfers with empty notes',
      'Always-on first contact outside peak staffing',
      'Transcripts for dispute and QA follow-up',
    ],
    faqs: [
      {
        q: 'Is Dialer Bot built for truck dispatch or only insurance?',
        a: 'Both. Dialer Bot is used on truck dispatch floors and insurance calling floors. The qualification pattern is the same; the opener pack changes.',
      },
      {
        q: 'What first questions should a dispatch bot ask?',
        a: 'Typical first questions cover who is calling, equipment or load type, lane or geography, timing, and whether a human dispatcher is needed now. Packs are customized per floor.',
      },
      {
        q: 'Can it sync with our existing phone workflow?',
        a: 'Dialer Bot connects to dialer/SIP paths calling teams already run. Confirm your stack on WhatsApp before go-live.',
      },
    ],
    related: [
      { label: 'Warm handoff', href: '/solutions/warm-handoff' },
      { label: 'Dispatch article', href: '/blog/truck-dispatch-bots-first-questions' },
      { label: 'Live demo', href: site.demoUrl },
    ],
  },
  {
    slug: 'warm-handoff',
    title: 'Warm Handoff for Calling Floors',
    h1: 'Warm handoff beats cold transfer on live dialing floors',
    description:
      'Dialer Bot warm handoff passes scored, contextual leads to agents — not cold transfers that waste seats and kill conversion.',
    definition:
      'Warm handoff means the bot finishes first-contact qualification, packages what was asked and confirmed, then connects a human agent who already knows why the lead is worth time. Cold transfer dumps a live caller with little or no context.',
    audience: 'Call center and dispatch supervisors who measure conversion after transfer, not just connect rate.',
    problems: [
      'Cold transfers force agents to re-ask the same questions',
      'Closers inherit angry or confused callers',
      'QA cannot see why a transfer happened',
      'Connect metrics look fine while close rates stay flat',
    ],
    howItWorks: [
      'Qualify and score before any seat is occupied',
      'Attach transcript context to the handoff',
      'Prefer affinity routing to the right book of business',
      'Log disposition the moment the bot decides',
    ],
    outcomes: [
      'Higher post-transfer conversion',
      'Less repeated questioning',
      'Clearer supervisor review in the transcript vault',
      'Agents protect energy for closable work',
    ],
    faqs: [
      {
        q: 'What is the difference between warm handoff and cold transfer?',
        a: 'Cold transfer connects a caller with little context. Warm handoff only connects after qualification and passes what was asked, confirmed, and why the lead scored high enough for a human.',
      },
      {
        q: 'Does Dialer Bot always transfer every call?',
        a: 'No. Soft maybes and tire-kickers can stay with the bot or be dispositioned. Only scored leads cross your handoff threshold.',
      },
      {
        q: 'Can supervisors review why a handoff happened?',
        a: 'Yes. Transcripts and recordings live in the vault so ops can search intent labels and audit transfers.',
      },
    ],
    related: [
      { label: 'ACA voice bot', href: '/solutions/aca-voice-bot' },
      { label: 'Warm handoff article', href: '/blog/warm-handoff-beats-cold-transfer' },
      { label: 'Features', href: '/features' },
    ],
  },
];

export function getSolution(slug: string) {
  return solutions.find((s) => s.slug === slug);
}
