import { cp, mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

export const workspaceRoot = path.resolve(import.meta.dirname, '..');

export function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

export function titleFromSlug(value) {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function isoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function isoDateTime(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

export async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

export async function copyTemplate(source, destination, replacements) {
  await cp(source, destination, { recursive: true, errorOnExist: true });
  await replaceInTree(destination, replacements);
}

async function replaceInTree(directory, replacements) {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return replaceInTree(entryPath, replacements);
      if (!/\.(md|json|txt|ya?ml)$/i.test(entry.name)) return;

      let content = await readFile(entryPath, 'utf8');
      for (const [token, replacement] of Object.entries(replacements)) {
        content = content.split(token).join(replacement);
      }
      await writeFile(entryPath, content);
    }),
  );
}

const defaultIgnoredDirectories = new Set(['.git', '.next', '.vinext', '.wrangler', 'dist', 'node_modules']);

export async function listFiles(directory, predicate = () => true, options = {}) {
  if (!(await pathExists(directory))) return [];
  const result = [];
  const entries = await readdir(directory, { withFileTypes: true });
  const ignoredDirectories = new Set([
    ...defaultIgnoredDirectories,
    ...(options.ignoredDirectoryNames ?? []),
  ]);
  const ignoredPathPrefixes = options.ignoredPathPrefixes ?? [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.DS_Store')) continue;
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) continue;
    const workspaceRelativePath = path.relative(workspaceRoot, entryPath).split(path.sep).join('/');
    if (ignoredPathPrefixes.some((prefix) => workspaceRelativePath === prefix || workspaceRelativePath.startsWith(`${prefix}/`))) continue;
    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) continue;
      result.push(...(await listFiles(entryPath, predicate, options)));
    } else if (predicate(entryPath)) {
      result.push(entryPath);
    }
  }

  return result;
}

export function parseFrontmatter(markdown) {
  if (!markdown.startsWith('---\n')) return { attributes: {}, body: markdown };
  const end = markdown.indexOf('\n---\n', 4);
  if (end === -1) return { attributes: {}, body: markdown };

  const header = markdown.slice(4, end);
  const parsed = parseYaml(header);
  const attributes = parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};

  return { attributes, body: markdown.slice(end + 5) };
}

export function markdownTitle(markdown, fallback) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

export async function ensureDirectory(directory) {
  await mkdir(directory, { recursive: true });
}

export function validateTodoRecord(todo, index = 0) {
  const label = `todo[${index}]`;
  if (!todo || typeof todo !== 'object' || Array.isArray(todo)) return [`${label}: must be an object`];
  const errors = [];
  const requiredStrings = ['id', 'title', 'description', 'project', 'owner', 'dueDate', 'createdAt', 'updatedAt'];
  for (const key of requiredStrings) {
    if (typeof todo[key] !== 'string') errors.push(`${label}.${key}: must be a string`);
  }
  if (typeof todo.id === 'string' && !/^[a-z0-9][a-z0-9-]{0,127}$/.test(todo.id)) errors.push(`${label}.id: use a lowercase slug of 1–128 characters`);
  if (typeof todo.title === 'string' && !todo.title.trim()) errors.push(`${label}.title: cannot be empty`);
  if (!['explicit', 'inferred'].includes(todo.type)) errors.push(`${label}.type: must be explicit or inferred`);
  if (!['urgent', 'high', 'medium', 'low'].includes(todo.urgency)) errors.push(`${label}.urgency: must be urgent, high, medium, or low`);
  if (![1, 2, 3].includes(todo.size)) errors.push(`${label}.size: must be 1, 2, or 3`);
  if (typeof todo.completed !== 'boolean') errors.push(`${label}.completed: must be a boolean`);
  if (typeof todo.dueDate === 'string' && todo.dueDate && !/^\d{4}-\d{2}-\d{2}$/.test(todo.dueDate)) errors.push(`${label}.dueDate: use YYYY-MM-DD or an empty string`);
  for (const key of ['createdAt', 'updatedAt']) {
    if (typeof todo[key] === 'string' && Number.isNaN(Date.parse(todo[key]))) errors.push(`${label}.${key}: must be an ISO date-time`);
  }
  return errors;
}

export function validateReferenceRecord(reference) {
  const errors = [];
  const requiredStrings = [
    'name',
    'source_url',
    'source_owner',
    'captured_from',
    'date_captured',
    'category',
    'media',
    'license',
    'redistribution',
  ];
  for (const key of requiredStrings) {
    if (typeof reference?.[key] !== 'string' || !reference[key].trim()) errors.push(`${key}: must be a non-empty string`);
  }
  try {
    const sourceUrl = new URL(reference?.source_url);
    if (!['http:', 'https:'].includes(sourceUrl.protocol)) errors.push('source_url: must use http or https');
  } catch {
    errors.push('source_url: must be a valid URL');
  }
  if (typeof reference?.date_captured === 'string') {
    const matchesIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(reference.date_captured);
    const parsedDate = matchesIsoDate ? new Date(`${reference.date_captured}T00:00:00Z`) : null;
    if (!matchesIsoDate || Number.isNaN(parsedDate?.getTime()) || parsedDate.toISOString().slice(0, 10) !== reference.date_captured) {
      errors.push('date_captured: must be a real date in YYYY-MM-DD format');
    }
  }
  if (!['canonical-product', 'official-publisher', 'third-party-library', 'user-supplied'].includes(reference?.captured_from)) {
    errors.push('captured_from: use canonical-product, official-publisher, third-party-library, or user-supplied');
  }
  if (!['product', 'interaction', 'motion', 'typography', 'image', 'system'].includes(reference?.category)) {
    errors.push('category: use product, interaction, motion, typography, image, or system');
  }
  if (!Array.isArray(reference?.tags) || reference.tags.length === 0) {
    errors.push('tags: must be a non-empty array');
  } else if (reference.tags.some((tag) => typeof tag !== 'string' || !tag.trim())) {
    errors.push('tags: every tag must be a non-empty string');
  } else if (new Set(reference.tags).size !== reference.tags.length) {
    errors.push('tags: duplicate tags are not allowed');
  }
  if (!['allowed', 'review-required', 'external-reference-only', 'private'].includes(reference?.redistribution)) {
    errors.push('redistribution: use allowed, review-required, external-reference-only, or private');
  }
  if (reference?.redistribution === 'external-reference-only' && reference?.media !== 'none') {
    errors.push('media: external-reference-only records must use none');
  }
  if (reference?.redistribution === 'allowed' && reference?.license === 'link-only') {
    errors.push('license: allowed redistribution requires an explicit reusable license');
  }
  if (reference?.redistribution === 'review-required' && ['unknown', 'link-only'].includes(reference?.license)) {
    errors.push('license: review-required media still needs an explicit rights status');
  }
  return [...new Set(errors)];
}
