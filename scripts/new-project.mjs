import path from 'node:path';
import {
  copyTemplate,
  isoDate,
  pathExists,
  slugify,
  workspaceRoot,
} from './lib.mjs';

const projectName = process.argv.slice(2).join(' ').trim();

if (!projectName) {
  console.error('Usage: npm run new:project -- "Product name"');
  process.exit(1);
}

const slug = slugify(projectName);
if (!slug) {
  console.error('The product name must contain at least one letter or number.');
  process.exit(1);
}

const destination = path.join(workspaceRoot, 'projects', slug);
if (await pathExists(destination)) {
  console.error(`Project already exists: projects/${slug}`);
  process.exit(1);
}

await copyTemplate(path.join(workspaceRoot, 'templates', 'project'), destination, {
  '{{PROJECT_NAME}}': projectName,
  '{{PROJECT_SLUG}}': slug,
  '{{DATE}}': isoDate(),
});

console.log(`Created projects/${slug}`);
console.log(`Next: open projects/${slug}/brief.md and shape the product brief.`);
