# R16 build log

Art direction verbatim: LEBIH JERNIH SAMA LEBIH BERSIH. Every shot checked at native size.

R15 residual causes addressed: shot 4 camera/car proximity; Nia similarity; repeating diagonal road texture marks; absent building tags in the near-plane camera ray. The road marks were authored strokes in the road canvas, not shadows. Replaced them with longitudinal bands and retained the center dashed lane marking. Added building and roof ray tags; vehicle/Nia clearance is applied in the camera spiral.

The one capture-and-inspect fix cycle changed camera clearance to 7 units and pulled shot 4 farther back. Final shot 4 camera is [7,1.4,-11], looking toward [7,1,-27]; the red car is [11,terrainHeight(11,-26),-26]. Shot 3 remains [292,9,-73] looking toward [300,0,12], fov 59. Nia treatment: 1.5 scale, dark back-face outline around torso and head, white headband, gold sash trim.

Camera guard design check: footprint check and tagged-building near-plane ray ran without a runtime error for all four staged shots. Per-camera horizontal distances to the nearest staged car/Nia: shot 1 camera [1.5,3.7,-96], nearest vehicle 7.11; shot 2 camera [-1,4,-11], nearest Nia 15.03; shot 3 camera [292,9,-73], nearest Nia 272.62; shot 4 camera [7,1.4,-11], nearest Nia 9.00. Every listed minimum exceeds 3.0. The guard writes camera position, both booleans, and distances to window.__cameraGuard.

Shot 1: jernih (traffic, player, road, HUD visible); bersih (road has no thin diagonal marks), but large facades remain at both edges.
Shot 2: not fully jernih or bersih; BUSTED is clear of the HUD and all three stars, but the building corridor dominates and Nia remains hard to pick from the pedestrian row.
Shot 3: sea and colored umbrellas read; buildings stay to one side. Palm silhouettes do not read clearly as palms. Jernih in the waterfront claim, but the foreground beach is broad and visually sparse, so bersih is partial.
Shot 4: Nia and red car are visible with no tire filling the frame; facades exceed 40% and the staged lot clutter is outside the useful foreground. Jernih is partial; bersih fails the facade criterion.

Eyeball exclusions from final screenshots:
pyramids: none visible in shots 1–4; cone first arguments are .5 and 3.6, both <=5.
terrain: uneven, tire tracks and lane dashes visible.
cars: wheels, window bands, lights present.
officers: four uniformed officers created; visible at small scale in the staged road.
street: eight traffic cars and two police cars are staged in the cover; pedestrians present.
lots: micro-scene props are created at both specified staging locations, but shot 4 foreground does not read as filled.
grounded: staged vehicles and people use terrainHeight; visible contact shadows are present.
shadow acne: none; asphalt reads as dark roadway with lane dashes.
wall_dominance: FAIL — shot 2 and shot 4 building faces exceed 40% of the frame.
banner_hud_overlap: PASS — BUSTED banner is clear of the top-right panel and all wanted stars.
no_texture_streak: PASS — shots 1, 2, and 4 show no thin diagonal asphalt lines; longitudinal bands and lane dashes remain.
camera_car_clearance: PASS — all four cameras pass the footprint and near-plane ray checks; each reported nearest car/Nia distance is above 3.0.
clarity: shot 1 jernih and bersih; shot 2 fails bersih and Nia legibility; shot 3 beach/sea claim is jernih, palms and foreground cleanliness are partial; shot 4 fails bersih due wall dominance and lot visibility.

Shot files (1280x720 JPEG): 1-cover.jpg 56921 bytes; 2-busted.jpg 67263 bytes; 3-city.jpg 48513 bytes; 4-east.jpg 51107 bytes. Each was inspected once at native size. No second inspection or visual fix cycle was performed.

Texture source fix: removed the repeating short diagonal strokes from city.js road canvas and drew two full-height dark longitudinal strokes at x=170 and x=342, alpha .5, width 16. Shadow configuration retained: sun (-38,52,-44), #ffd29b intensity 3.3, 2048 map, frustum -62/62/58/-58, near .5, far 180, bias -.003, normalBias 1.2, radius 3, PCFSoftShadowMap.

No-pyramid source check: game/src/city.js:ConeGeometry(.5 and game/src/city.js:ConeGeometry(3.6; both first arguments are <=5; no pyramid-shaped cone appears in the four renders. Verifier final result: 15/16. Only wall_dominance fails on the inspected evidence above. Dossier double-run md5 values: 8f7cea681e95908f57a6317aaeeeb26a and 8f7cea681e95908f57a6317aaeeeb26a (identical). The initial verifier attempt stopped because build-log.md had not been written yet; the final verifier completed. Kit check: 5 passed, 0 failed, 17 skipped, 3 checked at submission. Browser check: four shots, zero console errors and zero failed requests. Play check: zero console errors, zero HTTP requests, HUD stars/time/cash present, W/E/F dispatched; helper cleanup completed.

STOP: the allowed one verify-fix cycle is complete. Best result: clean asphalt, clear banner, and resolved shot 4 car overlap. Still wrong: shot 2 wall corridor/Nia legibility; shot 3 palm readability; shot 4 facade dominance/foreground lot visibility. Next untried lever: recompose shots 2 and 4 from street center with a lower, wider camera and move shot 4 lot props into the camera foreground; rework the palm silhouettes without changing the frozen beach framing.
