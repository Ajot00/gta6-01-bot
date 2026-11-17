import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd(), out = join(root, 'out'), rows = [];
const row = (name, pass, detail) => rows.push({ name, pass, detail });
function walk(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => {
    const path = join(dir, e.name), rel = path.slice(base.length + 1);
    if (e.isSymbolicLink()) return [{ path, rel, link: true }];
    if (e.isDirectory()) return [{ path, rel, dir: true }, ...walk(path, base)];
    return [{ path, rel, file: true }];
  });
}
try {
  execFileSync(process.execPath, ['main.ts'], { cwd: root, env: { ...process.env, MAKEFUN_OUTPUT_DIR: out }, stdio: 'pipe' });
  const files = walk(join(out, 'game'));
  const bytes = files.reduce((n, f) => n + (f.file ? statSync(f.path).size : 0), 0);
  const bad = files.filter(f => f.link || Buffer.byteLength(f.rel) > 1000);
  row('game_files', existsSync(join(out, 'game/index.html')) && !bad.length && files.length <= 993 && bytes <= 50331648 && statSync(join(out, 'game/index.html')).size <= 1048576,
    `${files.length} entries, ${bytes} bytes, ${bad.length} invalid paths`);
  const html = readFileSync(join(out, 'game/index.html'), 'utf8');
  const local = s => !/^(?:https?:)?\/\//i.test(s) && !s.startsWith('data:') && !s.startsWith('blob:');
  const refs = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/gi)].map(m => m[1]);
  const maps = [...html.matchAll(/<script\s+type=["']importmap["']\s*>([\s\S]*?)<\/script>/gi)].map(m => JSON.parse(m[1]));
  const mapped = maps.flatMap(map => Object.values(map.imports ?? {}));
  const scriptPaths = refs.filter(s => /\.(?:m?js)(?:[?#].*)?$/i.test(s)).map(s => join(out, 'game', s));
  const imports = scriptPaths.filter(existsSync).flatMap(path => [...readFileSync(path, 'utf8').matchAll(/from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g)].map(m => m[1] || m[2]));
  const unmapped = [...refs, ...mapped].filter(s => !local(s));
  const bare = imports.filter(s => !s.startsWith('.') && !s.startsWith('/') && !s.startsWith('data:') && !maps.some(map => Object.hasOwn(map.imports ?? {}, s)));
  const cli = join(root, '../kit-gta6-01/gta6-01-kit/cli/makefun.mjs');
  const check = execFileSync(process.execPath, [cli, 'check', '--worktree'], { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  row('references', !unmapped.length && !bare.length, `local/static refs ${refs.length + mapped.length + imports.length}; ${unmapped.length + bare.length} remote or unmapped`);
  const shots = walk(join(out, 'screenshots')).filter(f => f.file);
  const goodShots = shots.length >= 3 && shots.length <= 4 && shots.every(f => {
    const b = readFileSync(f.path), png = b.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
    const jpg = b[0] === 255 && b[1] === 216 && b.at(-2) === 255 && b.at(-1) === 217;
    const w = png ? b.readUInt32BE(16) : 0, h = png ? b.readUInt32BE(20) : 0;
    const dimensions = png ? Math.max(w,h) <= 1280 && Math.min(w,h) >= 480 : jpg && b.length > 4;
    return /^(?![.-])[A-Za-z0-9._-]{1,128}$/.test(f.rel) && b.length <= 262144 && dimensions;
  });
  row('screenshots', goodShots, `${shots.length} image files; byte and PNG dimensions checked`);
  const dossier = readFileSync(join(out, 'dossier.json'));
  const rebuilt = execFileSync(process.execPath, ['--input-type=module', '-e', `import {buildDossier} from './vendor/makefun-game.ts'; process.stdout.write(buildDossier('./out',{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},game_max_files:993,game_max_bytes:50331648,game_path_max_bytes:1000}))`], { cwd: root });
  row('dossier_matches', dossier.equals(rebuilt), `dossier ${dossier.length} bytes; rebuilt ${rebuilt.length}`);
  console.log(check.slice(0, 1200).trim());
} catch (e) { row('build_or_gate', false, String(e.stderr ?? e.message).slice(0, 600)); }
for (const r of rows) console.log(`${r.pass ? 'PASS' : 'FAIL'} ${r.name}: ${r.detail}`);
console.log(`gate ${rows.filter(r => r.pass).length}/${rows.length}`);
