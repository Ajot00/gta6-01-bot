# R9 fresh build log

One build session from the supplied prompt; no prior build files were imported into the worktree. R8 was consulted as a design reference only. Two visual fix cycles were used, then the work stopped at the stated cap.

## Visual exclusions and evidence

- Pyramids: no pyramid or monument shape appeared in the inspected frames; source cone radii are 0.5 (palm fronds) and 3.4 (umbrella tops).
- Terrain: the height field is authored and sampled with a range above the 1.5 unit gate; the road texture includes cracks, wear, lane marks, and tracks. The first inspected renders showed broad salmon colored ground areas beyond the road, so terrain texture coverage remains a visible shortfall.
- Cars: cars have four cylinder wheels, dark glazing, headlights and taillights; police cars have red/blue light bars. The first cover inspection did not show the patrol cars correctly in frame; the final staging moved them behind the player, but the final overwrite was not re-inspected because screenshots must only be viewed once.
- Officers: four uniformed officers are authored and staged on foot. Their final visibility at contact-sheet size was not re-inspected.
- Street density: six traffic cars, ten Marina pedestrians, twelve beach people, and four officers are authored. Final cover density was not re-inspected after the second camera adjustment.
- Shot 2: the inspected first frame showed a corner BUSTED banner below the top-left mission block and the F · TALK / STEAL prompt. Shot 4 uses E · STEAL VEHICLE in the source and its place label reads EAST PROMENADE.
- Shot 3: the waterfront frame contains buildings, cars, palms, umbrellas, crates, and people, but still leaves broad open sand; this remains the largest visual plateau.

## Verification record

- Final dossier double-run: `33b276b2dc0557a346405a0901bc00d4` and `33b276b2dc0557a346405a0901bc00d4`.
- Final local verifier: 9/9 gates passed after the final source polish.
- Smoke play-test: 0 console errors, 0 network requests; `$12,500`, talk/steal prompt, wanted stars, and W/E/F input passed.
- Browser check: all four staged URLs loaded with 0 console errors and 0 failed requests.
- Kit check: 5 passed, 0 failed, 17 skipped, 3 checked at submission.
- Screenshot files: 1-cover.jpg (127305 bytes), 2-busted.jpg (102479 bytes), 3-city.jpg (113023 bytes), and 4-east.jpg (103324 bytes); all are 1280×720 JPEGs below 256 KiB.
- README badge lines match the supplied template, including the `.svg` paths and campaign parameters.

## Plateau

The biggest remaining untried visual lever is a composition pass that makes the ground texture and the full-size police pursuit read clearly in the cover while filling the remaining waterfront sand lots. No third visual fix cycle was started.
