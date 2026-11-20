# I.Status — Sketchify Video V2

Updated: 2026-11-20 (Asia/Saigon). `I.Plan.md` is the specification; this file records the current best evidence.

## Current phase status

| Phase | Status | Evidence still required |
| --- | --- | --- |
| 0 — Ground truth/baseline | PASS | None recorded |
| 1 — Contract/coverage | IMPLEMENTED — UNVERIFIED | Final ownership and reconstruction gate |
| 2 — Text lane | ACCEPTANCE FAIL | Correct text ontology and pass production acceptance for all three fixtures |
| 3 — Model runtime | IMPLEMENTED — UNVERIFIED | Complete production provider/fallback/cancellation diagnostics gate |
| 4 — Proposal graph | IN PROGRESS — ACCEPTANCE FAIL | Pass matching, masks, coverage, merge/split and ontology for all three fixtures |
| 5 — Fine-tune | PASS — NOT REQUIRED | Keep closed unless the user reopens model upgrade work |
| 6 — App integration | UNVERIFIED | App E2E, migration, stale/cancel, preview and export gates |
| 7 — Release audit | UNVERIFIED | Final build, tests, full acceptance and app E2E |

Definition of Done: **NOT COMPLETE**. The user paused the goal for the Antigravity transfer.

## Last known validation

The latest completed three-fixture browser acceptance before enabling CPU/WASM MobileSAM exited `1`. Text counts (standalone / banner / icon-caption) were:

| Fixture | Expected | Actual |
| --- | --- | --- |
| `testthuattoanmoi (1).png` | `2 / 3 / 5` | `10 / 1 / 0` |
| `testthuattoanmoi (2).png` | `0 / 5 / 0` | `10 / 1 / 4` |
| `testthuattoanmoi (3).png` | `1 / 4 / 0` | `10 / 4 / 0` |

All three hierarchies were valid, but ontology counts failed. A later fresh production run of fixture 1 completed with CPU/WASM MobileSAM and improved to `9 / 1 / 1`; expected is `2 / 3 / 5`. Broadening prompts caused a 300-second timeout. Prompt selection was returned to detector/SAM proposals, then the production build succeeded, but a fresh acceptance after that change was not completed because the preview/browser process stopped and the machine reported memory pressure.

Last known code gates on 2026-08-28:

- TypeScript `tsc --noEmit --incremental false --skipLibCheck`: PASS.
- `npm.cmd test -- --run`: PASS, 28 files / 82 tests.
- `npx.cmd vite build`: PASS, 4597 modules, 24.36 seconds.
- Full production acceptance after the final prompt-scope change: NOT RUN to completion.

An independent ORT probe confirmed that MobileSAM's decoder runs under WASM and returns a mask tensor. This probe and the one-fixture run do not replace the three-fixture acceptance gate.

## Workspace and next action

Root project metadata and the three formal acceptance PNGs were restored on 2026-11-20 from the local `Prompt and I.Plan/` archive. The canonical plan is now `D:\DRAW VIDEO\I.Plan.md`; scripts that load formal fixture names from the repository root can find them again.

After the user resumes the goal, rebuild, run a fresh production acceptance for all three fixtures, fix generic text grouping/parent relations without changing ground truth or thresholds, then close Phase 1/3/4/6/7 functional gates and perform the Phase 7 release audit. Do not claim PASS from a typecheck, unit tests, replay, model probe, or health-only browser check.
