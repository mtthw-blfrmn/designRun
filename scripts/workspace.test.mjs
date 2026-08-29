import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { listFiles, parseFrontmatter, slugify, validateReferenceRecord, validateTodoRecord } from './lib.mjs';

test('slugify creates stable portable project slugs', () => {
  assert.equal(slugify('  Café Control Center  '), 'cafe-control-center');
  assert.equal(slugify('---'), '');
  assert.ok(slugify('A'.repeat(100)).length <= 64);
});

test('frontmatter parser preserves common designRun value types', () => {
  const parsed = parseFrontmatter('---\nname: "Atlas"\nstatus: active\ntags:\n  - one\n  - two\nreviewed: true\n---\n# Body\n');
  assert.deepEqual(parsed.attributes, { name: 'Atlas', status: 'active', tags: ['one', 'two'], reviewed: true });
  assert.equal(parsed.body, '# Body\n');
});

test('todo validation accepts the source schema and rejects unsafe identifiers', () => {
  const valid = {
    id: 'review-onboarding',
    title: 'Review onboarding',
    description: '',
    project: 'Atlas',
    type: 'explicit',
    owner: 'me',
    dueDate: '',
    size: 1,
    urgency: 'high',
    completed: false,
    createdAt: '2026-08-28T12:00:00Z',
    updatedAt: '2026-08-28T12:00:00Z',
  };
  assert.deepEqual(validateTodoRecord(valid), []);
  assert.ok(validateTodoRecord({ ...valid, id: '../escape' }).some((message) => message.includes('.id')));
});

test('reference validation enforces provenance and redistribution boundaries', () => {
  const record = {
    name: 'Example product behavior',
    source_url: 'https://example.com/product',
    source_owner: 'Example',
    captured_from: 'canonical-product',
    date_captured: '2026-08-28',
    category: 'interaction',
    tags: ['feedback', 'recovery'],
    media: 'none',
    license: 'link-only',
    redistribution: 'external-reference-only',
  };
  assert.deepEqual(validateReferenceRecord(record), []);
  assert.match(
    validateReferenceRecord({ ...record, media: 'resources/inspiration-assets/capture.png' }).join('\n'),
    /external-reference-only records must use none/,
  );
  assert.match(validateReferenceRecord({ ...record, date_captured: '2026-02-31' }).join('\n'), /real date/);
  assert.deepEqual(validateReferenceRecord({
    ...record,
    media: 'resources/inspiration-assets/capture.png',
    license: 'proprietary-reference',
    redistribution: 'review-required',
  }), []);
});

test('file discovery skips ignored directories and symbolic links', async (context) => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'designrun-list-'));
  context.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, 'kept'));
  await mkdir(path.join(root, 'vendor'));
  await writeFile(path.join(root, 'kept', 'brief.md'), '# Brief\n');
  await writeFile(path.join(root, 'vendor', 'readme.md'), '# Vendor\n');
  await symlink(path.join(root, 'kept', 'brief.md'), path.join(root, 'linked.md'));

  const files = await listFiles(root, (file) => file.endsWith('.md'), { ignoredDirectoryNames: ['vendor'] });
  assert.deepEqual(files.map((file) => path.relative(root, file)), [path.join('kept', 'brief.md')]);
});

test('control-center motion is tokenized and reduced-motion safe', async () => {
  const css = await readFile(path.join(process.cwd(), 'app/app/globals.css'), 'utf8');
  assert.match(css, /--motion-fast:\s*120ms/);
  assert.match(css, /--ease-out-natural:\s*cubic-bezier\(\.22, 1, \.36, 1\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.doesNotMatch(css, /transition:\s*all\b/);
  assert.doesNotMatch(css, /\.taste-list\s*\{[^}]*border-top/);
  assert.match(css, /\.section-header\s*\{[^}]*align-items:\s*center/);
  assert.match(css, /\.section-header \+ \.tool-list\s*\{[^}]*border-top:\s*0/);
});

test('Hugeicons stay stroke-only and icon use remains intentional', async () => {
  const source = await readFile(path.join(process.cwd(), 'app/components/designrun-workspace.tsx'), 'utf8');
  const css = await readFile(path.join(process.cwd(), 'app/app/globals.css'), 'utf8');
  assert.match(source, /fill="none"/);
  assert.doesNotMatch(source, /fill="currentColor"|fill=\{fill\}/);
  assert.match(source, /className="header-actions">\{refreshControl && <IconUtilityButton busy=\{refreshControl\.busy\}[^>]*icon=\{Refresh\}/);
  assert.match(source, /IconUtilityButton icon=\{theme === 'light' \? Moon : Sun\}/);
  assert.match(source, /className="brand-utilities"/);
  assert.doesNotMatch(source, /className="brand-utilities"><IconUtilityButton[^>]*icon=\{Refresh\}/);
  assert.doesNotMatch(source, /className="sidebar-utilities"/);
  assert.match(css, /--sidebar-width:\s*240px/);
  assert.doesNotMatch(source, /skill-mark|<p>Workflow<\/p>|welcome-mark|item\.icon|IconButton|navCompact|compact-nav|workspace-topbar/);
  assert.doesNotMatch(source, /\beyebrow\b/);
});

test('primary page descriptions stay brief and agent-collaborative', async () => {
  const source = await readFile(path.join(process.cwd(), 'app/components/designrun-workspace.tsx'), 'utf8');
  for (const title of ['To‑Do', 'Projects', 'Inspiration', 'Taste', 'Design System', 'Assets', 'Tools', 'Skills', 'Guide']) {
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = source.match(new RegExp(`title="${escapedTitle}" description="([^"]+)"`));
    assert.ok(match, `${title} needs a page description`);
    assert.ok(match[1].length <= 80, `${title} description should stay under 80 characters`);
    assert.match(match[1], /agent/i, `${title} description should explain agent collaboration`);
  }
});

test('welcome copy explains the harness-first operating model', async () => {
  const source = await readFile(path.join(process.cwd(), 'app/components/designrun-workspace.tsx'), 'utf8');
  assert.match(source, /Load designRun root folder in Cursor, Claude Code, Codex, etc\. designRun UI is simply the traceable surface for you and your agents’ design work\./);
});

test('tool registry names concrete design and implementation tools', async () => {
  const tools = await readFile(path.join(process.cwd(), 'resources/tools.md'), 'utf8');
  const expected = ['Motion for React', 'ReactBits', 'Hugeicons', 'Figma', 'Browser inspection', 'Image generation', 'React', 'Vite', 'TypeScript'];
  const files = await listFiles(path.join(process.cwd(), 'resources/tool-library'), (file) => file.endsWith('.md'));
  const records = await Promise.all(files.map(async (file) => ({ file, ...parseFrontmatter(await readFile(file, 'utf8')) })));
  assert.equal(records.length, expected.length);
  assert.deepEqual(records.sort((a, b) => a.attributes.order - b.attributes.order).map((record) => record.attributes.name), expected);
  for (const record of records) {
    assert.match(record.body, /^## Agent instructions$/m);
    assert.match(record.body, /^## Verification$/m);
    assert.match(record.attributes.official_url, /^https:\/\//);
  }
  assert.match(tools, /Tools do not replace the standards/);
});

test('each tool card opens its own source-backed document', async () => {
  const source = await readFile(path.join(process.cwd(), 'app/components/designrun-workspace.tsx'), 'utf8');
  const indexBuilder = await readFile(path.join(process.cwd(), 'scripts/build-workspace-index.mjs'), 'utf8');
  assert.match(source, /onSource\(entry\.document \?\? index\.tools\.source\)/);
  assert.match(indexBuilder, /documentFromFile\(file, 'tool'\)/);
  assert.match(indexBuilder, /document,\n\s+searchText:/);
});

test('skill actions describe the copied content as a prompt', async () => {
  const source = await readFile(path.join(process.cwd(), 'app/components/designrun-workspace.tsx'), 'utf8');
  assert.match(source, />Copy prompt<\/button>/);
  assert.match(source, /prompt copied/);
  assert.doesNotMatch(source, /Copy invocation|invocation copied/);
});

test('detail-opening rows use chevrons and the design-system explainer is absent', async () => {
  const source = await readFile(path.join(process.cwd(), 'app/components/designrun-workspace.tsx'), 'utf8');
  const css = await readFile(path.join(process.cwd(), 'app/app/globals.css'), 'utf8');
  assert.equal((source.match(/className="row-chevron"/g) ?? []).length, 3);
  assert.doesNotMatch(source, /className="system-map"/);
  assert.doesNotMatch(css, /\.system-map/);
});

test('reusable assets are manifest-driven and exclude inspiration evidence', async () => {
  const indexBuilder = await readFile(path.join(process.cwd(), 'scripts/build-workspace-index.mjs'), 'utf8');
  const manifest = JSON.parse(await readFile(path.join(process.cwd(), 'resources/asset-library/backgrounds/manifest.json'), 'utf8'));
  assert.match(indexBuilder, /assetManifestFiles/);
  assert.doesNotMatch(indexBuilder, /file\.includes\(`\$\{path\.sep\}inspiration-assets/);
  assert.ok(manifest.assets.every((asset) => asset.startsWith('resources/asset-library/')));
  assert.ok(manifest.assets.every((asset) => !asset.includes('/contact-sheets/')));
  assert.equal(manifest.assets.length, 4);
  assert.equal(manifest.supporting_files.length, 2);
});

test('inspiration follows its curated order', async () => {
  const files = await listFiles(path.join(process.cwd(), 'inspiration/library'), (file) => file.endsWith('.md'));
  const references = await Promise.all(files.map(async (file) => parseFrontmatter(await readFile(file, 'utf8')).attributes));
  assert.ok(references.every((reference) => Number.isInteger(reference.order) && reference.order > 0));
  assert.equal(new Set(references.map((reference) => reference.order)).size, references.length);
  references.sort((a, b) => a.order - b.order);
  assert.equal(references[0].name, 'Fey product polish');
  assert.equal(references[8].name, 'Cluely functional product mockup');
});
