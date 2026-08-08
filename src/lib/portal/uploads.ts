import { existsSync, mkdirSync, writeFileSync, createReadStream, statSync } from 'fs';
import { join, extname, basename } from 'path';
import { randomBytes } from 'crypto';
import { Readable } from 'stream';
import { put, get } from '@vercel/blob';
import { getUploadsRoot } from './paths';

const UPLOAD_ROOT = getUploadsRoot();

const ALLOWED_EXT = new Set(['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp']);
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const MIME: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

export type SavedUpload = {
  path: string;
  originalName: string;
  size: number;
};

function env(key: string) {
  return String(import.meta.env[key] ?? process.env[key] ?? '').trim();
}

function blobEnabled() {
  return Boolean(env('BLOB_READ_WRITE_TOKEN'));
}

function blobToken() {
  return env('BLOB_READ_WRITE_TOKEN') || undefined;
}

/** Must match the Vercel Blob store mode (public vs private). Wrong mode → Forbidden on put. */
function blobAccess(): 'public' | 'private' {
  const mode = env('BLOB_ACCESS').toLowerCase();
  return mode === 'private' ? 'private' : 'public';
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function safeExt(name: string) {
  const ext = extname(name || '').toLowerCase();
  return ALLOWED_EXT.has(ext) ? ext : '';
}

function sanitizeBase(name: string) {
  return basename(name)
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

export function isRemoteUploadPath(path: string) {
  return /^https?:\/\//i.test(path);
}

export function absoluteUploadPath(relativePath: string) {
  const cleaned = relativePath.replace(/^[/\\]+/, '').replace(/\.\./g, '');
  return join(UPLOAD_ROOT, cleaned);
}

export async function saveUpload(
  file: File | null | undefined,
  userId: number,
  kind: 'resume' | 'cert',
): Promise<SavedUpload | null> {
  if (!file || typeof File === 'undefined' || !(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_BYTES) {
    throw new Error(`${kind === 'resume' ? 'Resume' : 'File'} must be under 8 MB.`);
  }

  const ext = safeExt(file.name);
  if (!ext) {
    throw new Error('Allowed files: PDF, DOC, DOCX, PNG, JPG, WEBP.');
  }
  if (kind === 'resume' && ext !== '.docx') {
    throw new Error('Resume must be a DOCX file only.');
  }

  const token = randomBytes(8).toString('hex');
  const original = sanitizeBase(file.name) || `${kind}${ext}`;
  const stored = `${kind}-${Date.now()}-${token}${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  const contentType = MIME[ext] || 'application/octet-stream';

  if (blobEnabled()) {
    // access must match the store type in Vercel Storage (this project uses a public store).
    const blob = await put(`portal/${userId}/${stored}`, buf, {
      access: blobAccess(),
      contentType,
      token: blobToken(),
      addRandomSuffix: false,
    });
    return { path: blob.url, originalName: original, size: file.size };
  }

  const dir = join(UPLOAD_ROOT, String(userId));
  ensureDir(dir);
  const abs = join(dir, stored);
  writeFileSync(abs, buf);
  return { path: `${userId}/${stored}`, originalName: original, size: file.size };
}

export async function saveUploads(
  files: FormDataEntryValue[],
  userId: number,
  kind: 'resume' | 'cert',
): Promise<SavedUpload[]> {
  const saved: SavedUpload[] = [];
  for (const entry of files) {
    if (!(entry instanceof File) || entry.size === 0) continue;
    const one = await saveUpload(entry, userId, kind);
    if (one) saved.push(one);
  }
  return saved;
}

async function openRemoteBlob(storedPath: string): Promise<{
  stream: ReadableStream;
  contentType: string;
  size?: number;
  filename: string;
}> {
  const filename = basename(new URL(storedPath).pathname) || 'download';
  const token = blobToken();

  if (token) {
    // Prefer the configured store mode, then the other (covers legacy rows).
    const order = blobAccess() === 'private' ? (['private', 'public'] as const) : (['public', 'private'] as const);
    for (const access of order) {
      try {
        const result = await get(storedPath, { access, token, useCache: false });
        if (result.statusCode === 200 && result.stream) {
          return {
            stream: result.stream,
            contentType: result.blob.contentType || 'application/octet-stream',
            size: result.blob.size ?? undefined,
            filename,
          };
        }
      } catch {
        /* try next access mode */
      }
    }
  }

  // Fallback for legacy public blobs if token get fails.
  const res = await fetch(storedPath);
  if (!res.ok || !res.body) throw new Error('File missing');
  const sizeHeader = res.headers.get('content-length');
  return {
    stream: res.body,
    contentType: res.headers.get('content-type') || 'application/octet-stream',
    size: sizeHeader ? Number(sizeHeader) : undefined,
    filename,
  };
}

/** Stream a stored upload after auth. Supports private/public Vercel Blob URLs and local disk. */
export async function openUploadStream(storedPath: string): Promise<{
  stream: ReadableStream;
  contentType: string;
  size?: number;
  filename: string;
}> {
  if (isRemoteUploadPath(storedPath)) {
    return openRemoteBlob(storedPath);
  }

  const abs = absoluteUploadPath(storedPath);
  if (!existsSync(abs)) throw new Error('File missing');
  const ext = extname(abs).toLowerCase();
  const stream = Readable.toWeb(createReadStream(abs)) as ReadableStream;
  return {
    stream,
    contentType: MIME[ext] || 'application/octet-stream',
    size: statSync(abs).size,
    filename: basename(abs),
  };
}
