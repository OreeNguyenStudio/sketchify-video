# I.Plan — Sketchify Video V2

## 0. Mục đích và chính sách triển khai

Đây là specification duy nhất cho việc hoàn thiện dự án từ Phase 0 đến Phase 7. Mục tiêu là đạt 100% **implementation** và **functional correctness**.

Thứ tự ưu tiên:

1. Correctness.
2. Functional completeness.
3. Pipeline integration.
4. Stability.
5. Performance optimization sau.

Máy phát triển có cấu hình hạn chế. Benchmark hoặc phép thử đặc thù môi trường không được dùng làm hard gate phát triển. Các mục này, nếu cần, chỉ ghi `DEFERRED / NON-BLOCKING RELEASE VALIDATION`:

- benchmark CPU, RAM, GPU/iGPU, WebGPU, WASM;
- inference dưới 8 giây trên máy development;
- stress test, VRAM/configuration audit;
- compatibility matrix nhiều browser/GPU/provider;
- benchmark MobileSAM/YOLO;
- yêu cầu ≥50 ảnh trong vòng development hiện tại;
- performance certification không ảnh hưởng correctness.

Trong implementation, làm theo vòng lặp `READ → CODE → CODE → CODE → hoàn thiện dependency → functional validation → sửa lỗi → validation lại`. Không chạy lặp lại test/build/headless browser/CDP/benchmark/audit nếu không liên quan trực tiếp đến bug đang xử lý; không viết test chỉ để tăng coverage; không dừng implementation để viết report.

Sau khi một Phase đã đáp ứng đầy đủ requirement và functional gate, đánh dấu PASS, không code lại hoặc audit lại Phase đó, chuyển ngay Phase tiếp theo.

## 1. Ground truth khóa

Annotation Phase 0 là nguồn ground truth chuẩn và không được sửa để làm algorithm PASS:

| Fixture | File | Expected meaningful objects |
|---|---|---:|
| 1 | `testthuattoanmoi (1).png` | 16 |
| 2 | `testthuattoanmoi (2).png` | 11 |
| 3 | `testthuattoanmoi (3).png` | 10 |

Không hard-code filename, tọa độ, bbox, polygon, mask, expected count hoặc production rule riêng cho fixture.

## 2. Acceptance philosophy

Một Phase chỉ được coi là 100% khi:

- implementation bắt buộc đã tồn tại và được nối vào production pipeline;
- functional gate của Phase PASS.

Không yêu cầu performance certification trên máy development để đạt 100%.

Evaluator bắt buộc kiểm tra `expected`, `detected`, one-to-one matched, `missed`, `extra`, IoU, coverage, merge error, split/fragmentation error và ontology error. Đúng count nhưng matching sai là FAIL.

## 3. Kiến trúc và contract đích

Pipeline phải tách ba khái niệm:

```text
pixel region ≠ semantic instance ≠ editorial object
```

Object discovery chạy qua các lane detector, OCR/text, classical cues/atomic regions và mask refinement; proposal graph thực hiện merge/split có revalidation, hierarchy, ownership, duplicate suppression và meaningful-object resolution. Residual chỉ đi vào coverage, không được gán ngược vào object seed.

Các vai trò editorial:

```ts
type EditorialRole = 'thing' | 'text-line' | 'compound' | 'coverage'
```

Object list chỉ chứa `thing`, `text-line`, `compound`; `coverage` chỉ dùng để tái dựng ảnh.

Contract V2 tối thiểu:

```ts
interface ObjectInstance {
  id: number
  role: 'thing' | 'text-line' | 'compound'
  bbox: Rect
  visibleMaskRle: Uint32Array
  centroid: Point
  confidence: number
  children: string[]
  mergeHistory: MergeNode | null
  provenance: ProposalEvidence[]
}

interface CoverageLayer {
  id: string
  maskRle: Uint32Array
  revealPolicy: 'base' | 'progressive' | 'terminal'
}

interface AnalysisResultV2 {
  version: 2
  objects: ObjectInstance[]
  coverageLayers: CoverageLayer[]
  units: DrawUnitV2[]
  diagnostics: SegmentationDiagnostics
}
```

Invariant bắt buộc:

- bbox được tính trực tiếp từ visible mask;
- object owner pixel không chồng nhau, bbox được phép chồng;
- union object masks và coverage masks phủ đúng toàn ảnh;
- mỗi visible pixel có đúng một render owner;
- object list không lấy coverage;
- `DrawUnitV2.blockId === null` chỉ hợp lệ với `role === 'coverage'`;
- preview, camera, scheduler và export dùng cùng `AnalysisResultV2`.

Nhánh nền đơn giản/nền trắng ổn định phải được giữ nguyên và không bị model complex làm thay đổi. Nhánh complex dùng orchestrator V2, gồm shared CV cues, text lane, known/unknown object lanes, model runtime, proposal graph và coverage.

## 4. Các Phase và functional gate

### Phase 0 — Ground Truth & Baseline

Implementation: annotation/mask/polygon cho ba fixture; evaluator; baseline JSON/overlay.

Functional gate: ground truth đầy đủ và evaluator hoạt động, bao gồm one-to-one matching và các lỗi merge/split/ontology. Baseline có thể FAIL; đó không phải lỗi evaluator.

### Phase 1 — Object Contract & Coverage

Implementation: contract V2; visible mask/bbox nhất quán; ownership; residual coverage; reconstruction; typed-array/RLE marshal.

Functional gate: object representation và reconstruction đúng; background/stuff không xuất hiện trong object list; final frame vẫn exact.

### Phase 2 — Text Lane

Implementation: OCR/text detector; polygon/mask; hierarchy glyph → word → line; compound banner; icon-caption; parent inference; standalone/noise filtering.

Functional gate: ontology của cả ba fixture khớp ground truth, không dựa vào tọa độ hoặc filename.

### Phase 3 — Model Runtime

Implementation: detector; OCR; MobileSAM khi pipeline cần; ONNX Runtime; WebGPU; WASM fallback; manifest/hash/license/opset; model loading và runtime error handling; cancellation-aware worker/session cache.

Functional gate: production pipeline load và inference được model cần thiết, hoặc dùng fallback được báo rõ trong diagnostics/UI. Performance trên máy development không phải hard gate.

### Phase 4 — Hybrid Proposal Graph

Implementation: detector/text/SAM/mask proposals; classical cues và atomic regions; graph; mask-based merge/split; aggregate revalidation; hierarchy; ownership; coverage; duplicate suppression; meaningful-object resolution. Không dùng spatial quota, cap 24, landmark-only hoặc bbox-only NMS.

Functional gate: ba fixture PASS one-to-one matching, đúng ontology, IoU/coverage đạt acceptance; không merge hoặc fragmentation nghiêm trọng.

### Phase 5 — Domain Adaptation / Fine-tune

Fine-tune chỉ bắt buộc nếu generic pipeline không đạt correctness acceptance. Nếu ba fixture và functional requirements đã đạt mà không cần fine-tune, Phase 5 được đánh dấu:

`PASS — NOT REQUIRED`

Không tạo dataset 200–500 ảnh chỉ để hoàn thành checklist. Nếu fine-tune thực sự cần, phải triển khai dataset, training, export ONNX và independent validation đúng cách, không overfit ba fixture.

### Phase 6 — UI / Migration / Production Hardening

Implementation: pipeline V2 trong app chính; scan; overlay; selection; session/migration; cancellation; stale-result protection; errors; preview; export; manual group/split theo merge tree; model cache/hash và fallback có thông báo.

Functional gate: workflow thực tế chạy end-to-end; preview/export, camera/timeline và app chính đều dùng V2; stale result không ghi đè revision mới; session cũ được migration an toàn hoặc buộc analyze lại.

### Phase 7 — Release Audit

Chỉ kiểm tra: implementation Phase 0–6 complete; production build PASS; existing tests PASS; ba fixture PASS; main app sử dụng V2; cancellation/stale-result protection hoạt động; preview/export hoạt động; không có blocker correctness nghiêm trọng.

Benchmark, multi-machine/browser/GPU/provider matrix là `NON-BLOCKING / DEFERRED`.

## 5. Three-fixture acceptance

Mỗi fixture phải xuất report gồm expected, detected, matched pairs, missed, extra, box IoU, mask IoU, coverage, merge error, split/fragmentation error và ontology error. Count giống nhau không đủ để PASS.

Ground truth editorial phải giữ đúng ontology đã khóa: text cùng dòng là `text-line`; text trên banner là `compound`; icon + caption là `compound`; các instance vật lý riêng vẫn là `thing`; nền/stuff là `coverage`.

## 6. Diagnostics và runtime safety

Complex analysis phải xuất JSON diagnostics tối thiểu gồm route/confidence, proposal counts theo source, rejected reasons, merge/split events, final object count, coverage pixel count, reconstruction mismatch, revision/frameId, cancellation state và execution provider. Fallback không được âm thầm.

Worker/orchestrator phải chỉ trả kết quả của revision mới nhất; request cũ bị cancel hoặc discard. Model không được nhúng bất hợp lý vào JS bundle; manifest phải ghi URL, SHA-256, byte size, license và opset.

## 7. Development loop và quy tắc chống lặp

Trước mỗi Phase:

1. đọc implementation hiện tại;
2. đọc artifacts/gate hiện tại;
3. xác định requirement đã hoàn thành;
4. giữ nguyên requirement đã hoàn thành;
5. chỉ code phần còn thiếu.

Nếu toàn Phase đã đáp ứng specification này, đánh dấu 100% và bỏ qua. Không tái triển khai để chứng minh lại PASS. Không sửa ground truth hoặc nới evaluator để đạt PASS.

## 8. Execution roadmap bắt buộc

Mọi agent phải triển khai theo roadmap dưới đây. Không được chỉ đọc toàn repository, mô tả kiến trúc rồi dừng. Mỗi lượt làm việc phải kết thúc bằng một trong ba kết quả: có code được sửa, có gate được PASS bằng artifact, hoặc có blocker cụ thể kèm lệnh/điều kiện để gỡ blocker.

| Chặng | Việc phải hoàn thành | Gate/bằng chứng bắt buộc | Điều kiện chuyển chặng |
|---|---|---|---|
| R0 | Phase 0: annotation, mask, evaluator, baseline | `npm run test:phase0`; report đủ 3 fixture | Phase 0 PASS |
| R1 | Phase 1: contract V2, mask ownership, coverage, reconstruction, typed marshal | targeted ownership/contract tests; reconstruction mismatch = 0 | Phase 1 PASS |
| R2 | Phase 2: OCR polygon/mask, glyph → word → line, banner, icon-caption, ontology | runtime text report cho cả 3 fixture; hierarchy hợp lệ; ontology error = 0 | Phase 2 PASS |
| R3 | Phase 3: manifest, hash/license/opset, ONNX sessions, WebGPU → WASM, cancellation/cache | runtime probe load/inference thật; diagnostics ghi provider/fallback | Phase 3 PASS |
| R4 | Phase 4: proposal graph, mask merge/split, hierarchy, ownership, duplicate suppression | acceptance report đủ expected/detected/matched/missed/extra/IoU/coverage/merge/split/ontology cho cả 3 fixture | ba fixture PASS |
| R5 | Phase 5: chỉ fine-tune nếu R4 không thể đạt correctness bằng generic pipeline | `PASS — NOT REQUIRED` hoặc independent validation của model fine-tune | Phase 5 PASS |
| R6 | Phase 6: app chính dùng duy nhất V2; overlay, selection, camera, timeline, preview/export, migration, stale-result | app E2E và stale/cancel test; preview/export dùng cùng result revision | Phase 6 PASS |
| R7 | Phase 7: release audit | build, tests, acceptance 3 fixture và app E2E đều PASS | Definition of Done PASS |

Thứ tự dependency bắt buộc là `R0 → R1 → (R2 + R3) → R4 → R5 → R6 → R7`. R2 và R3 được phép chạy song song sau R1. R6 có thể chuẩn bị integration song song nhưng chỉ được PASS sau R4.

## 9. Preflight môi trường tối thiểu

Kiểm tra môi trường là cần thiết, nhưng chỉ để biết lệnh phát triển có thể chạy. Không được biến preflight thành hardware audit, benchmark hoặc compatibility research.

Mỗi phiên chỉ làm một lần, tối đa vài phút:

1. đọc toàn bộ `I.Plan.md` và `I.Status.md`;
2. chạy `git status --short` để không ghi đè thay đổi của phiên khác;
3. xác nhận `node_modules`, model files và WASM artifact cần cho workstream đang nhận tồn tại;
4. chạy đúng một kiểm tra nhẹ liên quan workstream, ưu tiên typecheck hoặc targeted test;
5. nếu gate cần browser/CDP, chủ động khởi động app và browser/CDP trước khi chạy gate;
6. ghi kết quả và blocker vào `I.Status.md`, rồi code ngay.

Không được lặp lại cài dependencies, kiểm tra GPU/CPU/RAM, full build, full test hoặc browser probe ở đầu mọi phiên nếu `I.Status.md` đã có bằng chứng còn hiệu lực. Lỗi môi trường phải phân biệt rõ với lỗi code; không được gọi Phase PASS khi gate chưa chạy.

## 10. Làm song song 2–3 phiên

Một phiên giữ vai trò coordinator; các phiên còn lại chỉ sửa workstream đã claim trong `I.Status.md`. Không có claim thì không sửa code.

| Workstream | Phạm vi chính | File ownership mặc định |
|---|---|---|
| A — Contract/Evaluator/Graph | R0, R1, R4 | `src/segmentation/contracts.ts`, `evaluator.ts`, `proposalGraph.ts`, `semanticMaterialize.ts`, testdata và evaluator scripts |
| B — Text/Models/Runtime | R2, R3 | `src/segmentation/textGrouping.ts`, `models/*`, `pipeline.ts`, model/runtime probes |
| C — App/Production | R6, R7 | `src/App.tsx`, worker clients, session migration, render/player/camera/export và app E2E scripts |

Quy tắc phối hợp:

- mỗi phiên ghi `owner`, `scope`, `files`, `started`, `status`, `last evidence`, `next action` vào `I.Status.md` trước khi sửa;
- không hai phiên cùng sửa một file; nếu cần, coordinator chuyển ownership rõ ràng;
- không sửa `I.Plan.md`, annotation ground truth hoặc acceptance threshold từ phiên phụ;
- mỗi phiên chỉ báo PASS bằng command + artifact path + tóm tắt metric;
- khi hoàn thành, phiên bỏ claim và ghi handoff ngắn; coordinator tích hợp và chạy gate dependency;
- nếu dùng chung một worktree, phải giữ file ownership tuyệt đối; an toàn hơn là dùng git worktree/branch riêng rồi coordinator tích hợp;
- không commit/push trừ khi người dùng yêu cầu, nhưng vẫn phải ghi rõ danh sách file đã sửa.

## 11. Status ledger và tiêu chuẩn báo cáo

`I.Status.md` là nguồn trạng thái sống; `I.Plan.md` là specification ổn định. Agent không được suy đoán tiến độ từ việc file tồn tại. Một requirement chỉ có bốn trạng thái:

```text
NOT STARTED
IN PROGRESS
IMPLEMENTED — UNVERIFIED
PASS
```

Mỗi Phase trong `I.Status.md` phải có: trạng thái, requirement còn thiếu, file chính, command gate gần nhất, kết quả/metric, artifact, blocker và next action. `PASS` bắt buộc có bằng chứng functional; typecheck hoặc code existence không thay thế runtime/acceptance gate.

Fallback model, legacy bridge hoặc classical route phải xuất diagnostics rõ ràng. Nếu production đáng lẽ dùng lane mới nhưng silently skip/fallback thì gate FAIL. Test harness và app chính phải gọi cùng pipeline; không được có implementation chỉ tồn tại trong test.

## 12. Final validation

Chỉ sau khi implementation hoàn tất:

1. chạy acceptance ba fixture;
2. sửa cho đến khi functional gate PASS;
3. chạy `npm run build`;
4. chạy `npm test`;
5. chạy lại acceptance ba fixture;
6. kiểm tra app V2 end-to-end, preview và export.

Đây là validation cuối; trong quá trình code không chạy lặp lại toàn bộ pipeline nếu không cần cho bug đang sửa.

## 13. Definition of Done

Dự án đạt 100% khi tất cả điều kiện sau PASS:

```text
Phase 0 = PASS
Phase 1 = PASS
Phase 2 = PASS
Phase 3 = PASS
Phase 4 = PASS
Phase 5 = PASS hoặc PASS — NOT REQUIRED
Phase 6 = PASS
Phase 7 = PASS

Fixture 1 = PASS
Fixture 2 = PASS
Fixture 3 = PASS
Build = PASS
Tests = PASS
Main App V2 = PASS
```

Không được tuyên bố hoàn thành nếu còn mismatch correctness, merge/split nghiêm trọng, reconstruction sai, app chính chưa dùng V2, hoặc cancellation/stale-result/preview/export chưa hoạt động. Các benchmark và compatibility certification đã nêu ở trên không được làm Phase thất bại.
