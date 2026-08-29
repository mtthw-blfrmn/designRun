import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import {
  listFiles,
  parseFrontmatter,
  pathExists,
  readJson,
  validateReferenceRecord,
  validateTodoRecord,
  workspaceRoot,
} from './lib.mjs';

const errors = [];
const warnings = [];
let reviewRequiredMedia = 0;
const config = await readJson(path.join(workspaceRoot, 'designrun.config.json'));
const requiredPaths = [
  'AGENTS.md',
  'START-HERE.md',
  'README.md',
  config.tasteFile,
  config.todosFile,
  config.inspirationFile,
  config.inspirationDirectory,
  config.designSystemFile,
  config.toolsFile,
  config.toolsDirectory,
  'resources/accessibility.md',
  'resources/motion.md',
  'resources/content.md',
  'knowledge/agents.md',
  'templates/project/AGENTS.md',
  'templates/deliverable/README.md',
  'templates/reference.md',
  'templates/product-requirements.md',
  'templates/user-flow.md',
  'resources/reference-provenance.md',
  'resources/asset-library/backgrounds/manifest.json',
  config.projectsDirectory,
  config.patternsDirectory,
  config.skillsDirectory,
  '.github/workflows/ci.yml',
  '.cursor/rules/designrun.mdc',
  '.github/copilot-instructions.md',
  'CLAUDE.md',
  'GEMINI.md',
];

for (const requiredPath of requiredPaths) {
  if (!(await pathExists(path.join(workspaceRoot, requiredPath)))) errors.push(`Missing required path: ${requiredPath}`);
}

const toolFiles = await listFiles(
  path.join(workspaceRoot, config.toolsDirectory),
  (file) => file.endsWith('.md') && path.basename(file) !== 'README.md',
);
const toolOrders = new Set();
for (const toolFile of toolFiles) {
  const relativePath = path.relative(workspaceRoot, toolFile).split(path.sep).join('/');
  const content = await readFile(toolFile, 'utf8');
  const { attributes, body } = parseFrontmatter(content);
  if (typeof attributes.name !== 'string' || !attributes.name.trim()) errors.push(`${relativePath}: name must be a non-empty string`);
  if (!Number.isInteger(attributes.order) || attributes.order < 1) errors.push(`${relativePath}: order must be a positive integer`);
  else if (toolOrders.has(attributes.order)) errors.push(`${relativePath}: duplicate tool order ${attributes.order}`);
  else toolOrders.add(attributes.order);
  if (typeof attributes.official_url !== 'string' || !/^https:\/\//.test(attributes.official_url)) errors.push(`${relativePath}: official_url must be an HTTPS URL`);
  for (const heading of ['Use when', 'Do not use when', 'Agent instructions', 'Verification', 'Constraints']) {
    if (!new RegExp(`^## ${heading}$`, 'm').test(body)) errors.push(`${relativePath}: missing section ${heading}`);
  }
}

const inspirationFiles = await listFiles(
  path.join(workspaceRoot, config.inspirationDirectory),
  (file) => file.endsWith('.md') && path.basename(file) !== 'README.md',
);
for (const inspirationFile of inspirationFiles) {
  const relativePath = path.relative(workspaceRoot, inspirationFile).split(path.sep).join('/');
  const content = await readFile(inspirationFile, 'utf8');
  const { attributes, body } = parseFrontmatter(content);
  errors.push(...validateReferenceRecord(attributes).map((message) => `${relativePath}: ${message}`));
  for (const heading of ['Observed behavior', 'What works', 'Principle to inherit', 'Do not copy literally', 'Verification notes']) {
    if (!new RegExp(`^## ${heading}$`, 'm').test(body)) errors.push(`${relativePath}: missing section ${heading}`);
  }
  const media = attributes.media;
  if (typeof media === 'string' && media && media !== 'none') {
    if (!media.startsWith('resources/inspiration-assets/')) errors.push(`${relativePath}: media must live under resources/inspiration-assets/`);
    if (!['allowed', 'review-required'].includes(attributes.redistribution)) errors.push(`${relativePath}: committed media requires redistribution: allowed or review-required`);
    if (!attributes.license || ['unknown', 'link-only'].includes(attributes.license)) errors.push(`${relativePath}: committed media requires an explicit rights status`);
    if (!(await pathExists(path.join(workspaceRoot, media)))) errors.push(`${relativePath}: media file does not exist (${media})`);
    if (attributes.redistribution === 'review-required') reviewRequiredMedia += 1;
  }
  const poster = attributes.poster;
  if (typeof poster === 'string' && poster) {
    if (!poster.startsWith('resources/inspiration-assets/')) errors.push(`${relativePath}: poster must live under resources/inspiration-assets/`);
    if (!(await pathExists(path.join(workspaceRoot, poster)))) errors.push(`${relativePath}: poster file does not exist (${poster})`);
  }
}
if (reviewRequiredMedia > 0) warnings.push(`${reviewRequiredMedia} reference media record${reviewRequiredMedia === 1 ? '' : 's'} require rights review before public release.`);

const assetManifestFiles = await listFiles(
  path.join(workspaceRoot, 'resources/asset-library'),
  (file) => path.basename(file) === 'manifest.json',
);
const declaredReusableAssets = new Set();
for (const assetManifestFile of assetManifestFiles) {
  const manifestPath = path.relative(workspaceRoot, assetManifestFile).split(path.sep).join('/');
  try {
    const manifest = JSON.parse(await readFile(assetManifestFile, 'utf8'));
    if (typeof manifest.category !== 'string' || !manifest.category.trim()) errors.push(`${manifestPath}: category must be a non-empty string`);
    if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) errors.push(`${manifestPath}: assets must be a non-empty array`);
    for (const asset of manifest.assets ?? []) {
      if (typeof asset !== 'string' || !asset.startsWith('resources/asset-library/') || asset.split('/').includes('..')) errors.push(`${manifestPath}: invalid asset path ${String(asset)}`);
      else if (declaredReusableAssets.has(asset)) errors.push(`${manifestPath}: reusable asset is declared more than once (${asset})`);
      else if (!(await pathExists(path.join(workspaceRoot, asset)))) errors.push(`${manifestPath}: asset does not exist (${asset})`);
      if (typeof asset === 'string') declaredReusableAssets.add(asset);
    }
    for (const supportingFile of manifest.supporting_files ?? []) {
      if (typeof supportingFile !== 'string' || !supportingFile.startsWith('resources/asset-library/') || supportingFile.split('/').includes('..')) errors.push(`${manifestPath}: invalid supporting file path ${String(supportingFile)}`);
      else if (!(await pathExists(path.join(workspaceRoot, supportingFile)))) errors.push(`${manifestPath}: supporting file does not exist (${supportingFile})`);
    }
    if (manifest.redistribution === 'review-required') warnings.push(`${manifestPath}: reusable assets require rights review before public release.`);
  } catch (error) {
    errors.push(`${manifestPath}: invalid JSON (${error.message})`);
  }
}

const skillFiles = await listFiles(path.join(workspaceRoot, config.skillsDirectory), (file) => path.basename(file) === 'SKILL.md');
const skillNames = new Set();
for (const skillFile of skillFiles) {
  const content = await readFile(skillFile, 'utf8');
  const { attributes } = parseFrontmatter(content);
  const relativePath = path.relative(workspaceRoot, skillFile);
  const folderName = path.basename(path.dirname(skillFile));
  if (!attributes.name) errors.push(`${relativePath}: missing frontmatter name`);
  if (!attributes.description) errors.push(`${relativePath}: missing frontmatter description`);
  if (attributes.name && attributes.name !== folderName) errors.push(`${relativePath}: skill name must match folder name (${folderName})`);
  if (attributes.name && skillNames.has(attributes.name)) errors.push(`${relativePath}: duplicate skill name ${attributes.name}`);
  if (attributes.name) skillNames.add(attributes.name);
  if (typeof attributes.description === 'string' && attributes.description.length > 320) warnings.push(`${relativePath}: description is long enough to crowd skill discovery`);
  if (/\[TODO:|TODO\b/.test(content)) errors.push(`${relativePath}: contains TODO scaffold content`);
  if (!(await pathExists(path.join(path.dirname(skillFile), 'agents', 'openai.yaml')))) errors.push(`${relativePath}: missing agents/openai.yaml`);
}

const todosMarkdown = await readFile(path.join(workspaceRoot, config.todosFile), 'utf8');
const todoBlock = todosMarkdown.match(/```json\s*([\s\S]*?)```/i);
if (!todoBlock) {
  errors.push(`${config.todosFile}: missing JSON code block`);
} else {
  try {
    const todoData = JSON.parse(todoBlock[1]);
    if (!Array.isArray(todoData.todos)) errors.push(`${config.todosFile}: todos must be an array`);
    if (!Number.isInteger(todoData.version) || todoData.version < 1) errors.push(`${config.todosFile}: version must be a positive integer`);
    if (Array.isArray(todoData.todos)) {
      const ids = new Set();
      todoData.todos.forEach((todo, index) => {
        errors.push(...validateTodoRecord(todo, index).map((message) => `${config.todosFile}: ${message}`));
        if (typeof todo?.id === 'string' && ids.has(todo.id)) errors.push(`${config.todosFile}: duplicate todo id ${todo.id}`);
        if (typeof todo?.id === 'string') ids.add(todo.id);
      });
    }
  } catch (error) {
    errors.push(`${config.todosFile}: invalid JSON (${error.message})`);
  }
}

const projectReadmes = await listFiles(
  path.join(workspaceRoot, config.projectsDirectory),
  (file) => path.basename(file) === 'README.md'
    && path.dirname(file) !== path.join(workspaceRoot, config.projectsDirectory)
    && path.dirname(path.dirname(file)) === path.join(workspaceRoot, config.projectsDirectory),
);
const projectSlugs = new Set();
for (const projectReadme of projectReadmes) {
  const content = await readFile(projectReadme, 'utf8');
  const { attributes } = parseFrontmatter(content);
  const folderSlug = path.basename(path.dirname(projectReadme));
  for (const attribute of ['name', 'slug', 'status', 'created']) {
    if (!attributes[attribute]) errors.push(`${path.relative(workspaceRoot, projectReadme)}: missing frontmatter ${attribute}`);
  }
  if (attributes.slug && attributes.slug !== folderSlug) errors.push(`${path.relative(workspaceRoot, projectReadme)}: slug must match folder name (${folderSlug})`);
  if (projectSlugs.has(folderSlug)) errors.push(`Duplicate project slug: ${folderSlug}`);
  projectSlugs.add(folderSlug);
  for (const requiredFile of ['AGENTS.md', 'brief.md', 'decisions.md', 'research.md', 'deliverables.md']) {
    if (!(await pathExists(path.join(path.dirname(projectReadme), requiredFile)))) errors.push(`projects/${folderSlug}: missing ${requiredFile}`);
  }
}

const deliverableReadmes = await listFiles(
  path.join(workspaceRoot, config.projectsDirectory),
  (file) => path.basename(file) === 'README.md' && path.basename(path.dirname(path.dirname(file))) === 'deliverables',
);
for (const deliverableReadme of deliverableReadmes) {
  const content = await readFile(deliverableReadme, 'utf8');
  const { attributes } = parseFrontmatter(content);
  const folderSlug = path.basename(path.dirname(deliverableReadme));
  for (const attribute of ['name', 'slug', 'type', 'status', 'created']) {
    if (!attributes[attribute]) errors.push(`${path.relative(workspaceRoot, deliverableReadme)}: missing frontmatter ${attribute}`);
  }
  if (attributes.slug && attributes.slug !== folderSlug) errors.push(`${path.relative(workspaceRoot, deliverableReadme)}: slug must match folder name (${folderSlug})`);
}

const trackedFiles = await listFiles(workspaceRoot, (file) => !file.includes(`${path.sep}node_modules${path.sep}`) && !file.includes(`${path.sep}.git${path.sep}`));
const maximumMarkdownBytes = config.indexing?.maximumMarkdownBytes ?? 1024 * 1024;
for (const file of trackedFiles) {
  const relativePath = path.relative(workspaceRoot, file);
  if (/\.(env|pem|key)$/i.test(file) && !/\.example$/i.test(file)) warnings.push(`Potentially sensitive file: ${relativePath}`);
  if (file.endsWith('.md') && (await stat(file)).size > maximumMarkdownBytes) warnings.push(`Markdown exceeds index limit and will be skipped: ${relativePath}`);
}

for (const prefix of config.indexing?.ignoredPathPrefixes ?? []) {
  if (typeof prefix !== 'string' || !prefix || path.isAbsolute(prefix) || prefix.split('/').includes('..')) errors.push(`designrun.config.json: invalid ignoredPathPrefix ${String(prefix)}`);
}

if (await pathExists(path.join(workspaceRoot, 'runs'))) warnings.push('Empty legacy runs/ directory can be removed.');
if (warnings.length) {
  console.warn(`Warnings (${warnings.length}):`);
  warnings.forEach((warning) => console.warn(`- ${warning}`));
}
if (errors.length) {
  console.error(`Validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Workspace valid: ${projectSlugs.size} projects, ${skillFiles.length} skills, source-backed control center ready.`);
