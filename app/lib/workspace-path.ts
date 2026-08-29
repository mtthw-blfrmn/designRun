import { lstat, realpath } from 'node:fs/promises';
import path from 'node:path';

export const workspaceRoot = path.resolve(process.cwd(), '..');

export function resolveWorkspacePath(requestedPath: string) {
  const normalizedRequest = requestedPath.replace(/^\/+/, '');
  if (!normalizedRequest || path.isAbsolute(normalizedRequest) || normalizedRequest.split('/').includes('..')) return null;

  const filePath = path.resolve(workspaceRoot, normalizedRequest);
  const normalizedPath = path.relative(workspaceRoot, filePath).split(path.sep).join('/');
  if (!filePath.startsWith(`${workspaceRoot}${path.sep}`) || normalizedPath !== normalizedRequest) return null;
  return { requestedPath: normalizedPath, filePath };
}

export async function isRegularWorkspaceFile(filePath: string) {
  const fileStat = await lstat(filePath);
  if (!fileStat.isFile() || fileStat.isSymbolicLink()) return false;

  const [realWorkspaceRoot, realFilePath] = await Promise.all([realpath(workspaceRoot), realpath(filePath)]);
  return realFilePath.startsWith(`${realWorkspaceRoot}${path.sep}`);
}

export function mutationComesFromWorkspace(request: Request) {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') return false;
  const origin = request.headers.get('origin');
  return !origin || origin === new URL(request.url).origin;
}
