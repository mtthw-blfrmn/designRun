import { randomUUID } from 'node:crypto';
import { readFile, rename, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { isRegularWorkspaceFile, mutationComesFromWorkspace, resolveWorkspacePath } from '../../../lib/workspace-path';

const editableRoots = ['taste', 'inspiration', 'knowledge', 'resources', 'projects', 'patterns', '.agents/skills', 'docs'];
const editableRootFiles = new Set(['START-HERE.md', 'README.md', 'AGENTS.md', 'CLAUDE.md', 'GEMINI.md']);
const maximumBytes = 5 * 1024 * 1024;

function resolveMarkdown(request: Request) {
  const requestedPath = new URL(request.url).searchParams.get('path')?.replace(/^\/+/, '');
  if (!requestedPath || path.extname(requestedPath).toLowerCase() !== '.md') return null;
  if (requestedPath.includes('/private/') || requestedPath.includes('/context/source-files/')) return null;

  const allowed = editableRootFiles.has(requestedPath)
    || editableRoots.some((root) => requestedPath === root || requestedPath.startsWith(`${root}/`));
  if (!allowed) return null;

  return resolveWorkspacePath(requestedPath);
}

export async function GET(request: Request) {
  const source = resolveMarkdown(request);
  if (!source) return Response.json({ error: 'Provide an editable workspace Markdown path.' }, { status: 400 });

  try {
    if (!(await isRegularWorkspaceFile(source.filePath))) return Response.json({ error: 'Workspace file not found or is not a regular local file.' }, { status: 404 });
    const fileStat = await stat(source.filePath);
    return Response.json({
      path: source.requestedPath,
      markdown: await readFile(source.filePath, 'utf8'),
      mtimeMs: fileStat.mtimeMs,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return Response.json({ error: 'Workspace file not found.' }, { status: 404 });
    return Response.json({ error: error instanceof Error ? error.message : 'Could not read workspace file.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const source = resolveMarkdown(request);
  if (!source) return Response.json({ error: 'Provide an editable workspace Markdown path.' }, { status: 400 });
  if (!mutationComesFromWorkspace(request)) return Response.json({ error: 'Cross-origin workspace writes are not allowed.' }, { status: 403 });
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return Response.json({ error: 'Workspace writes require application/json.' }, { status: 415 });

  let temporaryPath = '';
  try {
    const payload = await request.json() as { markdown?: unknown; previousMtimeMs?: unknown };
    if (typeof payload.markdown !== 'string') return Response.json({ error: 'Request must include Markdown.' }, { status: 400 });
    if (Buffer.byteLength(payload.markdown, 'utf8') > maximumBytes) return Response.json({ error: 'Markdown is larger than 5 MB.' }, { status: 413 });

    if (!(await isRegularWorkspaceFile(source.filePath))) return Response.json({ error: 'Workspace file not found or is not a regular local file.' }, { status: 404 });
    const currentStat = await stat(source.filePath);
    const previousMtimeMs = typeof payload.previousMtimeMs === 'number' ? payload.previousMtimeMs : null;
    if (previousMtimeMs != null && Math.abs(currentStat.mtimeMs - previousMtimeMs) > 0.5) {
      return Response.json({
        error: 'This source changed on disk after you opened it.',
        path: source.requestedPath,
        markdown: await readFile(source.filePath, 'utf8'),
        mtimeMs: currentStat.mtimeMs,
      }, { status: 409 });
    }

    temporaryPath = path.join(path.dirname(source.filePath), `.designrun-write-${randomUUID()}.tmp`);
    await writeFile(temporaryPath, payload.markdown, { encoding: 'utf8', flag: 'wx', mode: currentStat.mode });
    const beforeRenameStat = await stat(source.filePath);
    if (beforeRenameStat.ino !== currentStat.ino || beforeRenameStat.size !== currentStat.size || Math.abs(beforeRenameStat.mtimeMs - currentStat.mtimeMs) > 0.5) {
      await unlink(temporaryPath);
      temporaryPath = '';
      return Response.json({
        error: 'This source changed on disk while the save was in progress.',
        path: source.requestedPath,
        markdown: await readFile(source.filePath, 'utf8'),
        mtimeMs: beforeRenameStat.mtimeMs,
      }, { status: 409 });
    }
    await rename(temporaryPath, source.filePath);
    temporaryPath = '';
    const nextStat = await stat(source.filePath);
    return Response.json({
      path: source.requestedPath,
      markdown: payload.markdown,
      mtimeMs: nextStat.mtimeMs,
      updatedAt: nextStat.mtime.toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (temporaryPath) await unlink(temporaryPath).catch(() => undefined);
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return Response.json({ error: 'Workspace file not found.' }, { status: 404 });
    return Response.json({ error: error instanceof Error ? error.message : 'Could not save workspace file.' }, { status: 500 });
  }
}
