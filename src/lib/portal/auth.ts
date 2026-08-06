import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies, AstroGlobal } from 'astro';
import { dbGet, ensureDb } from '../../db/db';

export type PortalUser = {
  id: number;
  email: string;
  role: 'applicant' | 'recruiter';
  name: string;
  headline: string | null;
  bio: string | null;
  last_active: string;
  last_visit: string | null;
  created_at: string;
};

const COOKIE = 'portal_session';
const SECRET =
  String(import.meta.env.SESSION_SECRET || process.env.SESSION_SECRET || '').trim() ||
  'dialerbot-portal-dev-secret';

if (!import.meta.env.DEV && SECRET === 'dialerbot-portal-dev-secret') {
  console.warn('[portal] SESSION_SECRET is using the insecure default. Set a long random value in production.');
}

function sign(payload: { id: number; role: string }) {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = createHmac('sha256', SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verify(token: string): { id: number; role: string } | null {
  const dot = token.lastIndexOf('.');
  if (dot < 1) return null;
  const data = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac('sha256', SECRET).update(data).digest('base64url');
  try {
    if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    return JSON.parse(Buffer.from(data, 'base64url').toString()) as { id: number; role: string };
  } catch {
    return null;
  }
}

export function setSession(cookies: AstroCookies, user: { id: number; role: string }) {
  cookies.set(COOKIE, sign(user), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 60 * 60 * 24 * 14,
  });
  cookies.delete('user_id', { path: '/' });
}

export function clearSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/' });
  cookies.delete('user_id', { path: '/' });
}

export async function getSessionUser(request: Request): Promise<PortalUser | null> {
  await ensureDb();
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE}=([^;]+)`));
  const legacy = cookieHeader.match(/user_id=([^;]+)/);

  let session = match?.[1] ? verify(decodeURIComponent(match[1])) : null;
  if (!session && legacy?.[1]) {
    const id = Number(legacy[1]);
    if (Number.isFinite(id)) session = { id, role: 'applicant' };
  }
  if (!session) return null;

  const user = await dbGet<PortalUser>('SELECT * FROM users WHERE id = ?', [session.id]);
  if (!user || user.role !== session.role) return null;
  return user;
}

export async function requireRole(astro: AstroGlobal, role: 'applicant' | 'recruiter', redirectTo = '/login') {
  const user = await getSessionUser(astro.request);
  if (!user) {
    const next = encodeURIComponent(astro.url.pathname + astro.url.search);
    return { user: null, redirect: astro.redirect(`${redirectTo}?next=${next}`) };
  }
  if (user.role !== role) {
    clearSession(astro.cookies);
    return { user: null, redirect: astro.redirect(redirectTo) };
  }
  return { user, redirect: null };
}

export function safeRedirect(next: string | null, fallback: string) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return fallback;
  return next;
}
