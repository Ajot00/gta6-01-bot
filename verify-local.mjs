import { cpSync, mkdirSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const out = resolve(root, 'out');
const caps = { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, game_max_files: 993, game_max_bytes: 50331648, game_path_max_bytes: 1000 };
const failures = [];
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const path = resolve(dir, entry.name);
  if (entry.isSymbolicLink()) failures.push(`symlink: ${path}`);
  return entry.isDirectory() ? walk(path) : [path];
});
const run = (cmd, args, env = process.env) => spawnSync(cmd, args, { cwd: root, env, encoding: 'utf8', maxBuffer: 2 * 1024 * 1024 });
const dimensions = bytes => {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if (bytes[0] !== 255 || bytes[1] !== 216) return null;
  let offset = 2;
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 255) { offset++; continue; }
    while (bytes[offset] === 255) offset++;
    const marker = bytes[offset++], length = bytes.readUInt16BE(offset);
    if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) return { height: bytes.readUInt16BE(offset + 3), width: bytes.readUInt16BE(offset + 5) };
    offset += length;
  }
  return null;
};

mkdirSync(out, { recursive: true });
const build = run('node', ['main.ts'], { ...process.env, MAKEFUN_OUTPUT_DIR: 'out' });
if (build.status !== 0) failures.push(`build failed: ${(build.stderr || build.stdout).slice(0, 500)}`);
const check = run('node', ['/home/hatch/workspace/makefun/kit-gta6-01/gta6-01-kit/cli/makefun.mjs', 'check']);
if (check.status !== 0) failures.push(`kit check failed: ${(check.stderr || check.stdout).slice(0, 500)}`);

const gameDir = resolve(out, 'game');
const gameFiles = walk(gameDir);
const gameBytes = gameFiles.reduce((sum, path) => sum + statSync(path).size, 0);
if (gameFiles.length > 993) failures.push(`game files ${gameFiles.length} > 993`);
if (gameBytes > 50331648) failures.push(`game bytes ${gameBytes} > 50331648`);
for (const path of gameFiles) if (Buffer.byteLength(path.slice(gameDir.length + 1)) > 1000) failures.push(`long path: ${path}`);
const indexPath = resolve(gameDir, 'index.html');
if (!statSync(indexPath).isFile() || statSync(indexPath).size > 1048576) failures.push('index.html missing or too large');

const screenshots = walk(resolve(out, 'screenshots'));
if (screenshots.length < 3 || screenshots.length > 4) failures.push(`screenshot count ${screenshots.length}`);
for (const path of screenshots) {
  const name = path.split('/').at(-1);
  const bytes = readFileSync(path);
  if (!/^[A-Za-z0-9._-]{1,128}$/.test(name) || /^[.-]/.test(name)) failures.push(`invalid screenshot name: ${name}`);
  if (bytes.length > 262144) failures.push(`screenshot too large: ${name}`);
  const size = dimensions(bytes);
  const jpg = bytes.length >= 4 && bytes[0] === 255 && bytes[1] === 216 && bytes.at(-2) === 255 && bytes.at(-1) === 217;
  if (!size || !jpg && !bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) failures.push(`not whole PNG/JPEG: ${name}`);
  if (size && (Math.max(size.width,size.height) > 1280 || Math.min(size.width,size.height) < 480)) failures.push(`bad dimensions: ${name} ${size.width}x${size.height}`);
}
const expected = run('node', ['--experimental-strip-types', '--input-type=module', '-e', `import {buildDossier} from './vendor/makefun-game.ts'; import {writeFileSync} from 'node:fs'; writeFileSync('out/dossier.expected.json',buildDossier('out',${JSON.stringify(caps)}));`]);
if (expected.status !== 0) failures.push(`dossier build failed: ${(expected.stderr || '').slice(0, 400)}`);
else if (!readFileSync(resolve(out, 'dossier.json')).equals(readFileSync(resolve(out, 'dossier.expected.json')))) failures.push('dossier mismatch');

const status = failures.length ? 'FAIL' : 'PASS';
console.log(`${status} game_files=${gameFiles.length} game_bytes=${gameBytes} screenshots=${screenshots.length} kit_check=${check.status === 0 ? 'PASS' : 'FAIL'} dossier_matches=${failures.some(f => /dossier/.test(f)) ? 'FAIL' : 'PASS'}`);
for (const failure of failures.slice(0, 20)) console.log(`- ${failure}`);
if (failures.length) process.exitCode = 1;
