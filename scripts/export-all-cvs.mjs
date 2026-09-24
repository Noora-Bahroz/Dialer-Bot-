/**
 * Export ALL applicant CVs (DOCX/PDF) into ./ALL CVS/
 * Usage: node --env-file=.env scripts/export-all-cvs.mjs
 */
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const OUT_DIR = join(process.cwd(), 'ALL CVS');
const DATA_DIR = process.env.PORTAL_DATA_DIR?.trim() || join(process.cwd(), 'data');
const UPLOAD_ROOT = join(DATA_DIR, 'uploads');

function env(key) {
  return String(process.env[key] ?? '').trim();
}

function tursoHttpBase() {
  const raw = env('TURSO_DATABASE_URL');
  if (!raw) return null;
  if (raw.startsWith('https://')) return raw.replace(/\/$/, '');
  if (raw.startsWith('libsql://')) {
    return `https://${raw.slice('libsql://'.length).replace(/\/$/, '')}`;
  }
  return null;
}

async function tursoQuery(sql) {
  const base = tursoHttpBase();
  const token = env('TURSO_AUTH_TOKEN');
  if (!base || !token) {
    throw new Error('TURSO_DATABASE_URL and TURSO_AUTH_TOKEN required in .env');
  }

  const res = await fetch(`${base}/v2/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [{ type: 'execute', stmt: { sql } }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Turso HTTP ${res.status}: ${text.slice(0, 300)}`);
  }

  const json = await res.json();
  const result = json.results?.[0]?.response?.result;
  if (!result) return [];

  const cols = result.cols.map((c) => c.name);
  return result.rows.map((row) => {
    const obj = {};
    row.forEach((cell, i) => {
      const val = cell?.value ?? cell;
      obj[cols[i]] = val;
    });
    return obj;
  });
}

function safeName(s) {
  return String(s || 'applicant')
    .replace(/[^a-zA-Z0-9._-]+/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 80);
}

async function fetchRemote(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return Buffer.from(await res.arrayBuffer());
}

async function resolveFile(resumePath) {
  if (!resumePath) return null;
  if (/^https?:\/\//i.test(resumePath)) {
    return {
      buf: await fetchRemote(resumePath),
      ext: extname(new URL(resumePath).pathname) || '.docx',
    };
  }
  const rel = resumePath.replace(/^[/\\\\]+/, '').replace(/\.\./g, '');
  const abs = join(UPLOAD_ROOT, rel);
  if (!existsSync(abs)) return null;
  return { buf: readFileSync(abs), ext: extname(abs) || '.docx' };
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const rows = await tursoQuery(`
    SELECT
      a.id,
      a.resume_path,
      a.created_at,
      u.name AS applicant_name,
      u.email AS applicant_email,
      j.title AS job_title
    FROM applications a
    JOIN users u ON a.applicant_id = u.id
    JOIN jobs j ON a.job_id = j.id
    WHERE a.resume_path IS NOT NULL
    ORDER BY a.created_at ASC
  `);

  if (!rows.length) {
    console.log('No applications with resume_path found.');
    return;
  }

  let saved = 0;
  for (const row of rows) {
    const id = row.id;
    const name = safeName(row.applicant_name);
    const email = safeName(String(row.applicant_email || '').split('@')[0]);
    const jobTitle = safeName(row.job_title);
    const resumePath = String(row.resume_path);

    try {
      const file = await resolveFile(resumePath);
      if (!file) {
        console.warn(`Skip app ${id} (${row.applicant_name}): file missing — ${resumePath}`);
        continue;
      }
      const outName = `${String(id).padStart(3, '0')}_${jobTitle}_${name}_${email}${file.ext}`;
      writeFileSync(join(OUT_DIR, outName), file.buf);
      console.log(`Saved: ${outName}`);
      saved += 1;
    } catch (err) {
      console.error(`Failed app ${id} (${row.applicant_name}):`, err.message);
    }
  }

  console.log(`\nDone — ${saved}/${rows.length} CV(s) in "${OUT_DIR}"`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
