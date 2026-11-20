# TRIỂN KHAI TOÀN BỘ DỰ ÁN THEO I.Plan.md — PHASE 0 → PHASE 7

Từ thời điểm này, hãy **triển khai hoàn chỉnh toàn bộ dự án theo `I.Plan.md` từ Phase 0 đến Phase 7**.

`I.Plan.md` là SOURCE OF TRUTH.

Không viết lại kế hoạch.

Không tiếp tục audit dài dòng.

Không benchmark.

Không profiling.

Không nghiên cứu thêm nếu thông tin trong repository và `I.Plan.md` đã đủ để code.

Mục tiêu duy nhất:

**IMPLEMENT FULL PROJECT → BUILD → RUN → TEST 3 FIXTURES → FIX UNTIL WORKING.**

---

## 1. ĐỌC I.Plan.md MỘT LẦN VÀ TRIỂN KHAI TOÀN BỘ

Đọc toàn bộ `I.Plan.md`.

Xác định yêu cầu của:

- Phase 0
- Phase 1
- Phase 2
- Phase 3
- Phase 4
- Phase 5
- Phase 6
- Phase 7

Sau đó triển khai liên tục từ Phase 0 → Phase 7.

Không dừng lại sau từng Phase để hỏi tôi.

Không gửi báo cáo dài sau từng Phase.

Không tạo thêm kế hoạch con.

Không chỉ mô tả những gì cần làm.

**HÃY SỬA CODE THỰC TẾ.**

---

# 2. ƯU TIÊN IMPLEMENTATION

Quy trình bắt buộc:

`READ REQUIRED CODE`
→ `IDENTIFY GAP`
→ `EDIT`
→ `CONTINUE IMPLEMENTATION`

Chỉ đọc những file cần thiết.

Không audit toàn repository lặp đi lặp lại.

Không dùng terminal để suy nghĩ vô hạn.

Không chạy hàng loạt:

- `Get-Content`
- `GetFiles`
- `dir`
- `Get-Item`
- `node -e`
- runtime probes

nếu không trực tiếp phục vụ một lỗi cụ thể.

Khi đã hiểu code hiện tại:

**EDIT FILE NGAY.**

---

# 3. KHÔNG BENCHMARK / KHÔNG PROFILE

Máy development có cấu hình yếu.

TUYỆT ĐỐI KHÔNG thực hiện các tác vụ không cần thiết như:

- cold-load benchmark;
- warm-load benchmark;
- inference benchmark;
- FPS benchmark;
- CPU profiling;
- RAM profiling;
- peak-memory profiling;
- GPU profiling;
- cache benchmark;
- operator performance benchmark;
- stress test;
- load test;
- chạy inference hàng chục lần;
- hardware audit;
- browser capability benchmark;
- exhaustive compatibility scan.

Không cần báo cáo hệ thống nhanh bao nhiêu.

Chỉ cần:

**NÓ HOẠT ĐỘNG ĐÚNG.**

---

# 4. TRIỂN KHAI ĐẦY ĐỦ, KHÔNG MOCK

Tất cả chức năng mà `I.Plan.md` yêu cầu phải được triển khai thật.

Không được thay implementation bằng:

- mock;
- stub;
- fake;
- placeholder;
- demo output;
- hardcoded result;
- rectangle giả;
- mask giả;
- confidence giả;
- TODO;
- interface rỗng.

Nếu `I.Plan.md` yêu cầu runtime thật thì production path phải chạy runtime thật.

---

# 5. SEGMENTATION / DETECTION PHẢI LÀ PIPELINE THẬT

Triển khai hoàn chỉnh pipeline phát hiện và tách vật thể theo kiến trúc trong `I.Plan.md`.

Bao gồm các thành phần cần thiết như:

- image input;
- preprocessing;
- detector;
- text detector;
- MobileSAM / segmentation;
- ONNX Runtime Web nếu kiến trúc yêu cầu;
- WebGPU preferred;
- WASM fallback;
- model loading;
- model session;
- inference;
- mask;
- polygon;
- bounding box;
- confidence;
- postprocessing;
- proposal generation;
- proposal graph;
- grouping;
- hierarchy;
- overlap;
- containment;
- compound object;
- icon-caption;
- text-object relationship;
- duplicate suppression;
- merge/split logic;
- final semantic object output.

Bám chính xác `I.Plan.md`.

---

# 6. MỤC TIÊU QUAN TRỌNG NHẤT: VẬT THỂ CÓ NGHĨA

Kết quả cuối không được chỉ là các mảnh segmentation vô nghĩa.

Hệ thống phải tìm ra:

> **CÁC VẬT THỂ BIÊN TẬP CÓ NGHĨA TRONG ẢNH.**

Ví dụ:

- người;
- máy bay;
- phương tiện;
- bảng;
- banner;
- cụm chữ;
- biểu tượng;
- logo;
- công trình;
- vật thể độc lập;
- object compound có ý nghĩa.

Không chia một object thành nhiều mảnh vô nghĩa.

Không merge nhiều object độc lập thành một object.

Bounding box / polygon / mask phải bao hợp lý toàn bộ vật thể.

Các vật thể có thể chồng lấn và đường biên có thể chồng lên nhau.

Không được loại object chỉ vì nằm phía trước hoặc phía sau object khác.

---

# 7. IMPLEMENT PHASE 0 → 7 LIÊN TỤC

Triển khai lần lượt toàn bộ Phase.

Nếu một Phase đã được code một phần:

- kiểm tra implementation hiện tại;
- giữ phần đúng;
- hoàn thiện phần còn thiếu;
- không rewrite vô ích.

Nếu phát hiện implementation sai:

- sửa root cause.

Không tạo architecture song song không cần thiết.

Không để code cũ và code mới cùng tồn tại nếu gây conflict.

---

# 8. KHÔNG TEST NẶNG TRONG QUÁ TRÌNH CODE

Trong lúc triển khai Phase 0 → 7 chỉ chạy kiểm tra tối thiểu khi cần để tránh tích lũy lỗi:

- TypeScript/typecheck nếu cần;
- build nếu cần;
- targeted test khi vừa sửa một lỗi cụ thể.

Không chạy full regression sau mỗi Phase.

Không benchmark.

Không stress test.

Mục tiêu là **hoàn thành code toàn bộ dự án trước**.

---

# 9. SAU KHI PHASE 0 → 7 ĐÃ IMPLEMENT XONG

Lúc này mới thực hiện verification tổng.

Chạy:

1. typecheck;
2. production build;
3. các test cần thiết;
4. functional runtime test.

Nếu lỗi:

**FIX CODE → TEST LẠI.**

Không quay lại research/audit.

---

# 10. ACCEPTANCE TEST BẮT BUỘC — 3 ẢNH

Sau khi code toàn bộ Phase 0 → 7 hoàn thành, kiểm tra chức năng quét/tách vật thể bằng đúng ba file:

- `testthuattoanmoi (1).png`
- `testthuattoanmoi (2).png`
- `testthuattoanmoi (3).png`

Nếu chưa biết vị trí file:

→ tìm đúng ba filename này trong repository/workspace.

Không tạo ảnh test thay thế nếu các file trên tồn tại.

---

# 11. CÁCH TEST 3 ẢNH

Đối với từng ảnh:

`LOAD IMAGE`
→ `DETECT`
→ `SEGMENT`
→ `BUILD PROPOSALS`
→ `GROUP`
→ `BUILD HIERARCHY`
→ `GENERATE FINAL SEMANTIC OBJECTS`

Kiểm tra output cuối.

Mục tiêu không phải đạt một số lượng box cố định.

Mục tiêu là:

**quét được đầy đủ và hợp lý các vật thể có nghĩa trong từng ảnh.**

Kiểm tra:

- có bỏ sót object rõ ràng không;
- có chia một object thành nhiều mảnh sai không;
- có merge nhiều object sai không;
- box có cắt mất object không;
- polygon có bao đúng object không;
- mask có hợp lý không;
- text/banner có được nhóm đúng không;
- icon/caption có đúng không;
- hierarchy có đúng không;
- vật thể chồng lên nhau có được giữ riêng không;
- compound object có được xử lý đúng không.

---

# 12. TUYỆT ĐỐI KHÔNG OVERFIT 3 ẢNH TEST

Ba ảnh trên là **acceptance fixtures**, không phải dữ liệu để hardcode.

CẤM:

- kiểm tra filename rồi trả result riêng;
- hardcode coordinates;
- hardcode polygon;
- hardcode bounding box;
- hardcode object count;
- hardcode class theo fixture;
- hardcode màu cụ thể chỉ để PASS;
- tạo rule chỉ hoạt động cho một ảnh.

Mọi sửa đổi phải có tính tổng quát cho pipeline.

---

# 13. NẾU ẢNH TEST FAIL

Nếu một trong ba ảnh chưa đạt:

1. xác định nguyên nhân trong pipeline;
2. sửa implementation;
3. chạy lại đúng fixture đó;
4. xác nhận không làm hỏng hai fixture còn lại;
5. tiếp tục cho đến khi cả ba hoạt động hợp lý.

Không benchmark.

Không research loop.

Không viết báo cáo thay cho việc sửa code.

---

# 14. WEBGPU / WASM

Code production phải ưu tiên:

`WebGPU`
→ nếu unavailable hoặc runtime fail
→ `WASM fallback`.

Không cần benchmark hai backend.

Chỉ cần xác minh runtime hoạt động.

Nếu môi trường development không hỗ trợ WebGPU nhưng WASM chạy được:

→ không chặn toàn bộ dự án vì lý do đó.

---

# 15. UI / APP CHÍNH

Hoàn thiện toàn bộ integration cần thiết để sau khi Codex kết thúc, tôi có thể tự mở app chính và kiểm tra bằng mắt.

App chính phải sử dụng pipeline implementation thật.

Không tạo riêng một test implementation mà app chính vẫn sử dụng pipeline cũ.

Đặc biệt kiểm tra integration từ:

`UI`
→ `image input`
→ `segmentation/detection`
→ `proposal graph`
→ `semantic objects`
→ `overlay/render result`.

---

# 16. ĐỪNG TỐI ƯU QUÁ SỚM

Không dành thời gian cho micro-optimization nếu chức năng chưa đúng.

Thứ tự ưu tiên:

1. Correctness.
2. Completeness.
3. Stability.
4. Integration.
5. Functional result.

Performance optimization để sau.

---

# 17. KHÔNG COMMIT / PUSH

Không:

- git commit;
- git push;
- publish;
- deploy;

trừ khi tôi yêu cầu riêng.

Chỉ sửa code local trong workspace hiện tại.

---

# 18. ĐIỀU KIỆN HOÀN THÀNH

Chỉ được tuyên bố hoàn thành khi:

### A. Implementation

Phase 0 → Phase 7 trong `I.Plan.md` đã được triển khai thực tế.

### B. Build

Project build được.

### C. Runtime

App khởi động được.

### D. Pipeline

Detection/segmentation chạy bằng implementation thật.

### E. Acceptance fixtures

Ba file:

- `testthuattoanmoi (1).png`
- `testthuattoanmoi (2).png`
- `testthuattoanmoi (3).png`

đều chạy qua pipeline và sinh ra các vật thể có nghĩa hợp lý.

---

# 19. BÁO CÁO CUỐI CÙNG CHỈ CẦN NGẮN

Sau khi hoàn tất, chỉ báo:

## IMPLEMENTED
Các phần chính đã hoàn thành.

## FILES CHANGED
Danh sách file chính đã sửa/tạo.

## BUILD
PASS / FAIL.

## TEST FIXTURES

### testthuattoanmoi (1).png
PASS / FAIL.

### testthuattoanmoi (2).png
PASS / FAIL.

### testthuattoanmoi (3).png
PASS / FAIL.

## REMAINING REAL LIMITATIONS
Chỉ ghi những giới hạn kỹ thuật thực sự còn tồn tại.

Không viết hàng trang audit.

---

# FINAL COMMAND

Không tiếp tục lập kế hoạch.

Không tiếp tục benchmark.

Không tiếp tục profiling.

Không tiếp tục exploratory audit.

**ĐỌC `I.Plan.md` → TRIỂN KHAI TOÀN BỘ PHASE 0–7 → BUILD → CHẠY 3 ẢNH TEST → SỬA CHO ĐẾN KHI PIPELINE HOẠT ĐỘNG.**

Sau đó dừng lại để tôi tự kiểm tra kết quả trực tiếp trên app chính.

**BẮT ĐẦU CODE NGAY.**