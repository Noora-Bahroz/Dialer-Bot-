import { join } from 'path';

/**
 * Portal SQLite + uploads root.
 * Set PORTAL_DATA_DIR to a persistent disk in production (VPS / Railway / Fly volume).
 * Local Vercel serverless filesystem is ephemeral — do not rely on it for portal data.
 */
export function getPortalDataDir() {
  const custom = (import.meta.env.PORTAL_DATA_DIR || process.env.PORTAL_DATA_DIR || '').trim();
  if (custom) return custom;
  return join(process.cwd(), 'data');
}

export function getPortalDbPath() {
  return join(getPortalDataDir(), 'portal.db');
}

export function getUploadsRoot() {
  return join(getPortalDataDir(), 'uploads');
}
