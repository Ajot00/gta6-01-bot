# R13 build log

Single R13 session; camera-only fix round. Direction verbatim: “Lebih jernih sama lebih bersih” — cleaner and clearer. The camera spring arm checks the full city footprint registry and shortens the arm until it clears facades by six units. Fixed shadow values, dusk palette, HUD and scene design were held to R12.

Eye check after native-size capture; “jernih” and “bersih”:
- Shot 1: clear chase road, player and patrol cars fully framed with HUD legible; patrol light bar is small at this scale. Generally jernih and bersih.
- Shot 2: Nia is visible but tiny, the facade occupies over one third of frame, and road has dark streaks. Not sufficiently jernih or bersih.
- Shot 3: beach, palms, colored umbrellas and teal sea read clearly; rooftops stay to the right, not across the foreground. Jernih and bersih.
- Shot 4: red car, pedestrians, lot, prompt and label are legible, but the nearest facade takes too much of the frame and road shows dark streaks. Not fully jernih or bersih.

Pyramids: none prominent in shots 1–4; terrain: uneven, tire marks visible; cars: wheels/windows/light geometry present; officers: four authored and staged; street: eight traffic cars plus two police cars and pedestrian groups; lots: micro-scene props staged, no crate grid; grounded: staged actors/cars/props use terrainHeight; shadow acne: dark streaks remain visible on shots 2 and 4 despite R12 shadow values; walls: shot 2 and shot 4 exceed the ~1/3 facade limit; clarity: shots 1 and 3 read jernih and bersih, shots 2 and 4 do not fully meet the direction.

Plateau after the single camera fix cycle: shot 3 improved; shot 2 and shot 4 remain blocked by the existing footprint/staging geometry and road streaks. Next untried lever: re-stage Nia/camera relative to the sidewalk footprint and shift the East camera toward the street center while testing the frozen shadow setup's interaction with those road angles. No second iteration performed.

Final polish: raised the live chase camera anchor slightly for a clearer view over the player car. Staged shots are unchanged by this live-only adjustment.

Determinism check: dossier md5 2d4c23aa77d9221ec3ab914795f73555 on both independent main.ts runs.
Kit check: 5 passed, 0 failed, 17 skipped, 3 checked at submission; remaining checks are server-side.

STATUS: verification complete; 11/13 local gates pass. `no_shadow_acne` and `wall_dominance` fail against the captures; see the native-size notes above.
