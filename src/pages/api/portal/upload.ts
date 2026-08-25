import type { APIRoute } from 'astro';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { getSessionUser } from '../../../lib/portal/auth';
import {
  blobToken,
  blobUploadEnabled,
  MAX_UPLOAD_BYTES,
  uploadPrefixForUser,
} from '../../../lib/portal/uploads';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!blobUploadEnabled()) {
    return new Response(JSON.stringify({ error: 'Direct upload is not configured.' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user = await getSessionUser(request);
  if (!user || user.role !== 'applicant') {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid upload request.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const prefix = uploadPrefixForUser(user.id);

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: blobToken(),
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(prefix)) {
          throw new Error('Invalid upload destination.');
        }
        return {
          allowedContentTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
            'image/webp',
          ],
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: user.id }),
        };
      },
      onUploadCompleted: async () => {
        /* application row stores the blob URL after form submit */
      },
    });

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    const status = /unauthorized|invalid/i.test(message) ? 403 : 400;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
