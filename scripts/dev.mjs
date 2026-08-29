import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import path from 'node:path';
import { readJson, workspaceRoot } from './lib.mjs';

const config = await readJson(path.join(workspaceRoot, 'designrun.config.json'));
let indexTimer;
let indexing = false;
let indexAgain = false;

async function rebuildIndex() {
  if (indexing) {
    indexAgain = true;
    return;
  }
  indexing = true;
  const child = spawn(process.execPath, [path.join(workspaceRoot, 'scripts', 'build-workspace-index.mjs')], {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });
  await new Promise((resolve, reject) => {
    child.once('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Index build exited ${code}`))));
    child.once('error', reject);
  }).catch((error) => console.error(error.message));
  indexing = false;
  if (indexAgain) {
    indexAgain = false;
    void rebuildIndex();
  }
}

await rebuildIndex();

const watchedRoots = [
  'README.md',
  'START-HERE.md',
  'docs',
  'knowledge',
  'taste',
  'inspiration',
  config.resourcesDirectory,
  config.projectsDirectory,
  config.patternsDirectory,
  config.skillsDirectory,
];

const watchers = [];
for (const watchedRoot of watchedRoots) {
  const watchedPath = path.join(workspaceRoot, watchedRoot);
  try {
    watchers.push(
      watch(watchedPath, { recursive: true }, () => {
        clearTimeout(indexTimer);
        indexTimer = setTimeout(() => void rebuildIndex(), 180);
      }),
    );
  } catch {
    // Optional directories can be created after the development server starts.
  }
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const app = spawn(npmCommand, ['run', 'dev', '--workspace=designrun-app', '--', '--host', '127.0.0.1', '--port', String(config.localAppPort), '--strictPort', '--force'], {
  cwd: workspaceRoot,
  stdio: 'inherit',
  env: process.env,
});

function close(signal) {
  watchers.forEach((watcher) => watcher.close());
  app.kill(signal);
}

process.on('SIGINT', () => close('SIGINT'));
process.on('SIGTERM', () => close('SIGTERM'));
app.on('exit', (code) => process.exit(code ?? 0));
app.on('error', (error) => {
  watchers.forEach((watcher) => watcher.close());
  console.error(`Could not start the control center: ${error.message}`);
  process.exit(1);
});
