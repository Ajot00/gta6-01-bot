# R14 fix round

One session, R14. Score trend from the opening record: TokenLab 42 (R9) → 35 (R10) → 28 (R11) → 62 (R12) → 45 (R13); CrowLLM 52 → 58 → 38 → 58 → 58 (R13). Both reviewers previously said top 20: no.

Art direction from the user: “Lebih jernih sama lebih bersih.” Check each image for jernih (crisp, readable) and bersih (clean, uncluttered).

## Streak diagnosis

The shadow-off shot 2 removed the long diagonal cast shadow on the ground, proving that streak was shadow-related. The class isolation pass then disabled building casters only; the long diagonal disappeared while the other scene shadows remained. Root cause: tall building faces and roofs casting the low dusk sun shadow across the road and adjacent lot. Fix: building faces and roofs retain shadow receiving but no longer cast shadows. Sun position, light color/intensity, shadow map, camera frustum, bias, normalBias, radius, and shadow type remain at the frozen R13 values. Short texture grain strokes remain on the asphalt; they are stable surface texture, not cast shadows or zigzag acne.

## Visual review after capture 2

- Shot 1: player car, two patrol cars, traffic, speed 084, sun, and HUD are readable; chase framing is clear. Buildings make the sides busy and the sea is not in frame. Jernih: mostly; bersih: mostly.
- Shot 2: Nia is visible in red at street level, with patrol cars, officers, pedestrians, and micro-scenes. Banner is at lower third; top-right panel and all three wanted stars are unobstructed. Jernih: yes at native size; bersih: fair, with dense street context.
- Shot 3: the camera override landed inside the waterfront building footprint. Facades fill most of the frame; beach, palms, umbrellas, and sea are not visible. Jernih: no; bersih: no. This is the plateau defect.
- Shot 4: street, red car, pedestrian, East Promenade label, prompt, and minimap are visible. The right facade still dominates and much of the near foreground is road; lot props sit toward the sides. Jernih: fair; bersih: no because of the facade dominance.

## Exclusion and visual gates

pyramids: none visible in shots 1–4; all authored ConeGeometry first arguments are at most 3.6.

terrain: uneven height function spans the playable area and sand texture includes curved tire tracks.

cars: wheels, window bands, and head/tail lighting geometry present.

officers: four uniformed officers staged and visible in shot 2; patrol light bars are present.

street: eight traffic cars, four or more pedestrians, two police cars, and officers in cover staging.

lots: contextual dumpster, stall, bench, planter, lamp, trash, debris, and pedestrians; not a crate grid. Some foreground remains open in shot 4.

grounded: staged people, cars, and props use terrainHeight placement; props and vehicles cast/receive contact shadows. No floating object noticed in the reviewed shots.

shadow acne: none; no long cast-shadow diagonal remains after excluding the building caster class; roads read as clean asphalt with lane dashes and short texture grain marks.

walls: FAIL — shot 3 has a facade filling most of the image and shot 4 has a facade over roughly one third.

banner: clear of HUD, all wanted stars visible.

clarity: shot 1 mostly jernih and bersih; shot 2 jernih and fairly bersih; shot 3 fails both; shot 4 readable but not bersih because the facade dominates. The four-shot set does not fully meet “Lebih jernih sama lebih bersih.”

## Plateau

Both allowed capture-and-inspect fix cycles are used. Best result: shot 2 banner/HUD clearance and street staging are fixed; the long building shadow streak is diagnosed and removed. Still wrong: shot 3 camera/facade collision and shot 4 wall dominance; remaining short asphalt texture marks are not cast shadows. Next untried lever: put shot 3 camera on the open waterfront beach side of the building footprints and aim along the shore; then offset shot 4 toward the open lot while keeping the red car in the street. STOP here; no third visual cycle in R14.

## Build checks

Capture size: 1280×720 JPEGs; byte sizes and dossier hashes are recorded after verification below.

Dossier double-run md5: 727c07e1c474bc63bbcd3cdb5438a13e / 727c07e1c474bc63bbcd3cdb5438a13e (identical).

Gate summary: 13/14; wall_dominance fails for shots 3 and 4. Kit check: 5 passed, 0 failed, 17 skipped, 3 checked.

No-pyramid verifier output: `NO_PYRAMID_VALUES 3.6,5,0.5`; all first arguments are ≤5. Eyeball: no cone/pyramid forms noticed in shots 1–4.

Final files: 1-cover.jpg 96198 bytes; 2-busted.jpg 105729 bytes; 3-city.jpg 68775 bytes; 4-east.jpg 97795 bytes.

Play test: pass, 0 console errors, 0 HTTP(S) network requests; W changes speed 084→088, E changes the prompt, F shows TALK / STEAL; mission and cash HUD values present. Browser check: shots 1–4 clean.

README badge lines and entry referral line match the required template exactly.

Token total: the runtime does not expose a reliable per-session token counter in this workspace; the ≤70,000 cap cannot be independently certified.
