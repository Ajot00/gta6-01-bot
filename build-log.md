# R12 build log

Status: STOP after the second and final visual fix cycle. The clean-road shadow fix is verified, but shot composition remains below the requested target. This build is committed locally for review and has not been submitted.

Shadow-first result: the road and sidewalks follow terrainHeight. Shadow camera is tightened to ±62/±58, normalBias is 1.2, and bias is -0.003. Native-size review of shots 1, 2, and 4 found no zigzag black streaks; roads read as clean dark asphalt with lane dashes.

Per-shot exclusions, reviewed at native size and as a contact sheet:

- Pyramids: none visible in shots 1–4; ConeGeometry radii are 0.5 and 3.6 only.
- Terrain: uneven surface and sand tire-track texture are present.
- Cars: wheels, window bands, body volumes, lights, and police bars are present.
- Officers: four staged uniformed officers are present in shot 1.
- Street density: traffic and pedestrians are visible; pursuit cars are fully inside the cover frame but too small to read as a close chase.
- Lots: contextual props are staged in shots 2 and 4; several are cropped by nearby facades.
- Grounded: staged cars, people, and props use terrainHeight and shadow receiving.
- Shadow acne: none; roads read as clean asphalt in shots 1, 2, and 4.
- Composition: shot 2 has a small on-foot subject and a facade blocking much of the image; shot 3 is roof heavy with only a narrow sea view; shot 4 is obstructed by a nearby facade.

Plateau after two visual fix cycles: shot 1 cars became too small after pulling the camera back; shot 2 and shot 4 staging positions landed too close to building facades; lowering shot 3 did not uncover enough waterfront. The next untried lever is to rebuild these stage coordinates around the actual sidewalks and shoreline, then recapture all shots.

Verification: 12/12 local gates; kit check 5 passed, 0 failed, 17 skipped, 3 checked at submission. Smoke test: zero console errors, zero network requests, W/E/F responded, HUD values present. Browser check: shots 1–4 ready with zero console or network failures.

Dossier double-run MD5: f3f7a1a9174d0cd5ea2d4e5e860034f0 and f3f7a1a9174d0cd5ea2d4e5e860034f0.

Screenshots (1280×720 JPEG): 1-cover.jpg 123,927 bytes; 2-busted.jpg 86,930 bytes; 3-city.jpg 144,110 bytes; 4-east.jpg 85,354 bytes. Each is below 256 KiB.

README badge lines match the supplied template exactly. No-pyramid check: `rg -o 'ConeGeometry\\([^,]+' game/src/` yielded only `ConeGeometry(.5` and `ConeGeometry(3.6`; visual check found no pyramid or triangle mountain in shots 1–4.
