import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const out = join(root, 'out');
const rows = [];
function row(name, pass, detail) { rows.push({ name, pass, detail }); }
function walk(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const path = join(dir, entry.name);
    const rel = path.slice(base.length + 1);
    if (entry.isSymbolicLink()) return [{ path, rel, symlink: true }];
    if (entry.isDirectory()) return [{ path, rel, directory: true }, ...walk(path, base)];
    return [{ path, rel, file: true }];
  });
}

try {
  execFileSync(process.execPath, ['main.ts'], { cwd: root, env: { ...process.env, MAKEFUN_OUTPUT_DIR: out }, stdio: 'pipe' });
  const files = walk(join(out, 'game'));
  const gameBytes = files.reduce((n, item) => n + (item.file ? statSync(item.path).size : 0), 0);
  const invalid = files.filter(item => item.symlink || (item.file && Buffer.byteLength(item.rel) > 1000));
  row('game_files', existsSync(join(out, 'game/index.html')) && !invalid.length && files.length <= 993 && gameBytes <= 50331648 && statSync(join(out, 'game/index.html')).size <= 1048576,
    `${files.length} entries, ${gameBytes} bytes, ${invalid.length} invalid paths`);

  const cli = join(root, '../kit-gta6-01/gta6-01-kit/cli/makefun.mjs');
  const check = execFileSync(process.execPath, [cli, 'check', '--worktree'], { cwd: root, encoding: 'utf8', stdio: 'pipe' });
  row('references', true, 'kit check invoked separately; ' + check.slice(0, 240).replaceAll('\n', ' '));

  const shots = walk(join(out, 'screenshots')).filter(item => item.file);
  const shotGood = shots.length >= 3 && shots.length <= 4 && shots.every(item => {
    const bytes = readFileSync(item.path);
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes.at(-2) === 255 && bytes.at(-1) === 217;
    const png = bytes.subarray(0, 8).toString('hex') === '89504e470d0a1a0a';
    const width = png ? bytes.readUInt32BE(16) : 0, height = png ? bytes.readUInt32BE(20) : 0;
    return /^(?![.-])[A-Za-z0-9._-]{1,128}$/.test(item.rel) && bytes.length <= 262144 && (png && Math.max(width,height)<=1280 && Math.min(width,height)>=480 || jpeg);
  });
  row('screenshots', shotGood, `${shots.length} image files; dimensions checked by kit check`);

  const dossier = readFileSync(join(out, 'dossier.json'));
  const rebuilt = execFileSync(process.execPath, ['--input-type=module', '-e', `import {buildDossier} from './vendor/makefun-game.ts'; process.stdout.write(buildDossier('./out',{text_max_bytes:163840,screenshots:{max:4,max_bytes:262144},game_max_files:993,game_max_bytes:50331648,game_path_max_bytes:1000}))`], { cwd: root });
  row('dossier_matches', dossier.equals(rebuilt), `dossier ${dossier.length} bytes; rebuilt ${rebuilt.length} bytes`);
} catch (error) {
  row('build_or_gate', false, String(error.stderr ?? error.message).slice(0, 500));
}
for (const item of rows) console.log(`${item.pass ? 'PASS' : 'FAIL'} ${item.name}: ${item.detail}`);
console.log(`gate ${rows.filter(item => item.pass).length}/${rows.length}`);
