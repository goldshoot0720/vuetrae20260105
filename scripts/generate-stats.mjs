import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const includeExtensions = new Set(['.vue', '.js', '.css', '.html']);
const includeRoots = ['src', 'public'];
const extraFiles = ['index.html'];

function collectFiles(targetPath) {
  if (!fs.existsSync(targetPath)) return [];
  const stat = fs.statSync(targetPath);

  if (stat.isFile()) {
    return includeExtensions.has(path.extname(targetPath)) ? [targetPath] : [];
  }

  const entries = fs.readdirSync(targetPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    files.push(...collectFiles(path.join(targetPath, entry.name)));
  }
  return files;
}

const files = [
  ...includeRoots.flatMap((dir) => collectFiles(path.join(root, dir))),
  ...extraFiles
    .map((file) => path.join(root, file))
    .filter((file) => fs.existsSync(file) && includeExtensions.has(path.extname(file)))
];

const codeLineCount = files.reduce((total, file) => {
  const content = fs.readFileSync(file, 'utf8');
  return total + content.split(/\r\n|\n|\r/).length;
}, 0);

let lastUpdated = new Date().toISOString().slice(0, 10);
try {
  lastUpdated = execSync('git log -1 --format=%cs', { cwd: root, encoding: 'utf8' }).trim() || lastUpdated;
} catch {
  // Fallback keeps today's date when git metadata is unavailable.
}

const outputDir = path.join(root, 'public');
const outputFile = path.join(outputDir, 'app-stats.json');

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(
  outputFile,
  JSON.stringify(
    {
      codeLineCount,
      lastUpdated
    },
    null,
    2
  ) + '\n',
  'utf8'
);

console.log(`Generated ${path.relative(root, outputFile)} with ${codeLineCount} lines, updated ${lastUpdated}`);
