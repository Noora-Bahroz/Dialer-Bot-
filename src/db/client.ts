import { createClient, type Client, type InArgs, type ResultSet } from '@libsql/client';
import { existsSync, mkdirSync } from 'fs';
import { getPortalDataDir, getPortalDbPath } from '../lib/portal/paths';

function env(key: string) {
  return String(import.meta.env[key] ?? process.env[key] ?? '').trim();
}

function resolveDbUrl() {
  const tursoUrl = env('TURSO_DATABASE_URL');
  if (tursoUrl) return tursoUrl;

  const dataDir = getPortalDataDir();
  if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
  // Local libSQL file for development when Turso is not configured
  return `file:${getPortalDbPath().replace(/\\/g, '/')}`;
}

export const client: Client = createClient({
  url: resolveDbUrl(),
  authToken: env('TURSO_AUTH_TOKEN') || undefined,
});

export async function dbExec(sql: string) {
  await client.executeMultiple(sql);
}

export async function dbRun(sql: string, args: InArgs = []) {
  return client.execute({ sql, args });
}

export async function dbGet<T = Record<string, unknown>>(sql: string, args: InArgs = []) {
  const rs = await client.execute({ sql, args });
  return (rs.rows[0] as T | undefined) ?? undefined;
}

export async function dbAll<T = Record<string, unknown>>(sql: string, args: InArgs = []) {
  const rs = await client.execute({ sql, args });
  return rs.rows as unknown as T[];
}

export function lastId(result: ResultSet) {
  return Number(result.lastInsertRowid ?? 0);
}
