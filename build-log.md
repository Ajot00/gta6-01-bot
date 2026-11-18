# R11 build log — STOP

One-session R11 fix round based on the R10 design. Local build, four deterministic staged renders, and checks were completed. This round is **not ready for submission or a top-20 claim**; visual review showed unresolved issues and the requested final polish pass was not completed.

## Checks

- Kit check: `5 passed, 0 failed, 17 skipped, 3 checked at submission`.
- CDP play test: `{errors:0,requests:0,hud:{cash:"19:42 $12,500 ♥ 100",place:"MARINA QUARTER"}}`; W/E/F dispatched and target closed cleanly.
- Browser check: all four shot URLs reported clean.
- Dossier double-run (byte-identical): `2b45f004ced23e1f1ae2932be890b88a` and `2b45f004ced23e1f1ae2932be890b88a`.
- No-pyramid source gate: `ConeGeometry` first arguments are `0.52` (palm fronds) and `3.8` (umbrellas), both ≤ 5. Eyeball: no pyramid/triangle mountain visible in shots 1–4.
- Screenshots: 1-cover.jpg (109760 bytes), 2-busted.jpg (105037 bytes), 3-city.jpg (108352 bytes), 4-east.jpg (104399 bytes).

## Required visual exclusions, recorded after inspecting all four native captures

- Pyramids: none visible in shots 1–4; terrain: visibly uneven in geometry but the road/ground reads largely pale and contrast is poor; tire tracks do not read clearly.
- Cars: wheels and lights exist in code, but cars read as blocky slabs at this camera scale; cover player is not fully framed as required.
- Officers: four are staged; the cover shot does not clearly prove four officers.
- Street: traffic and pedestrians exist; the cover is not a convincing close chase, pursuit cars are poorly framed, and the sea/palms are absent from that frame.
- Lots: varied clutter is staged, but shot 4 clutter reads as scattered boxes rather than legible contextual micro-scenes; no black placeholder box was intentionally added.
- Grounding: staging uses `terrainHeight` and contact shadows on several staged items, but player/contact-shadow coverage is incomplete and the shots contain severe shadow artifacts. Grounded gate is not visually passed.
- Shot 2: Nia is not clearly readable in the captured frame. Shot 3: camera is too high, foreground rooftops dominate, and waterfront activity is not legible.

## STOP reason

The first capture/inspect round exposed material camera, readability, grounding, and shadow failures. The capture batch also needed a rerun to complete all four targets. I stopped after the first fix cycle rather than claiming the visual gates passed. Next untried lever: rebuild the shot camera poses and ground/shadow presentation, then repeat the native-size review. No submission was made.
