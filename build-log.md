# R18 build log

Art direction: every shot must read cleanly at a glance — **jernih** (crisp, readable: unobstructed subject, readable street/cars/HUD, sharp edges) and **bersih** (clean, uncluttered: no muddy foreground clutter, no wall filling the frame, no visual noise).

## Captured frame review

- Shot 1: player car fully inside the frame, police pursuit and light bars visible, sun disc visible. The nearest police car is still clipped at the left edge; motion reads mostly through road streaks and the police grouping. HUD is crisp; overall jernih, but the clipped cop and sparse road keep bersih from being fully clean.
- Shot 2: Nia is distinct in the foreground; police lights, pedestrians, street, BUSTED banner and full action prompt are visible. The frame reads jernih; facades and lot props remain busy but readable, so bersih is acceptable.
- Shot 3: sea, beach, colored domed umbrellas and palms read; props, towels, footprints and beachgoers break up the sand. The sky and sand still occupy broad open areas. Subject clarity is jernih; bersih is partial because the distant sky and sand remain sparse.
- Shot 4: Nia is at about 62% of frame width and about 17% of frame height; red car and E prompt are clear. Foreground lot props are not prominent enough, so the composition reads jernih but the lot still feels sparse for bersih.

## Required visual exclusions

- shadow acne: PASS — no jagged acne pattern visible in the four final frames.
- walls: PASS — no single facade dominates more than about 40% of a frame.
- banner: PASS — BUSTED remains in the lower center and clear of the full top-right stars, time and cash panel.
- texture: PASS — shadow-off test preserved the broad diagonal road mark, proving a texture artifact; lowered the track contrast and width. No wide dark band remains in the final frames, though fine light diagonal road marks remain visible.
- hud: PASS — action prompts are fully visible in all four frames; minimap bottom-left and speed bottom-right in every frame.
- camera clearance: PASS — footprint and near-plane ray checks passed all four staged cameras; minimum recorded car clearance is 7.1 units. Distances below list traffic cars then police cars.
- clarity: PASS WITH RESIDUALS — each subject and HUD reads at a glance, while shot 1's edge-clipped police car and open sand/lot areas remain polish plateaus.

## Staging and collision record

- Shot 1 final camera: `[0, 2.5, -88]`; player `(0, -110)`; police `(−3, −95)` and `(3, −103)`, angled inward; sun disc `(0, 42, −330)` visible. Horizontal car distances: `25.5, 11.2, 7.1, 20.6, 35.4, 50.2, 65.2, 80.2, 7.6, 15.3`.
- Shot 2 camera `[-1, 4, -11]`; Nia clearance is 15.0. Car distances: `56.6, 60.3, 64.2, 68.2, 72.4, 76.7, 81.0, 85.4, 20.2, 28.4`.
- Shot 3 camera `[292, 9, -73]`; Nia clearance is 272.6. Car distances: `301.0` for all eight traffic and two police cars.
- Shot 4 camera `[7, 1.4, -8]`; Nia is 12.0 units away (staged subject excluded from collision list). Car distances: `18.4, 49.7, 53.6, 57.7, 61.9, 66.2, 70.7, 75.2, 10.6, 10.6`.
- Collision guard: footprint test PASS 4/4; building near-plane ray test PASS 4/4; all `window.__cameraGuard` car distances are at least 7.0 units.
- no_pyramid: PASS — `rg 'ConeGeometry\(' game/src/city.js` returned no matches; visual check confirms no pointed high-sided cone assets.
- lots_populated: PASS — verifier now counts `clutter()` calls with numeric arguments and requires four.

## Verifier and run results

- Shadow-band toggle: the diagonal band persisted with `renderer.shadowMap.enabled=false` and `sun.castShadow=false` in shots 1 and 4; texture/terrain artifact. Track band opacity and width were reduced at the road texture source.
- Dossier double-run: `out-r18-a/dossier.json` MD5 `f5f8c7dba28cf25cf202893d8aabe4f2`; `out-r18-b/dossier.json` MD5 `f5f8c7dba28cf25cf202893d8aabe4f2` (identical).
- Smoke test: PASS — zero console exceptions, zero network requests, HUD present, W/E/F sent, CDP target cleanup completed.
- Browser check: PASS — all four staged routes reached `window.__shotReady`; per-camera guard data recorded above.
- README badge lines: match the supplied template exactly.

## R18 plateau

One correction cycle used. No further capture/fix cycle was run. The main remaining visual issues are the left-edge police crop in shot 1, fine diagonal road marks, and sparse lot/sand foregrounds in shots 3 and 4. This round stops for coordinator review.
