export function parseDbDate(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function timeAgo(iso: string | null | undefined) {
  const d = parseDbDate(iso);
  if (!d) return 'Recently';
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDate(iso: string | null | undefined) {
  const d = parseDbDate(iso);
  if (!d) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(iso: string | null | undefined) {
  const d = parseDbDate(iso);
  if (!d) return '—';
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

export function isActiveToday(iso: string | null | undefined) {
  const d = parseDbDate(iso);
  if (!d) return false;
  return Date.now() - d.getTime() < 24 * 60 * 60 * 1000;
}

export function greeting(name: string) {
  const h = new Date().getHours();
  const bit = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `${bit}, ${name.split(' ')[0]}`;
}

export const APP_STATUSES = ['pending', 'reviewing', 'interview', 'rejected', 'hired'] as const;
export type AppStatus = (typeof APP_STATUSES)[number];

export function statusLabel(s: string) {
  const map: Record<string, string> = {
    pending: 'Processing',
    reviewing: 'Forwarded',
    interview: 'Interview stage',
    rejected: 'Closed',
    hired: 'Selected',
  };
  return map[s] || s;
}

export function statusNote(s: string) {
  const map: Record<string, string> = {
    pending: 'Application received and queued for recruiter screening.',
    reviewing: 'Forwarded to technical team for role-fit evaluation.',
    interview: 'Interview round is in progress. Watch your email for updates.',
    rejected: 'This role is closed for now. You can still apply to other openings.',
    hired: 'You are selected for this role. Offer details follow by email.',
  };
  return map[s] || 'Status updated.';
}

export function statusStep(s: string) {
  const order = ['pending', 'reviewing', 'interview', 'hired'];
  const idx = order.indexOf(s);
  return idx >= 0 ? idx : s === 'rejected' ? -1 : 0;
}
