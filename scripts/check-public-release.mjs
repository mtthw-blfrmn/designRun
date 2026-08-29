import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { listFiles, parseFrontmatter, readJson, workspaceRoot } from './lib.mjs';

const blockers = [];
const config = await readJson(path.join(workspaceRoot, 'designrun.config.json'));
const referenceFiles = await listFiles(
  path.join(workspaceRoot, config.inspirationDirectory),
  (file) => file.endsWith('.md') && path.basename(file) !== 'README.md',
);

for (const referenceFile of referenceFiles) {
  const relativePath = path.relative(workspaceRoot, referenceFile).split(path.sep).join('/');
  const { attributes } = parseFrontmatter(await readFile(referenceFile, 'utf8'));
  const hasCommittedMedia = typeof attributes.media === 'string' && attributes.media !== '' && attributes.media !== 'none';
  if (hasCommittedMedia && attributes.redistribution !== 'allowed') {
    blockers.push(`${relativePath}: committed media is ${attributes.redistribution ?? 'missing a redistribution decision'}`);
  }
  if (attributes.redistribution === 'private') blockers.push(`${relativePath}: private reference record is tracked`);
}

const assetManifestFiles = await listFiles(
  path.join(workspaceRoot, 'resources/asset-library'),
  (file) => path.basename(file) === 'manifest.json',
);
for (const assetManifestFile of assetManifestFiles) {
  const manifestPath = path.relative(workspaceRoot, assetManifestFile).split(path.sep).join('/');
  const manifest = JSON.parse(await readFile(assetManifestFile, 'utf8'));
  if ((manifest.assets?.length ?? 0) > 0 && manifest.redistribution !== 'allowed') {
    blockers.push(`${manifestPath}: ${manifest.assets.length} committed assets are ${manifest.redistribution ?? 'missing a redistribution decision'}`);
  }
}

if (blockers.length) {
  console.error(`Public release blocked (${blockers.length}):`);
  blockers.forEach((blocker) => console.error(`- ${blocker}`));
  console.error('Remove the files, replace them with distributable examples, or document explicit reusable rights and set redistribution: allowed.');
  process.exit(1);
}

console.log('Public release gate passed: no tracked private or unresolved-rights example media.');
