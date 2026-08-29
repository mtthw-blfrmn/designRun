import { open, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { isRegularWorkspaceFile, resolveWorkspacePath } from '../../../lib/workspace-path';

const allowedRoots = [
  'resources/asset-library/',
  'resources/raw-assets/',
  'resources/inspiration-assets/',
  'projects/',
];
const contentTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
};
const maximumBytes = 30 * 1024 * 1024;

export async function GET(request: Request) {
  const requestedPath = new URL(request.url).searchParams.get('path')?.replace(/^\/+/, '');
  if (!requestedPath || !allowedRoots.some((root) => requestedPath.startsWith(root))) {
    return Response.json({ error: 'Provide a workspace asset path.' }, { status: 400 });
  }
  if (requestedPath.includes('/private/') || requestedPath.includes('/context/source-files/')) {
    return Response.json({ error: 'Private project sources are not previewed by the control center.' }, { status: 403 });
  }

  const source = resolveWorkspacePath(requestedPath);
  if (!source) return Response.json({ error: 'Invalid asset path.' }, { status: 400 });
  const { filePath } = source;
  const contentType = contentTypes[path.extname(filePath).toLowerCase()];
  if (!contentType) return Response.json({ error: 'Unsupported asset type.' }, { status: 415 });

  try {
    if (!(await isRegularWorkspaceFile(filePath))) return Response.json({ error: 'Asset not found or is not a regular local file.' }, { status: 404 });
    const fileStat = await stat(filePath);
    if (fileStat.size > maximumBytes) return Response.json({ error: 'Asset preview is larger than 30 MB.' }, { status: 413 });
    const range = request.headers.get('range')?.match(/^bytes=(\d*)-(\d*)$/);
    const sharedHeaders = {
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-store',
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff',
      ...(contentType === 'image/svg+xml' ? { 'Content-Security-Policy': "sandbox; default-src 'none'; style-src 'unsafe-inline'" } : {}),
    };
    if (range) {
      if (!range[1] && !range[2]) {
        return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${fileStat.size}` } });
      }
      const suffixLength = !range[1] && range[2] ? Number(range[2]) : null;
      const start = suffixLength == null ? Number(range[1]) : Math.max(fileStat.size - suffixLength, 0);
      const requestedEnd = suffixLength == null && range[2] ? Number(range[2]) : fileStat.size - 1;
      const end = Math.min(requestedEnd, fileStat.size - 1);
      if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start > end || start >= fileStat.size) {
        return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${fileStat.size}` } });
      }
      if (suffixLength != null && (!Number.isSafeInteger(suffixLength) || suffixLength <= 0)) {
        return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${fileStat.size}` } });
      }
      const length = end - start + 1;
      const buffer = Buffer.allocUnsafe(length);
      const handle = await open(filePath, 'r');
      try {
        await handle.read(buffer, 0, length, start);
      } finally {
        await handle.close();
      }
      return new Response(buffer, { status: 206, headers: { ...sharedHeaders, 'Content-Length': String(length), 'Content-Range': `bytes ${start}-${end}/${fileStat.size}` } });
    }
    return new Response(await readFile(filePath), {
      headers: {
        ...sharedHeaders,
        'Content-Length': String(fileStat.size),
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return Response.json({ error: 'Asset not found.' }, { status: 404 });
    return Response.json({ error: error instanceof Error ? error.message : 'Could not read asset.' }, { status: 500 });
  }
}
