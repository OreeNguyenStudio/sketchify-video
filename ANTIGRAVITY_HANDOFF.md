# Sketchify Video — handoff to Antigravity

Updated: 2026-11-20 (Asia/Saigon)

## Project and objective

- Project directory: `D:\DRAW VIDEO`
- GitHub repository: `https://github.com/OreeNguyenStudio/sketchify-video`
- Current local branch: `main`
- Canonical architecture plan: [`I.Plan.md`](I.Plan.md)
- Progress ledger: [`I.Status.md`](I.Status.md)
- Work queue: [`I.Queue.md`](I.Queue.md)

The user's current goal is to complete every requirement in `I.Plan.md` and reach Definition of Done PASS. The user explicitly set Phase 5 to `PASS — NOT REQUIRED` and paused the goal for this platform transfer. It is not complete. Resume the same goal after importing this repository into Antigravity.

## Current project state

Sketchify Video is a browser based whiteboard video editor. It uses a Go/WebAssembly classical segmentation path and a TypeScript semantic V2 path with OCR/text hierarchy, ONNX Runtime models, proposal graph, session migration, timeline/camera, preview and export. Project setup uses Node.js, Vite, Vitest and Go.

The code and V2 architecture are substantially implemented, but the main acceptance blocker is correctness of text ontology and parent relations. Do not change the annotation ground truth or acceptance thresholds to make the checks pass.

Latest evidence in the status ledger:

- Phase 0: PASS.
- Phase 1: implemented, final ownership/reconstruction gate not recorded as PASS.
- Phase 2: acceptance FAIL. OCR and hierarchy execute, but standalone/banner/icon-caption counts do not match expected values.
- Phase 3: model/runtime code is implemented; a browser independent probe proved the MobileSAM decoder can run with CPU/WASM. Full provider, cancellation and production diagnostics are not closed as a final gate.
- Phase 4: proposal graph is implemented, but three fixture correctness acceptance is not PASS.
- Phase 5: `PASS — NOT REQUIRED` by explicit user decision.
- Phase 6: app integration exists; final app E2E, migration, cancellation/stale-result, preview/export gate remains unverified.
- Phase 7: final release audit not passed.
- Definition of Done: NOT COMPLETE.

## Acceptance evidence and blocker

Expected text-lane counts are ordered as standalone lines / banner text / icon captions:

| Fixture | Expected | Last completed three-fixture run before CPU/WASM SAM integration |
| --- | --- | --- |
| `testthuattoanmoi (1).png` | `2 / 3 / 5` | `10 / 1 / 0` |
| `testthuattoanmoi (2).png` | `0 / 5 / 0` | `10 / 1 / 4` |
| `testthuattoanmoi (3).png` | `1 / 4 / 0` | `10 / 4 / 0` |

Those completed reports had valid glyph → word → line hierarchy but failed ontology counts. After enabling the CPU/WASM MobileSAM decoder, a fresh production run of fixture 1 completed at about 39.4 seconds and improved to `9 / 1 / 1`, still below the expected `2 / 3 / 5`. Expanding SAM prompts to all non-legacy proposals then timed out at 300 seconds. Prompt selection was returned to detector/SAM semantic proposals to keep the WASM workload bounded. A new acceptance after that final change was not completed because the preview/browser process stopped and the machine reported memory pressure. Do not treat the standalone ORT probe or the one-fixture run as full acceptance.

## Last known validation

On 2026-08-28, after the MobileSAM prompt-scope correction:

- TypeScript: PASS (`tsc --noEmit --incremental false --skipLibCheck`).
- Vitest: PASS, 28 files / 82 tests.
- Vite build: PASS, 4597 modules, about 24 seconds.
- Production three-fixture acceptance after that correction: NOT COMPLETED.

These checks are historical evidence. Re-run the relevant gates in Antigravity before making a current release claim.

## Recommended continuation

1. Read `I.Plan.md`, then the latest dated sections of `I.Status.md` and `I.Queue.md`.
2. Check `git status` and preserve existing changes.
3. Run the build and current unit/replay gates, then run the production acceptance with a fresh browser target for all three fixtures.
4. Fix generic OCR grouping, mask ownership and parent-relation evidence until every fixture report passes the plan's object, mask, coverage, merge/split and ontology checks. Keep CPU/WASM prompt work bounded and cancellable.
5. Close the Phase 1, 3, 4, 6 and 7 functional gates. Phase 5 remains `PASS — NOT REQUIRED` unless the user later reopens it.
6. Only mark the goal complete after every DoD condition in `I.Plan.md` has direct passing evidence.

Useful commands from the project root:

```powershell
npm ci
npm test -- --run
node node_modules/typescript/bin/tsc --noEmit --incremental false --skipLibCheck
node scripts/phase2-text-replay.mjs
npx vite build
```

The browser acceptance script is `scripts/cdp-phase2-text-e2e.mjs`; it needs a running app and a working Chrome DevTools Protocol target. It writes its report under `.tmp-fixture-validation/` and can be limited to one fixture with `PHASE2_ONLY`, but final PASS requires all three fixtures.

## Workspace repair made for this handoff

At transfer time, root build/plan files had been moved into `Prompt and I.Plan/`, and the three formal acceptance PNGs were missing from the root even though the browser harness reads them there. The current copies were restored to the root, including `I.Plan.md`, package/build metadata, status/queue, and all three formal fixtures. The duplicate `Prompt and I.Plan/` folder is retained as a local archive. Its `answer_docs.py` and `extracted.txt` are unrelated medical coursework material and are excluded from the GitHub upload.
