import type { APIRoute } from 'astro';
import { dbGet, ensureDb } from '../../db/db';
import { getSessionUser } from '../../lib/portal/auth';
import { openUploadStream } from '../../lib/portal/uploads';

export const prerender = false;

type CertRow = { path: string; originalName?: string };

function resolveStoredPath(
  app: {
    resume_path: string | null;
    certifications_json: string | null;
  },
  url: URL,
): string | null {
  const file = (url.searchParams.get('file') || '').toLowerCase();
  if (file === 'resume') {
    return app.resume_path;
  }
  if (file === 'cert') {
    const idx = Number(url.searchParams.get('i') || 0);
    try {
      const certs = JSON.parse(app.certifications_json || '[]') as CertRow[];
      return certs[idx]?.path || null;
    } catch {
      return null;
    }
  }

  // Legacy links that still pass ?path=… (kept so old bookmarks keep working).
  const legacyPath = url.searchParams.get('path') || '';
  if (!legacyPath) return null;
  const allowed = new Set<string>();
  if (app.resume_path) allowed.add(app.resume_path);
  try {
    const certs = JSON.parse(app.certifications_json || '[]') as CertRow[];
    for (const c of certs) if (c?.path) allowed.add(c.path);
  } catch {
    /* ignore */
  }
  return allowed.has(legacyPath) ? legacyPath : null;
}

export const GET: APIRoute = async ({ request, url }) => {
  await ensureDb();
  const session = await getSessionUser(request);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const appId = Number(url.searchParams.get('app') || 0);
  if (!appId) {
    return new Response('Missing application', { status: 400 });
  }

  const app = await dbGet<{
    id: number;
    applicant_id: number;
    resume_path: string | null;
    certifications_json: string | null;
    recruiter_id: number;
  }>(
    `
    SELECT a.id, a.applicant_id, a.resume_path, a.certifications_json, j.recruiter_id
    FROM applications a
    JOIN jobs j ON j.id = a.job_id
    WHERE a.id = ?
  `,
    [appId],
  );

  if (!app) return new Response('Not found', { status: 404 });

  const isOwner = session.id === app.applicant_id;
  const isRecruiter = session.role === 'recruiter' && session.id === app.recruiter_id;
  if (!isOwner && !isRecruiter) {
    return new Response('Forbidden', { status: 403 });
  }

  const filePath = resolveStoredPath(app, url);
  if (!filePath) {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const file = await openUploadStream(filePath);
    const headers: Record<string, string> = {
      'Content-Type': file.contentType,
      'Content-Disposition': `attachment; filename="${file.filename.replace(/"/g, '')}"`,
      'Cache-Control': 'private, no-store',
      'X-Content-Type-Options': 'nosniff',
    };
    if (file.size != null) headers['Content-Length'] = String(file.size);
    return new Response(file.stream, { headers });
  } catch {
    return new Response('File missing', { status: 404 });
  }
};
