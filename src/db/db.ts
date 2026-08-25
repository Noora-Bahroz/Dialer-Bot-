import bcrypt from 'bcryptjs';
import { client, dbAll, dbExec, dbGet, dbRun, lastId } from './client';

function env(key: string) {
  return String(import.meta.env[key] ?? process.env[key] ?? '').trim();
}

const RECRUITER_EMAIL = (env('RECRUITER_EMAIL') || 'Query@dialerbot.online').toLowerCase();
const RECRUITER_NAME = env('RECRUITER_NAME') || 'Contactivity Talent';
const RECRUITER_PASSWORD = env('RECRUITER_PASSWORD');
const RESET_RECRUITER_PASSWORD = env('RECRUITER_RESET_PASSWORD') === 'true';
const DEV_FALLBACK_PASSWORD = 'C0ntactivity!Hire#2026$Secure';

type SeedJob = {
  niche: string;
  title: string;
  type: string;
  location: string;
  compensation: string;
  blurb: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
};

const SEED_JOBS: SeedJob[] = [
  {
    niche: 'Frontend',
    title: 'Frontend Intern (Unpaid)',
    type: 'Internship · Remote · Flexible',
    location: 'Islamabad · Remote',
    compensation: 'Unpaid internship',
    blurb:
      'Unpaid internship — ship polished pages and UI improvements on live marketing and portal surfaces with close feedback loops.',
    description:
      'Unpaid Frontend Intern role for candidates who want practical product experience. You will work on live pages, improve UX details, and learn by shipping. Apply through the portal and share your best samples.',
    responsibilities: [
      'Build and refine responsive UI sections for marketing and portal pages',
      'Implement design tweaks quickly with clean, reusable markup and CSS',
      'Fix layout issues across devices and improve interaction quality',
      'Collaborate with product and engineering on weekly release targets',
    ],
    requirements: [
      'Comfort with HTML, CSS, and modern JavaScript',
      'Basic experience with component-based frontend workflows',
      'Strong willingness to learn and iterate quickly from feedback',
      'Self-managed communication and reliable execution',
    ],
  },
  {
    niche: 'Design',
    title: 'Graphic Designer Intern (Paid)',
    type: 'Internship · Remote · Flexible',
    location: 'Islamabad · Remote',
    compensation: 'PKR 20,000 - 35,000/month (based on portfolio & skill)',
    blurb:
      'Paid internship — create on-brand visuals for Dialer Bot: social graphics, campaign assets, and marketing collateral for a calling-floor product.',
    description:
      'Dialer Bot is hiring a paid Graphic Designer Intern for remote work with flexible hours. Monthly stipend based on portfolio quality and execution speed. You will turn briefs into polished visuals for social, ads, decks, and product marketing. Share a portfolio link when you apply.',
    responsibilities: [
      'Design social posts, ad creatives, and lightweight campaign graphics',
      'Maintain visual consistency with Dialer Bot brand colors, type, and tone',
      'Prepare export-ready files for web and paid channels',
      'Iterate quickly from feedback and ship on weekly marketing cycles',
    ],
    requirements: [
      'Portfolio with marketing or brand design samples (required)',
      'Comfort with Figma, Canva, or Adobe creative tools',
      'Eye for clean B2B / SaaS visual language',
      'Self-managed, responsive over WhatsApp or email',
      'No degree required — show the work',
    ],
  },
  {
    niche: 'UI/UX',
    title: 'UI/UX Designer Intern (Unpaid)',
    type: 'Internship · Remote · Flexible',
    location: 'Islamabad · Remote',
    compensation: 'Unpaid internship',
    blurb:
      'Unpaid internship — shape flows, wireframes, and UI polish for a live voice-bot product: marketing site, careers portal, and in-product surfaces.',
    description:
      'We need a UI/UX Designer Intern who can think in user journeys and ship clear interfaces. Unpaid, remote, flexible schedule. You will wireframe flows, refine component layouts, and improve usability across dialerbot.online and internal tools. Apply with a portfolio or case study link.',
    responsibilities: [
      'Wireframe and prototype key user flows for marketing and portal pages',
      'Improve layout hierarchy, spacing, and mobile usability',
      'Document UX decisions and hand off specs to engineering',
      'Run quick usability passes and iterate from real feedback',
    ],
    requirements: [
      'Portfolio with UI/UX case studies or shipped screens (required)',
      'Comfort with Figma (or similar) for wireframes and high-fidelity UI',
      'Basic understanding of responsive web patterns',
      'Clear written communication for handoffs',
      'No degree required — show how you think and ship',
    ],
  },
  {
    niche: 'Content',
    title: 'Content Creator Intern (Paid)',
    type: 'Internship · Remote · Flexible',
    location: 'Islamabad · Remote',
    compensation: 'PKR 20,000 - 35,000/month (based on writing samples & output)',
    blurb:
      'Paid internship — write and package content that explains Dialer Bot to call-center operators: blog posts, social clips, scripts, and floor-ready messaging.',
    description:
      'Dialer Bot is hiring a paid Content Creator Intern for builders who can explain technical products in plain language. Monthly stipend based on writing quality and consistency. You will draft blog posts, social copy, short video scripts, and sales-adjacent messaging for B2B call-center buyers. Remote, flexible. Apply with writing samples or a content portfolio link.',
    responsibilities: [
      'Draft blog posts, LinkedIn copy, and short-form social content',
      'Turn product features into operator-friendly explanations',
      'Support lightweight video or carousel scripts for marketing',
      'Maintain a consistent voice aligned with Dialer Bot positioning',
    ],
    requirements: [
      'Writing samples or content portfolio (required)',
      'Clear English — B2B or SaaS writing experience is a plus',
      'Comfort researching call-center, dialer, or AI voice topics',
      'Fast iteration from editorial feedback',
      'No degree required — show published or draft work',
    ],
  },
  {
    niche: 'Growth',
    title: 'Digital Marketing & Client Hunting (Commission-Based)',
    type: 'Part-time / Full-time · Remote',
    location: 'Islamabad · Remote',
    compensation: 'Commission-based',
    blurb: 'Drive outbound growth through digital marketing and direct client hunting for B2B service demand.',
    description:
      'This commission-based remote role is for self-driven people who can generate qualified B2B opportunities. You will handle outreach, inbound lead follow-up, and client conversion support in a fast-moving environment.',
    responsibilities: [
      'Run practical digital campaigns focused on lead generation',
      'Hunt and qualify new B2B prospects through outbound channels',
      'Maintain lead tracking and follow-up discipline across the funnel',
      'Coordinate with internal teams to move prospects toward close',
    ],
    requirements: [
      'Hands-on digital marketing and lead generation exposure',
      'Confidence in client outreach and relationship building',
      'Strong follow-up habits and ownership mindset',
      'Comfort with commission-based outcomes',
    ],
  },
  {
    niche: 'Sales',
    title: 'B2B Cold Calling Specialist (Commission-Based)',
    type: 'Part-time / Full-time · Remote',
    location: 'Islamabad · Remote',
    compensation: 'Commission-based',
    blurb:
      'Own B2B outbound calling, qualify decision-makers, and create pipeline opportunities through consistent outreach.',
    description:
      'We are hiring a remote B2B Cold Calling Specialist on commission. If you can confidently open conversations, handle objections, and move prospects to qualified next steps, apply through the portal.',
    responsibilities: [
      'Perform high-volume B2B cold calls with clear qualification criteria',
      'Pitch value crisply and route qualified prospects to closing steps',
      'Log outcomes accurately and optimize call scripts over time',
      'Work independently while meeting weekly activity targets',
    ],
    requirements: [
      'Proven confidence in B2B outbound calling',
      'Strong objection handling and communication skills',
      'Disciplined reporting and CRM hygiene',
      'Comfort with commission-based compensation',
    ],
  },
];

async function hasColumn(table: string, column: string) {
  const cols = await dbAll<{ name: string }>(`PRAGMA table_info(${table})`);
  return cols.some((c) => c.name === column);
}

async function addColumn(table: string, column: string, def: string) {
  if (await hasColumn(table, column)) return;
  await dbExec(`ALTER TABLE ${table} ADD COLUMN ${column} ${def}`);
}

function resolveBootstrapPassword() {
  if (RECRUITER_PASSWORD) return RECRUITER_PASSWORD;
  if (import.meta.env.DEV) return DEV_FALLBACK_PASSWORD;
  return '';
}

async function seed() {
  const row = await dbGet<{ count: number }>('SELECT COUNT(*) as count FROM users');
  if ((row?.count ?? 0) > 0) return;

  const password = resolveBootstrapPassword();
  if (!password) {
    console.warn(
      '[portal] No users yet and RECRUITER_PASSWORD is unset. Set RECRUITER_EMAIL / RECRUITER_PASSWORD to bootstrap the recruiter account.',
    );
    return;
  }

  const hash = bcrypt.hashSync(password, 10);
  const recruiter = await dbRun(
    "INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, 'recruiter', ?)",
    [RECRUITER_EMAIL, hash, RECRUITER_NAME],
  );
  const recruiterId = lastId(recruiter);

  for (let i = 0; i < SEED_JOBS.length; i++) {
    const job = SEED_JOBS[i];
    const daysAgo = `-${3 + i * 2} days`;
    await dbRun(
      `
      INSERT INTO jobs (
        recruiter_id, title, niche, type, location, compensation, blurb,
        description, responsibilities, requirements, posted_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now', ?), datetime('now'))
    `,
      [
        recruiterId,
        job.title,
        job.niche,
        job.type,
        job.location,
        job.compensation,
        job.blurb,
        job.description,
        JSON.stringify(job.responsibilities),
        JSON.stringify(job.requirements),
        daysAgo,
      ],
    );
  }
}

async function ensureRecruiterAccount() {
  const recruiter = await dbGet<{ id: number; email: string; name: string }>(
    "SELECT id, email, name FROM users WHERE role = 'recruiter' ORDER BY id ASC LIMIT 1",
  );

  if (!recruiter) {
    const password = resolveBootstrapPassword();
    if (!password) return;
    const hash = bcrypt.hashSync(password, 10);
    await dbRun("INSERT INTO users (email, password_hash, role, name) VALUES (?, ?, 'recruiter', ?)", [
      RECRUITER_EMAIL,
      hash,
      RECRUITER_NAME,
    ]);
    return;
  }

  if (recruiter.email !== RECRUITER_EMAIL || recruiter.name !== RECRUITER_NAME) {
    await dbRun('UPDATE users SET email = ?, name = ? WHERE id = ?', [
      RECRUITER_EMAIL,
      RECRUITER_NAME,
      recruiter.id,
    ]);
  }

  if (RESET_RECRUITER_PASSWORD) {
    if (!RECRUITER_PASSWORD) {
      console.warn('[portal] RECRUITER_RESET_PASSWORD=true but RECRUITER_PASSWORD is empty — skipped.');
      return;
    }
    const hash = bcrypt.hashSync(RECRUITER_PASSWORD, 10);
    await dbRun('UPDATE users SET password_hash = ? WHERE id = ?', [hash, recruiter.id]);
    console.warn('[portal] Recruiter password was reset from env. Unset RECRUITER_RESET_PASSWORD after boot.');
  }
}

async function migrateLegacyJobs() {
  const stale = await dbAll<{ id: number; title: string }>(
    "SELECT id, title FROM jobs WHERE description IS NULL OR description = ''",
  );
  for (const row of stale) {
    const seedJob = SEED_JOBS.find((j) => j.title === row.title);
    if (!seedJob) continue;
    await dbRun(
      `
      UPDATE jobs SET description = ?, responsibilities = ?, requirements = ?,
      location = ?, compensation = ?, blurb = ? WHERE id = ?
    `,
      [
        seedJob.description,
        JSON.stringify(seedJob.responsibilities),
        JSON.stringify(seedJob.requirements),
        seedJob.location,
        seedJob.compensation,
        seedJob.blurb,
        row.id,
      ],
    );
  }
}

async function syncSeedJobs() {
  const recruiter = await dbGet<{ id: number }>(
    "SELECT id FROM users WHERE role = 'recruiter' ORDER BY id ASC LIMIT 1",
  );
  if (!recruiter) return;

  for (let i = 0; i < SEED_JOBS.length; i++) {
    const job = SEED_JOBS[i];
    const rows = await dbAll<{ id: number }>('SELECT id FROM jobs WHERE title = ? ORDER BY id ASC', [job.title]);
    if (rows.length > 0) {
      const [primary, ...duplicates] = rows;
      await dbRun(
        `
        UPDATE jobs
        SET
          niche = ?,
          type = ?,
          location = ?,
          compensation = ?,
          blurb = ?,
          description = ?,
          responsibilities = ?,
          requirements = ?,
          status = 'open',
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
        [
          job.niche,
          job.type,
          job.location,
          job.compensation,
          job.blurb,
          job.description,
          JSON.stringify(job.responsibilities),
          JSON.stringify(job.requirements),
          primary.id,
        ],
      );
      for (const duplicate of duplicates) {
        await dbRun("UPDATE jobs SET status = 'closed', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
          duplicate.id,
        ]);
      }
      continue;
    }

    await dbRun(
      `
      INSERT INTO jobs (
        recruiter_id, title, niche, type, location, compensation, blurb,
        description, responsibilities, requirements, status, posted_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open', datetime('now', ?), datetime('now'))
    `,
      [
        recruiter.id,
        job.title,
        job.niche,
        job.type,
        job.location,
        job.compensation,
        job.blurb,
        job.description,
        JSON.stringify(job.responsibilities),
        JSON.stringify(job.requirements),
        `-${i} days`,
      ],
    );
  }

  const closedJobTitles = [
    'AI Engineer (Urgent Hiring)',
    'Graphic Designer Intern',
    'UI/UX Designer Intern',
    'UI/UX Designer Intern (Paid)',
    'Content Creator Intern',
    'Content Creator Intern (Unpaid)',
    'Conversation Designer',
    'Realtime Voice Platform Engineer',
    'Floor Success Specialist',
    'Calling Compliance Analyst',
    'Dialer Partnerships Lead',
    'Voice QA Reviewer',
  ];
  await dbRun(
    `
    UPDATE jobs
    SET status = 'closed', updated_at = CURRENT_TIMESTAMP
    WHERE title IN (${closedJobTitles.map(() => '?').join(',')})
  `,
    closedJobTitles,
  );
}

async function shouldSyncSeedJobs() {
  if (env('PORTAL_SYNC_SEED') === 'true') return true;
  const row = await dbGet<{ value: string }>("SELECT value FROM _portal_meta WHERE key = 'seed_sync_at'");
  if (!row?.value) return true;
  const last = Date.parse(row.value);
  if (Number.isNaN(last)) return true;
  return Date.now() - last > 60 * 60 * 1000;
}

async function markSeedSynced() {
  await dbRun(
    "INSERT INTO _portal_meta (key, value) VALUES ('seed_sync_at', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    [new Date().toISOString()],
  );
}

async function initSchema() {
  await dbExec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('applicant', 'recruiter')),
      name TEXT NOT NULL,
      headline TEXT,
      bio TEXT,
      last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_visit DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recruiter_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      niche TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT 'Islamabad / Remote',
      compensation TEXT,
      blurb TEXT NOT NULL,
      description TEXT,
      responsibilities TEXT,
      requirements TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(recruiter_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL,
      applicant_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      cover_letter TEXT,
      resume_path TEXT,
      certifications_json TEXT,
      work_mode TEXT,
      availability TEXT,
      current_salary TEXT,
      expected_salary TEXT,
      portfolio_url TEXT,
      other_links TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(job_id) REFERENCES jobs(id),
      FOREIGN KEY(applicant_id) REFERENCES users(id),
      UNIQUE(job_id, applicant_id)
    );

    CREATE TABLE IF NOT EXISTS check_ins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      checked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS saved_jobs (
      user_id INTEGER NOT NULL,
      job_id INTEGER NOT NULL,
      saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(user_id, job_id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(job_id) REFERENCES jobs(id)
    );

    CREATE TABLE IF NOT EXISTS _portal_meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const SCHEMA_VERSION = '3';
  const meta = await dbGet<{ value: string }>("SELECT value FROM _portal_meta WHERE key = 'schema_version'");
  if (meta?.value !== SCHEMA_VERSION) {
    await addColumn('users', 'headline', 'TEXT');
    await addColumn('users', 'bio', 'TEXT');
    await addColumn('users', 'last_visit', 'DATETIME');
    await addColumn('jobs', 'location', "TEXT NOT NULL DEFAULT 'Islamabad / Remote'");
    await addColumn('jobs', 'compensation', 'TEXT');
    await addColumn('jobs', 'description', 'TEXT');
    await addColumn('jobs', 'responsibilities', 'TEXT');
    await addColumn('jobs', 'requirements', 'TEXT');
    await addColumn('jobs', 'posted_at', 'DATETIME');
    await addColumn('jobs', 'updated_at', 'DATETIME');
    await addColumn('applications', 'updated_at', 'DATETIME');
    await addColumn('applications', 'resume_path', 'TEXT');
    await addColumn('applications', 'certifications_json', 'TEXT');
    await addColumn('applications', 'work_mode', 'TEXT');
    await addColumn('applications', 'availability', 'TEXT');
    await addColumn('applications', 'current_salary', 'TEXT');
    await addColumn('applications', 'expected_salary', 'TEXT');
    await addColumn('applications', 'portfolio_url', 'TEXT');
    await addColumn('applications', 'other_links', 'TEXT');
    await addColumn('applications', 'notes', 'TEXT');

    await dbExec(`
      UPDATE jobs SET posted_at = created_at WHERE posted_at IS NULL;
      UPDATE jobs SET updated_at = COALESCE(updated_at, created_at);
      UPDATE applications SET updated_at = created_at WHERE updated_at IS NULL;
    `);

    await dbRun(
      "INSERT INTO _portal_meta (key, value) VALUES ('schema_version', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
      [SCHEMA_VERSION],
    );
  }

  await seed();
  await ensureRecruiterAccount();
  if (await shouldSyncSeedJobs()) {
    await syncSeedJobs();
    await markSeedSynced();
  }

  // One-off legacy backfill — only when explicitly requested
  if (env('PORTAL_SYNC_SEED') === 'true') {
    await migrateLegacyJobs();
  }
}

let readyPromise: Promise<void> | null = null;

export function ensureDb() {
  if (!readyPromise) {
    readyPromise = initSchema().catch((err) => {
      readyPromise = null;
      throw err;
    });
  }
  return readyPromise;
}

// Kick off schema init on import (SSR cold start)
void ensureDb();

export type JobRow = {
  id: number;
  recruiter_id: number;
  title: string;
  niche: string;
  type: string;
  location: string;
  compensation: string | null;
  blurb: string;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  status: string;
  posted_at: string;
  updated_at: string;
};

export function parseJobLists(job: JobRow) {
  return {
    ...job,
    responsibilityList: job.responsibilities ? (JSON.parse(job.responsibilities) as string[]) : [],
    requirementList: job.requirements ? (JSON.parse(job.requirements) as string[]) : [],
  };
}

export async function getOpenJobs() {
  await ensureDb();
  const rows = await dbAll<JobRow>("SELECT * FROM jobs WHERE status = 'open' ORDER BY posted_at DESC");
  return rows.map(parseJobLists);
}

export async function getJob(id: number | string) {
  await ensureDb();
  const row = await dbGet<JobRow>('SELECT * FROM jobs WHERE id = ?', [id]);
  return row ? parseJobLists(row) : null;
}

export async function getRelatedJobs(jobId: number, niche: string, limit = 3) {
  await ensureDb();
  const rows = await dbAll<JobRow>(
    `
    SELECT * FROM jobs
    WHERE status = 'open' AND niche = ? AND id != ?
    ORDER BY posted_at DESC
    LIMIT ?
  `,
    [niche, jobId, limit],
  );
  return rows.map(parseJobLists);
}

export async function getCheckInStreak(userId: number) {
  await ensureDb();
  const rows = await dbAll<{ d: string }>(
    `
    SELECT date(checked_at) as d FROM check_ins
    WHERE user_id = ?
    GROUP BY date(checked_at)
    ORDER BY d DESC
    LIMIT 60
  `,
    [userId],
  );

  if (!rows.length) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < rows.length; i++) {
    const expected = new Date(today);
    expected.setDate(expected.getDate() - i);
    const expectedStr = expected.toISOString().slice(0, 10);
    if (rows[i].d === expectedStr) streak++;
    else break;
  }
  return streak;
}

export async function checkedInToday(userId: number) {
  await ensureDb();
  const row = await dbGet(
    `
    SELECT 1 as ok FROM check_ins
    WHERE user_id = ? AND date(checked_at) = date('now')
    LIMIT 1
  `,
    [userId],
  );
  return !!row;
}

export async function recordCheckIn(userId: number) {
  if (await checkedInToday(userId)) return false;
  await dbRun('INSERT INTO check_ins (user_id) VALUES (?)', [userId]);
  await dbRun("UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?", [userId]);
  return true;
}

// Re-export query helpers for pages
export { client, dbAll, dbExec, dbGet, dbRun, lastId };
