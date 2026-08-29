import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ensureDirectory, isoDate, slugify, workspaceRoot } from './lib.mjs';

const [name, sourceUrl, sourceOwner] = process.argv.slice(2);

if (!name || !sourceUrl || !sourceOwner) {
  console.error('Usage: npm run new:reference -- "Reference name" "https://canonical-source.example" "Source owner"');
  process.exit(1);
}

let parsedUrl;
try {
  parsedUrl = new URL(sourceUrl);
} catch {
  console.error('The canonical source must be a valid http(s) URL.');
  process.exit(1);
}
if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
  console.error('The canonical source must use http or https.');
  process.exit(1);
}

const slug = slugify(name);
if (!slug) {
  console.error('The reference name must contain at least one letter or number.');
  process.exit(1);
}

const templatePath = path.join(workspaceRoot, 'templates', 'reference.md');
const referenceDirectory = path.join(workspaceRoot, 'inspiration', 'library');
const destination = path.join(referenceDirectory, `${slug}.md`);
let markdown = await readFile(templatePath, 'utf8');
const yamlDoubleQuoted = (value) => value
  .replaceAll('\\', '\\\\')
  .replaceAll('"', '\\"')
  .replaceAll('\r', '\\r')
  .replaceAll('\n', '\\n');

for (const [token, value] of Object.entries({
  '{{REFERENCE_NAME}}': name.trim(),
  '{{SOURCE_URL}}': parsedUrl.toString(),
  '{{SOURCE_OWNER}}': sourceOwner.trim(),
  '{{DATE}}': isoDate(),
})) {
  markdown = markdown.split(token).join(yamlDoubleQuoted(value));
}

await ensureDirectory(referenceDirectory);
try {
  await writeFile(destination, markdown, { flag: 'wx' });
} catch (error) {
  if (error?.code === 'EEXIST') {
    console.error(`Reference already exists: inspiration/library/${slug}.md`);
    process.exit(1);
  }
  throw error;
}

console.log(`Created inspiration/library/${slug}.md`);
console.log('Complete the observed behavior, transfer principle, limits, tags, capture method, and verification notes, then run npm run validate.');
