import type { APIRoute } from 'astro';
import { dbGet, ensureDb } from '../../db/db';
import { getSessionUser } from '../../lib/portal/auth';
import { isRemoteUploadPath, openUploadStream } from '../../lib/portal/uploads';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  await ensureDb();
  const session = await getSessionUser(request);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const filePath = url.searchParams.get('path') || '';
  const appId = Number(url.searchParams.get('app') || 0);
  if (!filePath || !appId) {
    return new Response('Missing file', { status: 400 });
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

  const allowed = new Set<string>();
  if (app.resume_path) allowed.add(app.resume_path);
  if (app.certifications_json) {
    try {
      const certs = JSON.parse(app.certifications_json) as { path: string }[];
      for (const c of certs) if (c?.path) allowed.add(c.path);
    } catch {
      /* ignore */
    }
  }

  if (!allowed.has(filePath)) {
    return new Response('Forbidden', { status: 403 });
  }

  // Public Vercel Blob URLs: redirect after auth (DOCX opens reliably).
  if (isRemoteUploadPath(filePath)) {
    return Response.redirect(filePath, 302);
  }

  try {
    const file = await openUploadStream(filePath);
    const headers: Record<string, string> = {
      'Content-Type': file.contentType,
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Cache-Control': 'private, no-store',
    };
    if (file.size != null) headers['Content-Length'] = String(file.size);
    return new Response(file.stream, { headers });
  } catch {
    return new Response('File missing', { status: 404 });
  }
};
