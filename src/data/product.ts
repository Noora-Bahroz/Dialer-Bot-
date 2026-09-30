/**
 * Dialer Bot — canonical product source of truth.
 *
 * WHAT CHANGED IN THIS REVISION
 * This file previously recorded what the *repository happened to say*, with every
 * claim carrying a `SourceRef` back to a page, and every disagreement parked in
 * `openConflicts`. That was the right shape for an audit, but it made the file a
 * description of drift rather than a definition of the product.
 *
 * It is now the authoritative product model. The confirmed requirements are the
 * source of truth, and the old repository state has been demoted to
 * `siteConflicts` at the bottom — the actionable list of places that still need
 * to be brought in line.
 *
 * PROVENANCE RULES (deliberate, please keep them):
 * - Canonical claims below are marked `confirmed-requirement`. They do NOT carry
 *   file:line references, because they are not derived from the repository. Do
 *   not invent `SourceRef`s for them; that would make the file lie about its own
 *   provenance.
 * - Claims about what the site says *today* live only in `siteConflicts`, and
 *   those DO carry file:line references.
 * - `pricing.bot.unitDefinition` is deliberately business-level. Technical
 *   concurrency/unit detail is intentionally absent and must not be added
 *   without verification. See `pricing.doNotInvent`.
 */

export type Provenance = 'confirmed-requirement' | 'site-state';

/** A pointer to where a fact currently lives in the repo. Only for site-state claims. */
export type SourceRef = {
  file: string;
  lines: string;
  note?: string;
};

/* ================================================================== *
 * 1. BRAND + TERMINOLOGY
 * ================================================================== */

export const brand = {
  /** Primary brand spelling. */
  name: 'Dialer Bot',
  /** Machine-readable alternate. Kept because it is already declared in schema. */
  alternateName: 'DialerBot',
  domain: 'dialerbot.online',
  provenance: 'confirmed-requirement' as const,
} as const;

/** The words to use. Anything not listed here should not be added to marketing copy. */
export const terminology = {
  /** Use these consistently. */
  canonical: {
    productDescriptor: 'AI voice bot',
    humanRole: 'human closer',
    agentRole: 'agent',
    lead: 'qualified lead',
    transfer: 'live transfer',
    transferAlt: 'warm handoff',
    outcome: 'disposition',
    dialerIntegration: 'PC dialer',
    compliance: 'DNC / Do Not Call',
  },
  /**
   * Do NOT introduce these.
   * `frontliner` is explicitly rejected. `assistant` and `platform` must not be
   * used as the main product definition.
   */
  banned: [
    { term: 'frontliner', reason: 'Explicitly rejected as a product term. Zero repo usage; do not introduce.' },
    { term: 'AI assistant', reason: 'Must not be the product definition. Homepage currently misuses it.' },
    { term: 'AI voice platform / bot platform', reason: 'Must not be the main product definition.' },
    { term: 'smart AI phone system', reason: 'Company page currently misuses it as the definition.' },
    { term: 'warm transfer', reason: 'Do not randomly alternate. Use "live transfer" or "warm handoff".' },
  ],
  provenance: 'confirmed-requirement' as const,
} as const;

/* ================================================================== *
 * 2. PRODUCT DEFINITION
 * ================================================================== */

export const definition =
  'Dialer Bot is an AI voice bot for call-center operations. It works with your existing PC dialer, handles the opening conversation, detects voicemail and answering machines, qualifies interested leads, and live-transfers qualified calls to a human closer.';

/** Longer form for FAQ answers, llms.txt, and page intros. */
export const definitionLong =
  'Dialer Bot is an AI voice bot built for call-center operations. Your existing PC dialer makes the calls; Dialer Bot answers, follows your business-specific script, detects whether a human or an automated system picked up, asks the qualification questions your campaign requires, and live-transfers the calls that qualify to a human closer. Every call ends with a recorded disposition.';

export const definitionMeta = {
  /** Default meta description. Must not reintroduce "assistant" or "platform". */
  text: 'AI voice bot for call centers. Works with your existing PC dialer, detects voicemail and answering machines, qualifies leads, and live-transfers qualified calls to a human closer.',
  provenance: 'confirmed-requirement' as const,
} as const;

/** The product's job, in one line. Used for hero subheads and section intros. */
export const productPromise =
  'The bot opens every call, filters out voicemail and answering machines, qualifies the leads worth your closers’ time, and live-transfers them to a human.';

/* ================================================================== *
 * 3. CANONICAL PRODUCT FLOW — 6 stages
 * ================================================================== */

export type FlowActor = 'pc-dialer' | 'dialer-bot' | 'human-closer';

export type FlowStep = {
  id: string;
  /** 1-6, display order. */
  n: number;
  name: string;
  actor: FlowActor;
  /** One plain-English sentence. Suitable for a card or diagram node. */
  plain: string;
  /** Supporting detail bullets. */
  details: string[];
  provenance: Provenance;
};

export const productFlow: FlowStep[] = [
  {
    id: 'pc-dialer',
    n: 1,
    name: 'PC Dialer',
    actor: 'pc-dialer',
    plain: 'Your existing PC dialer starts the call. Dialer Bot works inside the workflow you already run.',
    details: [
      'The call center already has human agents/closers and an existing PC dialer.',
      'The PC dialer automatically dials calls and sets the pace.',
      'Dialer Bot is an officially supported integration for that existing PC dialer workflow.',
      'Dialer Bot connects to the workflow rather than replacing it.',
    ],
    provenance: 'confirmed-requirement',
  },
  {
    id: 'ai-voice-bot',
    n: 2,
    name: 'AI Voice Bot',
    actor: 'dialer-bot',
    plain: 'The AI voice bot answers and handles the initial conversation using your business-specific script.',
    details: [
      'The bot runs a business-specific script. One business or campaign can have its own qualification flow and required questions.',
      'The script is generally consistent for that business, while the conversation proceeds based on the customer’s answers.',
      'The bot speaks in a natural, high-quality AI voice.',
    ],
    provenance: 'confirmed-requirement',
  },
  {
    id: 'detection-qualification',
    n: 3,
    name: 'Detection & Qualification',
    actor: 'dialer-bot',
    plain: 'The bot works out who picked up, then asks the qualification questions the campaign requires.',
    details: [
      'Detects whether a human answered.',
      'Detects voicemail.',
      'Detects answering machines.',
      'Detects honeypot / automated-response situations.',
      'Detects other non-human or invalid call outcomes where supported.',
      'Asks the required qualification questions for the campaign.',
      'Checks DNC status before proceeding and does not proceed with the call where applicable.',
    ],
    provenance: 'confirmed-requirement',
  },
  {
    id: 'qualification-decision',
    n: 4,
    name: 'Qualification Decision',
    actor: 'dialer-bot',
    plain: 'The bot decides whether this lead meets the required criteria and is actually interested.',
    details: [
      'Determines whether the lead meets the required qualification criteria / eligibility.',
      'Determines whether the person is interested.',
      'Determines whether the call should be passed to a human.',
      'Leads that do not qualify are not passed to a closer.',
    ],
    provenance: 'confirmed-requirement',
  },
  {
    id: 'live-transfer',
    n: 5,
    name: 'Live Transfer',
    actor: 'human-closer',
    plain: 'Qualified and interested calls are transferred live to a human closer, who completes the sale.',
    details: [
      'The transfer is live — the closer picks up the same call, it is not a callback.',
      'The handoff is a warm handoff where context is available.',
      'The AI voice bot is NOT the final salesperson.',
      'The human closer completes the actual deal, including verification, paperwork, and final closing.',
    ],
    provenance: 'confirmed-requirement',
  },
  {
    id: 'disposition',
    n: 6,
    name: 'Disposition',
    actor: 'dialer-bot',
    plain: 'Every call ends with a recorded status, so the call center knows exactly what happened.',
    details: [
      'A "disposition" is the final status recorded for a call.',
      'Examples include callback, not interested, voicemail, answering machine, and other appropriate call outcomes.',
      'The disposition is recorded whether or not the call was transferred.',
    ],
    provenance: 'confirmed-requirement',
  },
];

/** One-line flow summary for diagrams, meta tags, and llms files. */
export const flowSummary =
  'PC Dialer → AI Voice Bot → Detection & Qualification → Qualification Decision → Live Transfer → Disposition';

/* ================================================================== *
 * 4. CALL DETECTION
 * ================================================================== */

export type DetectionKind = 'human' | 'voicemail' | 'answering-machine' | 'honeypot' | 'other-non-human';

export type CallDetection = {
  id: DetectionKind;
  name: string;
  /** What the bot concludes. */
  result: string;
  /** Plain-English explanation for a first-time visitor. */
  plain: string;
  /** Whether this outcome normally ends the call without a closer. */
  normallyEndsCall: boolean;
  provenance: Provenance;
};

export const callDetection: CallDetection[] = [
  {
    id: 'human',
    name: 'Human answered',
    result: 'Continue to the script and qualification questions.',
    plain: 'A real person picked up, so the bot continues the conversation.',
    normallyEndsCall: false,
    provenance: 'confirmed-requirement',
  },
  {
    id: 'voicemail',
    name: 'Voicemail',
    result: 'Record a voicemail disposition.',
    plain: 'The bot recognises a voicemail greeting instead of a person, so it does not waste the call.',
    normallyEndsCall: true,
    provenance: 'confirmed-requirement',
  },
  {
    id: 'answering-machine',
    name: 'Answering machine',
    result: 'Record an answering-machine disposition.',
    plain: 'An answering machine took the call, so the bot stops rather than talking to a machine.',
    normallyEndsCall: true,
    provenance: 'confirmed-requirement',
  },
  {
    id: 'honeypot',
    name: 'Honeypot / automated response',
    result: 'Treat as a non-human call outcome.',
    plain: 'Some automated systems answer calls. The bot detects these and does not treat them as a real lead.',
    normallyEndsCall: true,
    provenance: 'confirmed-requirement',
  },
  {
    id: 'other-non-human',
    name: 'Other non-human / invalid outcome',
    result: 'Record an other disposition where supported.',
    plain: 'Anything else that is clearly not a person taking a call, handled where supported.',
    normallyEndsCall: true,
    provenance: 'confirmed-requirement',
  },
];

/* ================================================================== *
 * 5. DISPOSITIONS
 * ================================================================== */

/** Plain-English explanation. Required the first time the word appears in any page copy. */
export const dispositionPlainEnglish =
  'A disposition is the final status recorded for a call — so you can see at a glance whether it reached a closer, went to voicemail, or needs a callback.';

export const dispositions = {
  plainEnglish: dispositionPlainEnglish,
  /** Examples confirmed for use in marketing copy. Not necessarily an exhaustive list. */
  examples: [
    { id: 'qualified-transferred', label: 'Qualified / transferred', plain: 'The lead met the criteria and was live-transferred to a human closer.' },
    { id: 'callback', label: 'Callback', plain: 'Worth calling back later.' },
    { id: 'not-interested', label: 'Not interested', plain: 'The person did not want to proceed.' },
    { id: 'voicemail', label: 'Voicemail', plain: 'The call reached voicemail.' },
    { id: 'answering-machine', label: 'Answering machine', plain: 'An answering machine picked up.' },
    { id: 'other', label: 'Other', plain: 'Any other call outcome the campaign needs to track.' },
  ],
  provenance: 'confirmed-requirement' as const,
} as const;

/* ================================================================== *
 * 6. CANONICAL CAPABILITIES
 * ================================================================== */

export type CapabilityGroup =
  | 'conversation'
  | 'scripts'
  | 'detection'
  | 'qualification'
  | 'handoff'
  | 'outcomes'
  | 'compliance'
  | 'integration'
  | 'voice';

export type Capability = {
  id: string;
  name: string;
  group: CapabilityGroup;
  plain: string;
  /** Primary capabilities anchor the main feature list and homepage messaging. */
  primary: boolean;
  /**
   * 'confirmed' = confirmed supported capability.
   * 'secondary'  = functionality that exists and is documented, but must NOT be a
   *                highlighted selling point.
   */
  status: 'confirmed' | 'secondary';
  provenance: Provenance;
};

export const capabilities: Capability[] = [
  {
    id: 'ai-voice-conversations',
    name: 'AI Voice Conversations',
    group: 'conversation',
    plain: 'The bot holds a natural-sounding opening conversation: it listens, answers, asks follow-up questions, and keeps the call going.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'business-specific-scripts',
    name: 'Business-Specific Scripts',
    group: 'scripts',
    plain: 'Each business or campaign can have its own script and its own required questions. The script stays consistent for that business while the conversation branches on the customer’s answers.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification',
    group: 'qualification',
    plain: 'The bot asks the qualification questions your campaign requires and works out whether the lead meets your criteria and is interested.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'call-detection',
    name: 'Human / Automated Call Detection',
    group: 'detection',
    plain: 'The bot works out whether a human actually answered, so your closers never pick up a voicemail.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'voicemail-detection',
    name: 'Voicemail Detection',
    group: 'detection',
    plain: 'Recognises a voicemail greeting and ends the call cleanly instead of talking to a machine.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'answering-machine-detection',
    name: 'Answering-Machine Detection',
    group: 'detection',
    plain: 'Recognises an answering machine and records it as its own outcome.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'honeypot-detection',
    name: 'Honeypot / Automated-Response Detection',
    group: 'detection',
    plain: 'Detects honeypot and other automated-response systems, so automated systems are not counted as real leads.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'live-transfer',
    name: 'Live Transfer / Warm Handoff',
    group: 'handoff',
    plain: 'Qualified and interested calls are transferred live to a human closer, with context where available, instead of being put on blind hold.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'dispositions',
    name: 'Dispositions',
    group: 'outcomes',
    plain: 'Every call is labelled with a final status — callback, not interested, voicemail, answering machine, or other — so you can see what happened.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'dnc-compliance',
    name: 'DNC Compliance',
    group: 'compliance',
    plain: 'DNC means Do Not Call. The system checks whether a number is on a Do Not Call list before proceeding, and does not proceed with the call where applicable.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'high-quality-voice',
    name: 'High-Quality AI Voice',
    group: 'voice',
    plain: 'Natural, high-quality AI voice that holds a real conversation rather than sounding like a menu.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'voice-cloning',
    name: 'Voice Cloning',
    group: 'voice',
    plain: 'Use a cloned voice for your brand, alongside preset voices.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'multi-language',
    name: 'Multi-Language Support',
    group: 'voice',
    plain: 'Run campaigns in more than one language with fluent AI voices.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'address-capturing',
    name: 'Address Capturing',
    group: 'qualification',
    plain: 'Collect the address or service-location details a campaign needs while the call is live, so the closer has it on the transfer.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'pc-dialer-integration',
    name: 'PC Dialer Integration',
    group: 'integration',
    plain: 'Designed to integrate with the existing PC dialer workflow your call center already runs. An officially supported integration.',
    primary: true,
    status: 'confirmed',
    provenance: 'confirmed-requirement',
  },

  /* ---- Secondary: exists and is documented, but NOT a selling point ---- */
  {
    id: 'warm-handoff-context',
    name: 'Warm Handoff Context',
    group: 'handoff',
    plain: 'Context such as the qualification criteria met and the last thing the lead confirmed can accompany the handoff.',
    primary: false,
    status: 'secondary',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'disposition-webhooks',
    name: 'Disposition Webhooks',
    group: 'outcomes',
    plain: 'Disposition data can be sent out via webhooks. Existing functionality — not currently a highlighted capability.',
    primary: false,
    status: 'secondary',
    provenance: 'confirmed-requirement',
  },
];

/**
 * Explicitly NOT capabilities. Kept in the file so a later phase cannot
 * reintroduce them by accident.
 */
export const rejectedCapabilities = {
  items: [
    {
      name: 'Calendar Scheduling',
      reason: 'Not a confirmed product capability. Currently advertised on the homepage and must be removed from any canonical feature list.',
    },
    {
      name: 'Native Zapier / Salesforce / HubSpot integrations',
      reason: 'Must not be advertised as a confirmed feature. No implementation or documentation supports it.',
    },
    {
      name: 'API & Webhooks as a headline capability',
      reason: 'Existing webhook/disposition functionality may stay where already implemented and documented, but the marketing claim must not be expanded.',
    },
  ],
  provenance: 'confirmed-requirement' as const,
} as const;

/* ================================================================== *
 * 7. INDUSTRIES
 * ================================================================== */

export type Industry = {
  id: string;
  name: string;
  /** The three highlighted industries are `primary`. */
  tier: 'primary' | 'example';
  /** Existing route, if the industry already has a page. */
  href?: string;
  /** Only set where the repo or the confirmed requirements actually state these. */
  firstQuestions?: string[];
  /** Why this industry is in the list. Also surfaces content gaps for phase 2. */
  note: string;
  provenance: Provenance;
};

/** The three highlighted industries. These take priority in all navigation and messaging. */
export const primaryIndustries: Industry[] = [
  {
    id: 'call-centers',
    name: 'Call Centers',
    tier: 'primary',
    note: 'The core audience. The product is designed for call-center operations and the whole flow assumes agents, a PC dialer, and closers.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'restaurants',
    name: 'Restaurants',
    tier: 'primary',
    note: 'Highlighted industry. No page, example, or content exists anywhere in the repo yet — this is net-new content for phase 2.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'truck-dispatch',
    name: 'Truck Dispatch',
    tier: 'primary',
    href: '/solutions/truck-dispatch-bot',
    firstQuestions: ['Equipment or load type', 'Lane or geography', 'Timing', 'Availability'],
    note: 'Highlighted industry with an existing dedicated page. The page stays; its positioning should be brought in line with the canonical flow.',
    provenance: 'confirmed-requirement',
  },
];

/**
 * Retained as examples / use cases where relevant. NOT to be promoted above the
 * three primary industries. Existing pages must not be deleted.
 */
export const exampleIndustries: Industry[] = [
  {
    id: 'aca',
    name: 'ACA',
    tier: 'example',
    href: '/solutions/aca-voice-bot',
    note: 'Existing dedicated page, currently the most-developed vertical on the site. Keep the page and its URL. Demote to an example; do not delete or redirect.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'fe',
    name: 'FE (Final Expense)',
    tier: 'example',
    note: 'Grouped with the ACA page in existing content.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'hi',
    name: 'HI (Health Insurance)',
    tier: 'example',
    note: 'Grouped with the ACA page in existing content.',
    provenance: 'confirmed-requirement',
  },
];

/**
 * Industries currently on the homepage that are NOT part of the confirmed model.
 * Retained here purely as a removal checklist for phase 2. Real Estate, Solar &
 * Home Services, Recruiting, Debt Collection and Medical Offices must not replace
 * the three highlighted industries.
 */
export const industriesToRemoveFromHomepage = [
  'Real Estate',
  'Solar & Home Services',
  'Recruiting',
  'Insurance',
  'Debt Collection',
  'Medical Offices',
];

/* ================================================================== *
 * 8. GLOSSARY
 * ================================================================== */

export type GlossaryTerm = {
  id: string;
  term: string;
  aliases: string[];
  /** Plain-English meaning. First-use explanations in copy should reuse this. */
  plain: string;
  provenance: Provenance;
};

export const glossary: GlossaryTerm[] = [
  {
    id: 'bot',
    term: 'AI Voice Bot',
    aliases: ['bot', 'AI bot', 'voice bot', 'Dialer Bot'],
    plain: 'An AI voice agent/bot that handles calls as part of the call-center workflow: it opens the conversation, runs the script, detects who answered, qualifies the lead, and live-transfers qualified calls to a human closer.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'pc-dialer',
    term: 'PC Dialer',
    aliases: ['PC dialer', 'dialer', 'calling software', 'calling system'],
    plain: 'The desktop calling software your call center already uses to dial calls. Dialer Bot is designed to work with it rather than replace it.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'closer',
    term: 'Human Closer',
    aliases: ['closer', 'agent', 'human agent', 'salesperson'],
    plain: 'The person who takes a qualified live transfer and completes the actual sale, including verification, paperwork and final closing.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'qualification',
    term: 'Qualification',
    aliases: ['qualification', 'qualify', 'qualification criteria', 'eligibility', 'required questions'],
    plain: 'Asking the questions a campaign requires to decide whether a lead meets the criteria and is interested enough to pass to a human.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'live-transfer',
    term: 'Live Transfer',
    aliases: ['live transfer', 'warm handoff', 'transfer', 'XFER'],
    plain: 'Handing the call straight to the human closer while the caller is still on the line — not a blind hold, and not a callback.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'disposition',
    term: 'Disposition',
    aliases: ['disposition', 'call status', 'call outcome'],
    plain: dispositionPlainEnglish,
    provenance: 'confirmed-requirement',
  },
  {
    id: 'call-detection',
    term: 'Call Detection',
    aliases: ['call detection', 'human detection', 'automated response'],
    plain: 'Working out whether a real person answered, or whether the call hit voicemail, an answering machine, or a honeypot.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'honeypot',
    term: 'Honeypot',
    aliases: ['honeypot', 'automated response', 'bot answer'],
    plain: 'An automated system that answers calls. The bot detects these so they are not counted as real leads.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'dnc',
    term: 'DNC',
    aliases: ['DNC', 'Do Not Call'],
    plain: 'Do Not Call. The system checks whether a number is on a Do Not Call list before proceeding, and does not proceed with the call where applicable.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'voice-cloning',
    term: 'Voice Cloning',
    aliases: ['voice cloning', 'cloned voice', 'preset voices'],
    plain: 'Using a cloned voice for your brand, as well as the preset AI voices.',
    provenance: 'confirmed-requirement',
  },
];

/* ================================================================== *
 * 9. INTEGRATIONS
 * ================================================================== */

export type Integration = {
  id: string;
  name: string;
  kind: 'dialer' | 'telephony';
  /** Officially supported and safe to state publicly? */
  officiallySupported: boolean;
  /** May this be named publicly? */
  publiclyNameable: boolean;
  note: string;
  provenance: Provenance;
};

export const integrations: Integration[] = [
  {
    id: 'pc-dialer',
    name: 'PC Dialer',
    kind: 'dialer',
    officiallySupported: true,
    publiclyNameable: true,
    note: 'The officially supported integration. Dialer Bot is designed to integrate with the existing PC dialer workflow the call center already runs.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'sip',
    name: 'SIP',
    kind: 'telephony',
    officiallySupported: false,
    publiclyNameable: true,
    note: 'Referenced in existing content as a connection path. Telephony / SIP costs are separate from the per-bot software price.',
    provenance: 'confirmed-requirement',
  },
  {
    id: 'vicidial',
    name: 'Vicidial',
    kind: 'dialer',
    officiallySupported: false,
    publiclyNameable: false,
    note: 'Not confirmed as supported. It appears only in a decorative mock. Remove the Vicidial branding from marketing-facing content and mockups rather than implying official support.',
    provenance: 'confirmed-requirement',
  },
];

/** Dialer / telephony costs sit outside the per-bot software fee. */
export const pricingExcludes = {
  items: ['Phone line costs', 'Telephony', 'SIP'],
  plain: 'The per-bot price is for the software. Phone line costs, telephony and SIP are separate and depend on your current setup.',
  provenance: 'confirmed-requirement' as const,
} as const;

/* ================================================================== *
 * 10. PRICING + BOT DEFINITION
 * ================================================================== */

export const pricing = {
  currency: 'USD',
  cadence: 'per month',

  /** Reference published price. */
  reference: {
    amount: 35,
    unit: 'per bot',
    cadence: 'per month',
    display: '$35 per bot per month',
  },

  /**
   * Larger customers may receive volume pricing. These are the confirmed
   * reference points, not a published price list.
   */
  volume: {
    available: true,
    /** Approximate per-bot monthly figures depending on customer size. */
    indicativeRates: [30, 25, 22],
    display: 'Volume pricing available for larger customers — from around $30 down to about $22 per bot per month depending on size.',
    /** Must not be published as a fixed price list or a guaranteed rate. */
    caveat: 'Indicative only. Final volume pricing depends on customer size and is agreed directly.',
  },

  /** A call center may operate many bots. */
  scaleExample: {
    text: '100 bots × $35/month = $3,500/month before any volume discount.',
    bots: 100,
    monthlyAtReference: 3500,
  },

  /**
   * The bot, defined at business level only.
   *
   * This is deliberately vague on purpose. Do not replace it with "one concurrent
   * phone channel", "one campaign workflow", or "one worker instance" — none of
   * those are proven by the existing code or content.
   */
  bot: {
    unit: 'bot',
    unitDefinition: 'An AI voice agent/bot that handles calls as part of the call-center workflow.',
    /** Relationship to human agents, stated without inventing a ratio. */
    relationshipToAgents:
      'The number of bots is related to the number of active agents and call-center capacity, but bots do NOT necessarily equal the number of human agents.',
    example: 'A call center with 100 agents might use around 60–70 bots, depending on its operation.',
    provenance: 'confirmed-requirement' as const,
  },

  /**
   * Guard for future edits. Read before changing any pricing copy.
   */
  doNotInvent: [
    'Do not define a bot as "one concurrent phone channel".',
    'Do not define a bot as "one campaign workflow".',
    'Do not define a bot as "one worker instance" or "one seat".',
    'Do not state a fixed, guaranteed volume price list.',
    'Do not state a precise bots-to-agents ratio as a rule.',
  ],

  /** Plan structure as it exists on the site today. */
  plans: [
    { id: 'starter', name: 'Starter', price: '$35 per bot per month', bestFor: 'Testing a campaign or getting a first bot live' },
    { id: 'enterprise', name: 'Enterprise', price: 'Custom — quoted directly', bestFor: 'Larger call centers running many bots, where volume pricing applies' },
  ],

  provenance: 'confirmed-requirement' as const,
} as const;

/* ================================================================== *
 * 11. ROLE BOUNDARY — the bot is not the salesperson
 * ================================================================== */

export const roleBoundary = {
  botDoes: [
    'Makes and handles the opening conversation',
    'Runs the business-specific script',
    'Detects voicemail, answering machines and honeypots',
    'Asks the qualification questions',
    'Decides whether a lead qualifies and is interested',
    'Live-transfers qualified calls',
    'Records the disposition',
  ],
  closerDoes: [
    'Takes the qualified live call',
    'Verifies the customer',
    'Handles paperwork',
    'Completes and closes the deal',
  ],
  plain: 'The AI voice bot is not the final salesperson. It handles the opening conversation and qualification; a human closer completes the sale.',
  provenance: 'confirmed-requirement' as const,
} as const;

/* ================================================================== *
 * 12. RESOLVED DECISIONS — the Phase 0 conflicts, now closed
 * ================================================================== */

export type ResolvedDecision = {
  id: string;
  topic: string;
  decision: string;
  basis: 'confirmed-requirement' | 'repo-evidence';
  repoEvidence?: SourceRef[];
};

export const resolvedDecisions: ResolvedDecision[] = [
  { id: 'C1', topic: 'Product definition', decision: 'AI voice bot for call-center operations. See `definition`.', basis: 'confirmed-requirement' },
  { id: 'C2', topic: 'Product category word', decision: 'Primary descriptor is "AI voice bot". "Assistant" and "platform" must not be the main definition.', basis: 'confirmed-requirement' },
  { id: 'C3', topic: 'Brand spelling', decision: 'Primary brand is "Dialer Bot". "DialerBot" retained as the machine-readable alternate only.', basis: 'confirmed-requirement', repoEvidence: [{ file: 'src/data/site.ts', lines: '3' }, { file: 'src/data/seo.ts', lines: '62' }] },
  { id: 'C4', topic: 'Transfer terminology', decision: 'Use "live transfer" and "warm handoff". Stop using "warm transfer" as a random alternate.', basis: 'confirmed-requirement' },
  { id: 'C5', topic: 'Capability list', decision: 'The confirmed capabilities above. Calendar Scheduling removed. API/Webhooks demoted to secondary. Voice cloning, multi-language, and address capturing confirmed as supported.', basis: 'confirmed-requirement' },
  { id: 'C6', topic: 'Industry list', decision: 'Primary industries are Call Centers, Restaurants, Truck Dispatch. ACA/FE/HI retained as examples. Home industries removed.', basis: 'confirmed-requirement' },
  { id: 'C7', topic: 'What a bot is', decision: 'Business-level definition only. Bots relate to agent count but do not equal it. Technical concurrency definition deliberately omitted.', basis: 'confirmed-requirement' },
  { id: 'C8', topic: 'Dialer integration', decision: 'PC dialer is the officially supported integration. Vicidial is not claimed publicly and its mock branding should be removed.', basis: 'confirmed-requirement' },
  { id: 'C9', topic: 'Home use-case rows', decision: 'Rows that describe setup or campaign management are features, not use cases. Relabel rather than delete.', basis: 'repo-evidence', repoEvidence: [{ file: 'src/pages/index.astro', lines: '102-155' }] },
  { id: 'C10', topic: 'Leftover brand name', decision: '"Contactivity" in public files is wrong and should be corrected to the Dialer Bot team.', basis: 'repo-evidence', repoEvidence: [{ file: 'public/llms.txt', lines: '14' }, { file: 'src/db/db.ts', lines: '9' }] },
  { id: 'C12', topic: 'Frontliner terminology', decision: 'Rejected. Not introduced anywhere. Use "AI voice bot" and "human closer".', basis: 'confirmed-requirement' },
  {
    id: 'C11',
    topic: 'Demo scope',
    decision: 'STILL OPEN — not addressed by the confirmed requirements. What demo.dialerbot.online demonstrates is still undescribed anywhere in the repo.',
    basis: 'repo-evidence',
    repoEvidence: [
      { file: 'src/data/site.ts', lines: '31-44' },
      { file: 'src/components/DemoSticky.astro', lines: '9-10', note: 'Only hint: "Qualify a call in the demo — then WhatsApp to buy."' },
    ],
  },
];

/* ================================================================== *
 * 13. SITE CONFLICTS — what phase 2 must change
 * ================================================================== */

/**
 * Every place the live website still contradicts the model above.
 * Ordered roughly by impact. This is the phase 2 worklist.
 */
export type SiteConflict = {
  id: string;
  file: string;
  lines: string;
  /** What the site says now. */
  current: string;
  /** What it should say, per the confirmed model. */
  should: string;
  /** How risky the change is for existing search traffic. */
  risk: 'low' | 'medium' | 'high';
  note?: string;
};

export const siteConflicts: SiteConflict[] = [
  /* ---- Definition + terminology ---- */
  {
    id: 'SC01',
    file: 'src/pages/index.astro',
    lines: '16',
    current: '"DialerBot is an AI assistant for call centers. It makes the first call, and your human agents only talk to the people who are interested."',
    should: 'AI voice bot for call-center operations.',
    risk: 'low',
    note: 'Also drives the homepage meta description.',
  },
  {
    id: 'SC02',
    file: 'src/data/seo.ts',
    lines: '7',
    current: 'DEFAULT_DESCRIPTION uses "AI outbound calling bot" and "warm-transfers".',
    should: 'Use definitionMeta.text. Site-wide default for any page without its own description.',
    risk: 'medium',
    note: 'Site-wide blast radius — check which pages rely on the default.',
  },
  {
    id: 'SC03',
    file: 'src/pages/faqs.astro',
    lines: '18',
    current: 'Definition lists "call centers, truck dispatch, ACA, FE, and HI" and says "warm-handoffs".',
    should: 'Use definitionLong. Industries: Call Centers, Restaurants, Truck Dispatch, with ACA/FE/HI as examples.',
    risk: 'low',
    note: 'This is the FAQ entry that renders open by default, so it is high-visibility.',
  },
  {
    id: 'SC04',
    file: 'src/pages/company.astro',
    lines: '76',
    current: '"DialerBot is a smart AI phone system."',
    should: 'AI voice bot for call-center operations.',
    risk: 'low',
  },
  {
    id: 'SC05',
    file: 'src/components/Footer.astro',
    lines: '74',
    current: '"Dialer Bot is the AI voice platform " (line continues) "that turns cold dials into warm handoffs"',
    should: 'AI voice bot language; "live transfer" / "warm handoff".',
    risk: 'low',
    note: 'The same "AI voice platform" wording is repeated at Footer.astro:34 inside the LLM copy block.',
  },
  {
    id: 'SC06',
    file: 'src/components/Footer.astro',
    lines: '120',
    current: '"AI voice bots for call centers, dispatch, ACA, FE, and HI"',
    should: 'Call Centers, Restaurants, Truck Dispatch (+ ACA/FE/HI as examples).',
    risk: 'low',
  },

  /* ---- Homepage flow ---- */
  {
    id: 'SC07',
    file: 'src/pages/index.astro',
    lines: '35-66',
    current: '6 numbered steps, none of them call detection; step 5 is a blind "transfer to your sales team".',
    should: 'productFlow — the canonical 6 stages including Detection & Qualification.',
    risk: 'medium',
  },
  {
    id: 'SC08',
    file: 'src/pages/index.astro',
    lines: '30-31',
    current: '"Your team closes the deal" — "the AI transfers the call to your human agent along with all the details it gathered." No mention of verification, paperwork, or final closing.',
    should: 'roleBoundary.closerDoes.',
    risk: 'low',
  },

  /* ---- Homepage capabilities ---- */
  {
    id: 'SC09',
    file: 'src/pages/index.astro',
    lines: '159',
    current: '"Calendar Scheduling" advertised as a feature.',
    should: 'REMOVE. Not a confirmed capability.',
    risk: 'low',
    note: 'Also appears nowhere else, so removal is contained.',
  },
  {
    id: 'SC10',
    file: 'src/pages/index.astro',
    lines: '161',
    current: '"API & Webhooks — Connect seamlessly to Zapier, Salesforce, HubSpot".',
    should: 'Remove the native integration claim. Disposition webhooks may stay only as secondary functionality.',
    risk: 'low',
    note: 'This is the only place any third-party product is named in prose.',
  },
  {
    id: 'SC11',
    file: 'src/pages/index.astro',
    lines: '160',
    current: '"Multi-Language Support" present on Home only, absent from /features.',
    should: 'Confirmed capability — promote into the canonical list and surface on /features too.',
    risk: 'low',
  },
  {
    id: 'SC12',
    file: 'src/pages/index.astro',
    lines: '162',
    current: '"Voice Cloning" present on Home only, absent from /features.',
    should: 'Confirmed capability — promote into the canonical list and surface on /features too.',
    risk: 'low',
  },
  {
    id: 'SC13',
    file: 'src/pages/index.astro',
    lines: '164',
    current: '"DNC Compliance — Automatically respect Do Not Call lists and handle opt-out requests instantly."',
    should: 'DNC means Do Not Call; the system checks the list before proceeding and does not proceed where applicable. Do not weaken to generic "compliance".',
    risk: 'low',
  },
  {
    id: 'SC14',
    file: 'src/pages/index.astro',
    lines: '165',
    current: '"Custom Analytics" is on Home but the rest of the site has no equivalent.',
    should: 'Align with the canonical capability list.',
    risk: 'low',
  },

  /* ---- Industries ---- */
  {
    id: 'SC15',
    file: 'src/pages/index.astro',
    lines: '168-175',
    current: '6 industries: Real Estate, Solar & Home Services, Recruiting, Insurance, Debt Collection, Medical Offices.',
    should: 'Call Centers, Restaurants, Truck Dispatch. ACA/FE/HI may appear as examples where relevant.',
    risk: 'high',
    note: 'Do not replace these with the three primary industries without checking Search Console first — these may hold long-tail rankings. Highest-risk item in this list.',
  },

  /* ---- Features page ---- */
  {
    id: 'SC16',
    file: 'src/pages/features.astro',
    lines: '14-15, 17-58',
    current: 'Line 15 defines the product as helping "build, run, and track AI phone campaigns". The 8-item matrix has no call detection, no dispositions, no DNC, no voice, and no PC dialer integration.',
    should: 'Rebuild around the confirmed capability list.',
    risk: 'medium',
  },
  {
    id: 'SC17',
    file: 'src/pages/features.astro',
    lines: '35-36',
    current: '"Smooth Transfers"',
    should: '"Live Transfer" / "Warm Handoff".',
    risk: 'low',
  },
  {
    id: 'SC18',
    file: 'src/pages/features.astro',
    lines: '40-42',
    current: '"Easy Connection — Link DialerBot right into the calling software you already use."',
    should: '"PC Dialer Integration" — state that it is an officially supported integration.',
    risk: 'low',
  },

  /* ---- Pricing ---- */
  {
    id: 'SC19',
    file: 'src/pages/pricing.astro',
    lines: '201, 204',
    current: 'Line 201: "$35 / bot" with no "per month". Line 204: "or launching your first AI agent".',
    should: '"$35 per bot per month". Remove "AI agent" — a bot is not an agent. Add the business-level bot definition.',
    risk: 'medium',
    note: 'Money page. Text-only change, keep URL and layout.',
  },
  {
    id: 'SC20',
    file: 'src/pages/pricing.astro',
    lines: '148, 150',
    current: 'Line 148: "per bot - software" (no cadence). Line 150: "Perfect for one campaign."',
    should: 'Include "per month" and pricing.bot.unitDefinition. The "one campaign" framing is the technical definition that must not be used.',
    risk: 'low',
  },
  {
    id: 'SC21',
    file: 'src/pages/pricing.astro',
    lines: '38-52',
    current: '13-row comparison. Volume pricing exists as an Enterprise-only row (line 51) and "Special pricing for high volume" appears at line 35, but the indicative $30 / $25 / $22 rates are never given. No disposition, call-detection, or DNC rows.',
    should: 'Keep the existing volume-pricing row, add the indicative rates as copy, and align the rows with the canonical capability list.',
    risk: 'medium',
  },
  {
    id: 'SC22',
    file: 'src/pages/pricing.astro',
    lines: '30, 49',
    current: 'Line 30: "Connects with any tool" in enterpriseIncludes. Line 49: "Custom Connections" as an Enterprise-only comparison row.',
    should: 'Keep only as secondary. Do not imply native CRM or third-party integrations.',
    risk: 'low',
  },

  /* ---- FAQs ---- */
  {
    id: 'SC23',
    file: 'src/pages/faqs.astro',
    lines: '77-78',
    current: '"Which dialers do you support?" → "Confirm your stack on WhatsApp before you buy."',
    should: 'State that PC dialer is an officially supported integration.',
    risk: 'low',
  },
  {
    id: 'SC24',
    file: 'src/pages/faqs.astro',
    lines: '29-31',
    current: '"What is warm handoff vs cold transfer?" — terminology only.',
    should: 'Reframe around "live transfer" as the core capability.',
    risk: 'low',
  },
  {
    id: 'SC25',
    file: 'src/pages/faqs.astro',
    lines: '65-66',
    current: '"How much does Dialer Bot cost?" → "$35 USD per bot. Multi-bot floors and custom compliance are quoted as enterprise on WhatsApp." No per-month cadence, no volume rates, no bot definition.',
    should: 'pricing.reference, pricing.volume, pricing.bot.',
    risk: 'low',
  },
  {
    id: 'SC26',
    file: 'src/pages/faqs.astro',
    lines: '—',
    current: 'No FAQ covers call detection, dispositions, DNC, voice cloning, multi-language, or restaurants.',
    should: 'Add questions for each. FAQPage schema will pick them up automatically.',
    risk: 'low',
    note: 'Highest-leverage addition for AIO / AI-search visibility.',
  },

  /* ---- Solutions ---- */
  {
    id: 'SC27',
    file: 'src/data/solutions.ts',
    lines: '19-64',
    current: 'ACA is the first and most developed solution entry.',
    should: 'Retain ACA as an example use case. Do not delete the page or change its URL.',
    risk: 'high',
    note: 'Indexed, 19 inbound links, FAQPage + DefinedTerm schema.',
  },
  {
    id: 'SC28',
    file: 'src/data/solutions.ts',
    lines: '113-115',
    current: '"Warm Handoff for Calling Floors" is a solution page, not an industry.',
    should: 'Keep the URL and the phrase. Reframe around live transfer.',
    risk: 'medium',
  },
  {
    id: 'SC29',
    file: 'src/pages/solutions/[slug].astro',
    lines: '—',
    current: 'No Restaurants solution page exists.',
    should: 'New page needed for a primary industry.',
    risk: 'low',
    note: 'New URL only — no existing traffic at risk.',
  },

  /* ---- Nav ---- */
  {
    id: 'SC30',
    file: 'src/components/Header.astro',
    lines: '5-10',
    current: '6 items: Features, Pricing, Careers, Blog, Company, Contact. No Solutions, so Truck Dispatch is footer-only.',
    should: 'Expose the primary industries in the header.',
    risk: 'medium',
    note: 'Header renders on every page. Needs careful styling so layout does not shift.',
  },
  {
    id: 'SC31',
    file: 'src/components/Footer.astro',
    lines: '13-15',
    current: 'Solution links: ACA voice bot, Truck dispatch bot, Warm handoff.',
    should: 'Lead with Call Centers, Restaurants, Truck Dispatch. Keep existing links.',
    risk: 'low',
  },

  /* ---- Changelog ---- */
  {
    id: 'SC32',
    file: 'src/pages/changelog.astro',
    lines: '13-55',
    current: '5 releases, none covering call detection, dispositions, voice cloning, or multi-language.',
    should: 'Record these as shipped capabilities so the changelog matches the canonical model.',
    risk: 'low',
  },

  /* ---- Mocks ---- */
  {
    id: 'SC33',
    file: 'src/components/FeatureConsoleMock.astro',
    lines: '236',
    current: 'Sync-mock node labelled "Vicidial".',
    should: 'Relabel to "PC Dialer".',
    risk: 'low',
    note: 'Mock only, not indexed content. Removes the last public implication of Vicidial support.',
  },
  {
    id: 'SC34',
    file: 'src/components/FeatureConsoleMock.astro',
    lines: '254',
    current: '"matched · Vicidial"',
    should: 'Remove the Vicidial reference.',
    risk: 'low',
  },
  {
    id: 'SC35',
    file: 'src/components/HeroOrbitMock.astro',
    lines: '14',
    current: 'Pipeline stages: Rapport → Pitch + subsidy → Coverage gate → Consent → Warm transfer. No detection or disposition.',
    should: 'Align the visible stages with productFlow.',
    risk: 'low',
  },

  /* ---- Legal / policy ---- */
  {
    id: 'SC36',
    file: 'src/pages/terms.astro',
    lines: '34',
    current: 'Customer responsibilities include "Responsibility for scripts, consent, quiet hours, and industry rules."',
    should: 'Consistent with DNC being a product capability. Needs legal review before changing.',
    risk: 'high',
    note: 'Legal text. Do not edit without explicit sign-off.',
  },
  {
    id: 'SC37',
    file: 'src/pages/terms.astro',
    lines: '26',
    current: '"Starter bots are $35 USD per bot" — no cadence, no bot definition.',
    should: 'pricing.reference.display and pricing.bot.unitDefinition.',
    risk: 'medium',
  },

  /* ---- AI / machine-readable files ---- */
  {
    id: 'SC38',
    file: 'public/llms.txt',
    lines: '3',
    current: 'Old definition listing "call centers, truck dispatch, ACA, FE, and HI".',
    should: 'definition + flowSummary + primaryIndustries.',
    risk: 'low',
    note: 'Primary file for AI/LLM discovery. Highest AIO leverage on the site.',
  },
  {
    id: 'SC39',
    file: 'public/llms.txt',
    lines: '14',
    current: '"About Contactivity / Dialer Bot team in Islamabad"',
    should: '"About the Dialer Bot team in Islamabad".',
    risk: 'low',
    note: 'Public file naming a different company.',
  },
  {
    id: 'SC40',
    file: 'public/llms-full.txt',
    lines: '7',
    current: 'Old definition; no detection, dispositions, PC dialer or new industries.',
    should: 'definitionLong, flowSummary, capabilities, primaryIndustries, pricing.',
    risk: 'low',
  },
  {
    id: 'SC41',
    file: 'public/humans.txt',
    lines: '3',
    current: '"AI voice bots for calling floors."',
    should: 'definition short form + flowSummary + primaryIndustries.',
    risk: 'low',
  },
  {
    id: 'SC42',
    file: 'src/db/db.ts',
    lines: '9',
    current: 'RECRUITER_NAME default is "Contactivity Talent".',
    should: 'Align with the Dialer Bot brand. Env-overridable, so low urgency.',
    risk: 'low',
  },
  {
    id: 'SC43',
    file: 'src/pages/contact.astro',
    lines: '150',
    current: '"Campaign list (ACA, FE, HI, dispatch.)"',
    should: 'Include restaurants and reference the PC dialer. Keep the existing examples.',
    risk: 'low',
  },
];

/* ================================================================== *
 * 14. HELPERS
 * ================================================================== */

export function getFlowStep(id: string) {
  return productFlow.find((s) => s.id === id);
}

export function getCapability(id: string) {
  return capabilities.find((c) => c.id === id);
}

export function getDetection(id: DetectionKind) {
  return callDetection.find((d) => d.id === id);
}

export function getGlossaryTerm(id: string) {
  return glossary.find((g) => g.id === id);
}

export function getIndustry(id: string) {
  return [...primaryIndustries, ...exampleIndustries].find((i) => i.id === id);
}

export function getIntegration(id: string) {
  return integrations.find((i) => i.id === id);
}

/** Capabilities safe to use in headline/feature marketing. */
export const primaryCapabilities = capabilities.filter((c) => c.primary);

/** Confirmed capabilities that should not appear in primary marketing lists. */
export const secondaryCapabilities = capabilities.filter((c) => c.status === 'secondary');

/** Site conflicts grouped by risk, for planning the phase 2 rollout. */
export const siteConflictsByRisk = {
  high: siteConflicts.filter((c) => c.risk === 'high'),
  medium: siteConflicts.filter((c) => c.risk === 'medium'),
  low: siteConflicts.filter((c) => c.risk === 'low'),
} as const;
