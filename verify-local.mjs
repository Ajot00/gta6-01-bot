import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.dirname(new URL(import.meta.url).pathname);
const out = path.join(root, 'out');
const run = spawnSync(process.execPath, [path.join(root, 'main.ts')], { cwd: root, env: { ...process.env, MAKEFUN_OUTPUT_DIR: out }, encoding: 'utf8' });
if (run.status !== 0) throw new Error(`build failed: ${run.stderr.slice(0, 1200)}`);
const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const gameFiles = files(path.join(out, 'game'));
const shots = files(path.join(root, 'screenshots'));
const size = (arr) => arr.reduce((n, f) => n + fs.statSync(f).size, 0);
const html = fs.readFileSync(path.join(root, 'game/index.html'), 'utf8');
const paths = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map(m => m[1]);
const checks = {
  game_files: gameFiles.length > 0 && gameFiles.length <= 993 && size(gameFiles) <= 48 * 1024 * 1024 && gameFiles.every(f => fs.lstatSync(f).isFile() && Buffer.byteLength(path.relative(out, f)) <= 1000) && fs.statSync(path.join(out, 'game/index.html')).size <= 1024 * 1024,
  references: paths.every(p => !/^https?:|^\/\//i.test(p) && !p.startsWith('..')),
  screenshots: shots.length >= 3 && shots.length <= 4 && shots.every(f => fs.statSync(f).size <= 256 * 1024 && /\.(png|jpe?g)$/i.test(f)),
  dossier_matches: fs.existsSync(path.join(out, 'dossier.json'))
};
for (const [k,v] of Object.entries(checks)) console.log(`${v ? 'PASS' : 'FAIL'} ${k}`);
console.log(`PASS COUNT ${Object.values(checks).filter(Boolean).length}/4`);
const kit = process.env.MAKEFUN_KIT || '/home/hatch/workspace/makefun/kit-gta6-01/gta6-01-kit/cli/makefun.mjs';
const check = spawnSync(process.execPath, [kit, 'check'], { cwd: root, encoding: 'utf8' });
console.log(`KIT ${check.status === 0 ? 'PASS' : 'FAIL'} ${check.status}`);
if (check.status !== 0) process.exitCode = 1;
