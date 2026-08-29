import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  ensureDirectory,
  listFiles,
  markdownTitle,
  parseFrontmatter,
  readJson,
  titleFromSlug,
  workspaceRoot,
} from './lib.mjs';

const config = await readJson(path.join(workspaceRoot, 'designrun.config.json'));
const relative = (filePath) => path.relative(workspaceRoot, filePath).split(path.sep).join('/');
const indexing = config.indexing ?? {};
const maximumMarkdownBytes = indexing.maximumMarkdownBytes ?? 1024 * 1024;
const maximumIndexBytes = indexing.maximumIndexBytes ?? 20 * 1024 * 1024;
const listOptions = {
  ignoredDirectoryNames: indexing.ignoredDirectoryNames ?? [],
  ignoredPathPrefixes: indexing.ignoredPathPrefixes ?? [],
};
const diagnostics = [];

async function documentFromFile(filePath, kind) {
  const fileStat = await stat(filePath);
  if (fileStat.size > maximumMarkdownBytes) {
    diagnostics.push(`${relative(filePath)} was not indexed because it exceeds ${maximumMarkdownBytes} bytes.`);
    return null;
  }
  const markdown = await readFile(filePath, 'utf8');
  const { attributes, body } = parseFrontmatter(markdown);
  const title = markdownTitle(body, titleFromSlug(path.basename(filePath, path.extname(filePath))));

  return {
    id: relative(filePath),
    path: relative(filePath),
    kind,
    title,
    attributes,
    markdown,
    mtimeMs: fileStat.mtimeMs,
    updatedAt: fileStat.mtime.toISOString(),
    searchText: `${title} ${relative(filePath)} ${body}`.toLowerCase(),
  };
}

function jsonBlock(markdown) {
  const match = markdown.match(/```json\s*([\s\S]*?)```/i);
  if (!match) return null;
  return JSON.parse(match[1]);
}

function sections(markdown, level = 2) {
  const marker = '#'.repeat(level);
  const expression = new RegExp(`^${marker}\\s+(.+)$`, 'gm');
  const headings = [...markdown.matchAll(expression)];
  return headings.map((match, index) => {
    const start = match.index + match[0].length;
    const end = headings[index + 1]?.index ?? markdown.length;
    const body = markdown.slice(start, end).trim();
    return {
      id: `${match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${index}`,
      title: match[1].trim(),
      body,
      searchText: `${match[1]} ${body}`.toLowerCase(),
    };
  });
}

const taste = await documentFromFile(path.join(workspaceRoot, config.tasteFile), 'taste');
const inspirationSource = await documentFromFile(path.join(workspaceRoot, config.inspirationFile), 'inspiration');
const inspirationDirectory = config.inspirationDirectory ?? path.posix.dirname(config.inspirationFile);
const inspirationFiles = await listFiles(
  path.join(workspaceRoot, inspirationDirectory),
  (file) => file.endsWith('.md') && path.basename(file) !== 'README.md',
  listOptions,
);
const inspirationDocuments = (await Promise.all(inspirationFiles.map((file) => documentFromFile(file, 'inspiration-reference'))))
  .filter(Boolean);
const designSystem = await documentFromFile(path.join(workspaceRoot, config.designSystemFile), 'design-system');
const toolsSource = await documentFromFile(path.join(workspaceRoot, config.toolsFile), 'tools');
const toolsDirectory = config.toolsDirectory ?? 'resources/tool-library';
const toolFiles = await listFiles(
  path.join(workspaceRoot, toolsDirectory),
  (file) => file.endsWith('.md') && path.basename(file) !== 'README.md',
  listOptions,
);
const toolDocuments = (await Promise.all(toolFiles.map((file) => documentFromFile(file, 'tool')))).filter(Boolean);
const todosSource = await documentFromFile(path.join(workspaceRoot, config.todosFile), 'todos');
const todoData = jsonBlock(todosSource.markdown) ?? { version: 1, todos: [] };

const resourceFiles = await listFiles(path.join(workspaceRoot, config.resourcesDirectory), (file) => file.endsWith('.md'), listOptions);
const resources = (await Promise.all(resourceFiles.map((file) => documentFromFile(file, 'resource')))).filter(Boolean);

const patternFiles = await listFiles(
  path.join(workspaceRoot, config.patternsDirectory),
  (file) => file.endsWith('.md') && path.basename(file) !== 'README.md',
  listOptions,
);
const patterns = (await Promise.all(patternFiles.map((file) => documentFromFile(file, 'pattern')))).filter(Boolean);

const skillFiles = await listFiles(path.join(workspaceRoot, config.skillsDirectory), (file) => path.basename(file) === 'SKILL.md', listOptions);
const skills = (await Promise.all(skillFiles.map((file) => documentFromFile(file, 'skill')))).filter(Boolean)
  .map((skill) => ({
    ...skill,
    slug: path.basename(path.dirname(skill.path)),
    name: skill.attributes.name || path.basename(path.dirname(skill.path)),
    description: skill.attributes.description || '',
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

const projectReadmes = await listFiles(
  path.join(workspaceRoot, config.projectsDirectory),
  (file) => path.basename(file) === 'README.md'
    && path.dirname(file) !== path.join(workspaceRoot, config.projectsDirectory)
    && path.dirname(path.dirname(file)) === path.join(workspaceRoot, config.projectsDirectory),
  listOptions,
);
const projects = (await Promise.all(projectReadmes.map(async (filePath) => {
  const document = await documentFromFile(filePath, 'project');
  if (!document) return null;
  const slug = document.attributes.slug || path.basename(path.dirname(filePath));
  const projectRoot = path.dirname(filePath);
  const projectFiles = await listFiles(projectRoot, (file) => {
    const relativeProjectPath = relative(file);
    const privateSource = relativeProjectPath.includes('/private/') || relativeProjectPath.includes('/context/source-files/');
    return file.endsWith('.md') && path.basename(file) !== 'AGENTS.md' && !privateSource;
  }, listOptions);
  const documents = (await Promise.all(projectFiles.map((file) => documentFromFile(file, 'project-document')))).filter(Boolean);
  const deliverables = new Map();

  for (const projectDocument of documents) {
    const parts = projectDocument.path.split('/');
    if (parts[2] !== 'deliverables' || !parts[3]) continue;
    const deliverableSlug = parts[3];
    const current = deliverables.get(deliverableSlug) ?? {
      slug: deliverableSlug,
      projectSlug: slug,
      title: titleFromSlug(deliverableSlug),
      documents: [],
    };
    current.documents.push(projectDocument);
    deliverables.set(deliverableSlug, current);
  }

  return {
    ...document,
    slug,
    name: document.attributes.name || document.title,
    status: document.attributes.status || 'active',
    created: document.attributes.created || null,
    documents: documents.sort((a, b) => b.mtimeMs - a.mtimeMs),
    deliverables: [...deliverables.values()].map((deliverable) => ({
      ...deliverable,
      title: deliverable.documents.find((candidate) => candidate.path.endsWith('/README.md'))?.attributes.name || deliverable.title,
      documents: deliverable.documents.sort((a, b) => b.mtimeMs - a.mtimeMs),
    })),
  };
}))).filter(Boolean).sort((a, b) => a.name.localeCompare(b.name));

const mediaExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.mp4', '.mov', '.webm', '.pdf']);
const assetLibraryDirectory = path.join(workspaceRoot, config.resourcesDirectory, 'asset-library');
const assetManifestFiles = await listFiles(assetLibraryDirectory, (file) => path.basename(file) === 'manifest.json', listOptions);
const declaredAssets = [];
const declaredAssetPaths = new Set();
for (const manifestFile of assetManifestFiles) {
  const manifest = await readJson(manifestFile);
  if (!Array.isArray(manifest.assets)) throw new Error(`${relative(manifestFile)} must declare an assets array.`);
  const area = typeof manifest.category === 'string' && manifest.category.trim()
    ? manifest.category.trim()
    : titleFromSlug(path.basename(path.dirname(manifestFile)));
  for (const sourcePath of manifest.assets ?? []) {
    if (typeof sourcePath !== 'string' || !sourcePath.startsWith('resources/asset-library/') || sourcePath.split('/').includes('..')) {
      throw new Error(`Invalid reusable asset path in ${relative(manifestFile)}: ${String(sourcePath)}`);
    }
    if (declaredAssetPaths.has(sourcePath)) throw new Error(`Reusable asset is declared more than once: ${sourcePath}`);
    declaredAssetPaths.add(sourcePath);
    declaredAssets.push({ sourcePath, area });
  }
}
const assets = await Promise.all(declaredAssets.map(async ({ sourcePath, area }) => {
  const filePath = path.resolve(workspaceRoot, sourcePath);
  if (!filePath.startsWith(`${assetLibraryDirectory}${path.sep}`)) throw new Error(`Reusable asset escapes the asset library: ${sourcePath}`);
  const fileStat = await stat(filePath);
  const extension = path.extname(filePath).toLowerCase();
  if (!mediaExtensions.has(extension)) throw new Error(`Unsupported reusable asset type: ${sourcePath}`);
  return {
    id: sourcePath,
    path: sourcePath,
    title: titleFromSlug(path.basename(filePath, path.extname(filePath))),
    extension: extension.slice(1),
    area,
    size: fileStat.size,
    updatedAt: fileStat.mtime.toISOString(),
    url: `/api/workspace-asset?path=${encodeURIComponent(sourcePath)}`,
    searchText: `${sourcePath} ${area}`.toLowerCase(),
  };
}));

const guideFiles = [
  path.join(workspaceRoot, 'START-HERE.md'),
  path.join(workspaceRoot, 'README.md'),
  ...(await listFiles(path.join(workspaceRoot, 'docs'), (file) => file.endsWith('.md'), listOptions)),
  ...(await listFiles(path.join(workspaceRoot, 'knowledge'), (file) => file.endsWith('.md') && file !== path.join(workspaceRoot, config.todosFile), listOptions)),
];
const guide = (await Promise.all(guideFiles.map((file) => documentFromFile(file, 'guide')))).filter(Boolean);

function normalizeMediaPath(mediaValue) {
  if (typeof mediaValue !== 'string' || !mediaValue || /^none$/i.test(mediaValue)) return null;
  return /^(resources|projects)\//.test(mediaValue)
    ? path.posix.normalize(mediaValue)
    : path.posix.normalize(path.posix.join(path.posix.dirname(config.inspirationFile), mediaValue));
}

function mediaFromValue(mediaValue, posterValue) {
  const mediaPath = normalizeMediaPath(mediaValue);
  if (!mediaPath) return null;
  const posterPath = normalizeMediaPath(posterValue);
  const extension = path.extname(mediaPath).slice(1).toLowerCase();
  return {
    path: mediaPath,
    extension,
    url: `/api/workspace-asset?path=${encodeURIComponent(mediaPath)}`,
    type: ['mp4', 'mov', 'webm'].includes(extension) ? 'video' : 'image',
    poster: posterPath ? `/api/workspace-asset?path=${encodeURIComponent(posterPath)}` : undefined,
  };
}

const inlineReferences = (inspirationDocuments.length ? [] : sections(inspirationSource.markdown))
  .filter((section) => !/^(reference format|product or reference name|how to add|incoming references)$/i.test(section.title))
  .map((section) => {
    const mediaValue = section.body.match(/^- Media:\s*(.+)$/im)?.[1]?.trim().replace(/^`|`$/g, '');
    return {
      ...section,
      category: 'Reference',
      sourceOwner: '',
      sourceUrl: '',
      document: inspirationSource,
      media: mediaFromValue(mediaValue),
    };
  });
const documentReferences = inspirationDocuments.map((document) => {
  const { attributes, body } = parseFrontmatter(document.markdown);
  return {
    id: document.path,
    title: typeof attributes.name === 'string' ? attributes.name : document.title,
    body,
    category: typeof attributes.category === 'string' ? attributes.category : 'Reference',
    order: Number.isInteger(attributes.order) && attributes.order > 0 ? attributes.order : null,
    sourceOwner: typeof attributes.source_owner === 'string' ? attributes.source_owner : '',
    sourceUrl: typeof attributes.source_url === 'string' ? attributes.source_url : '',
    document,
    media: mediaFromValue(attributes.media, attributes.poster),
    searchText: `${document.searchText} ${String(attributes.category ?? '')} ${String(attributes.source_owner ?? '')} ${Array.isArray(attributes.tags) ? attributes.tags.join(' ') : ''}`.toLowerCase(),
  };
});
const references = [...documentReferences, ...inlineReferences].sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.title.localeCompare(b.title));
const toolEntries = toolDocuments
  .map((document) => {
    const { attributes, body } = parseFrontmatter(document.markdown);
    return {
      id: document.path,
      title: typeof attributes.name === 'string' ? attributes.name : document.title,
      body,
      order: Number.isInteger(attributes.order) && attributes.order > 0 ? attributes.order : null,
      officialUrl: typeof attributes.official_url === 'string' ? attributes.official_url : '',
      category: typeof attributes.category === 'string' ? attributes.category : 'Tool',
      document,
      searchText: `${document.searchText} ${String(attributes.category ?? '')}`.toLowerCase(),
    };
  })
  .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.title.localeCompare(b.title));
const todos = Array.isArray(todoData.todos) ? todoData.todos : [];

const index = {
  schemaVersion: 3,
  generatedAt: new Date().toISOString(),
  workspace: { name: config.workspaceName, tagline: 'A local agent workspace for product design.' },
  stats: {
    projects: projects.length,
    openTodos: todos.filter((todo) => !todo.completed).length,
    references: references.length,
    assets: assets.length,
    patterns: patterns.length,
    skills: skills.length,
  },
  todos: { source: todosSource, version: todoData.version ?? 1, items: todos },
  projects,
  inspiration: { source: inspirationSource, documents: inspirationDocuments, entries: references },
  taste,
  designSystem,
  resources: resources.sort((a, b) => a.title.localeCompare(b.title)),
  tools: { source: toolsSource, entries: toolEntries },
  assets: assets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
  skills,
  patterns,
  guide,
  diagnostics,
};

const publicDirectory = path.join(workspaceRoot, 'app', 'public');
await ensureDirectory(publicDirectory);
const serializedIndex = `${JSON.stringify(index, null, 2)}\n`;
if (Buffer.byteLength(serializedIndex, 'utf8') > maximumIndexBytes) {
  throw new Error(`Workspace index exceeds ${maximumIndexBytes} bytes. Add path prefixes to designrun.config.json indexing.ignoredPathPrefixes or reduce oversized Markdown sources.`);
}
await writeFile(path.join(publicDirectory, 'workspace-index.json'), serializedIndex);
console.log(`Indexed ${projects.length} projects, ${todos.length} to-dos, ${references.length} references, ${assets.length} assets, and ${skills.length} skills.`);
if (diagnostics.length) diagnostics.forEach((message) => console.warn(`Index warning: ${message}`));
