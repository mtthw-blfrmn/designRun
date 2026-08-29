import path from 'node:path';
import { copyTemplate, isoDate, pathExists, slugify, workspaceRoot } from './lib.mjs';

const [projectInput, ...deliverableParts] = process.argv.slice(2);
const projectSlug = slugify(projectInput ?? '');
const deliverableName = deliverableParts.join(' ').trim();
const deliverableSlug = slugify(deliverableName);

if (!projectSlug || !deliverableName || !deliverableSlug) {
  console.error('Usage: npm run new:deliverable -- <project-slug> "Deliverable name"');
  process.exit(1);
}

const projectRoot = path.join(workspaceRoot, 'projects', projectSlug);
if (!(await pathExists(path.join(projectRoot, 'README.md')))) {
  console.error(`Project not found: projects/${projectSlug}`);
  process.exit(1);
}

const destination = path.join(projectRoot, 'deliverables', deliverableSlug);
if (await pathExists(destination)) {
  console.error(`Deliverable already exists: projects/${projectSlug}/deliverables/${deliverableSlug}`);
  process.exit(1);
}

await copyTemplate(path.join(workspaceRoot, 'templates', 'deliverable'), destination, {
  '{{DELIVERABLE_NAME}}': deliverableName,
  '{{DELIVERABLE_SLUG}}': deliverableSlug,
  '{{DATE}}': isoDate(),
});

console.log(`Created projects/${projectSlug}/deliverables/${deliverableSlug}`);
console.log(`Next: replace the README scaffold with the deliverable's real outcome, boundary, sources, and verification.`);
