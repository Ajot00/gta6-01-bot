# R17 build log

Direction, verbatim: “LEBIH JERNIH SAMA LEBIH BERSIH” — every shot must read cleanly at a glance — jernih (crisp, readable: unobstructed subject, readable street/cars/HUD, sharp edges) and bersih (clean, uncluttered: no muddy foreground clutter, no wall filling the frame, no visual noise).

One R17 session. R16 scene design restored with the requested HUD, police, road texture, city jitter/palette variation and Nia treatment. Shot 3 framing and all frozen light/shadow values remain as specified. No submission made.

## Runtime camera and collision record

The near-plane building ray and footprint check passed in all four staged shots. Car clearance is enforced against all eight traffic cars and both police cars; Nia is excluded and her horizontal distance is recorded separately. Shot 1 camera was nudged by the guard from requested [0,3.7,-96] to [4,3.7,-96], target [0,1.1,-123]. Police positions: [-3,-95] and [3,-103] in x/z; player [0,-110]. Sun-disc mesh exists at [0,42,-330], but it is NOT discernible in the captured shot 1. Shot 1 car distances: 34.21, 18.03, 9.49, 12.04, 28.46, 42.01, 57.71, 72.01, 7.07, 7.07 units; Nia distance 75.69.

Shot 2 camera [-1,4,-11]; car distances 56.59, 60.31, 64.20, 68.24, 72.40, 76.66, 81.01, 85.42, 20.22, 28.44; Nia distance 15.03. Shot 3 camera [292,9,-73]; ten measured car distances 300.99; Nia distance 272.62. Shot 4 final camera [7,1.4,-8], target [7,1,-27]; Nia at [7,-20] is about 20% of frame height (roughly 143 px / 720), but is centered rather than at a rule-of-thirds position. Red car [11,-26] is visible in the midground. Shot 4 car distances: 18.44, 49.68, 53.60, 57.69, 61.91, 66.24, 70.66, 75.15, 10.63, 10.63; Nia distance 12.00.

## Native-size eyeball exclusions

- no_pyramid: no pyramid forms visible in shots 1–4; source ConeGeometry first arguments are 0.5 and 3.6 (both ≤5).
- uneven_terrain: undulating ground and longitudinal road texture bands are present.
- detailed_cars / officers / density: wheels, window bands and police light bars present; 4 officers defined; 8 traffic cars and 2 police cars staged for shot 1.
- lots: shot 2 and shot 4 staging each has stall, dumpster, benches, planter, lamp, trash and debris props; no regular crate grid.
- grounded: staged cars, people and props use terrainHeight; contact shadows enabled on cars and scene objects.
- shadow acne: no obvious zigzag acne; road has no diagonal tick marks.
- walls: no single facade visually exceeds 40% of any captured frame; shot 2 and shot 4 remain corridor-like.
- banner: BUSTED is lower-center in shot 2; top-right panel and all three wanted stars are fully visible.
- texture: no thin diagonal streaks; longitudinal tire bands and lane marks remain.
- camera clearance: footprint + near-plane ray passed all 4; all recorded car distances are ≥7.07; staged cameras meet ≥7 units. Nia excluded from clearance and separately measured above.
- hud: minimap bottom-left, speed bottom-right, and action prompts fully visible and unobstructed in all 4 images.
- clarity: shot 1 is readable but the foreground player car is oversized and the sun is absent from view; shot 2 HUD and subjects read, though the blocky corridor remains busy; shot 3 sea and umbrellas read but the open sand is sparse and palms are not clearly legible; shot 4 street, red car and prompt read, though Nia is centered and the lot feels open. The set is not uniformly jernih and bersih.

## Validation

Verifier result: 16/17. `lots_populated` is the sole failure because this source-pattern gate expects the micro-scene's prop names to occur twice in the function body; the code defines one list of 8 contextual props and invokes `clutter()` twice in shot 2 and twice in shot 4. All other reported gates pass. Dossier double-run MD5: `482ed279102f756b9db2ad5802ec44e7` for both output directories. Smoke test: 0 console errors; HUD loaded; W/E/F key events sent. Kit check: 5 passed, 0 failed, 17 skipped, 3 checked at submission. Browser check confirms `__shotReady` and footprint/ray/car guard values for all four shots.

README badge lines use the required three exact URLs and campaign query strings.
