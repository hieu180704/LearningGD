# CLAUDE.md — Xưởng Game Design

Ghi chú: file này CHỈ bổ sung quy tắc riêng của dự án "Xưởng Game Design". Không lặp lại
quy tắc chung đã có trong global instruction của user (model routing, ngôn ngữ trả lời,
cách delegate, v.v.) — những quy tắc đó vẫn áp dụng nguyên vẹn.

## Mục lục
1. Dự án là gì
2. Người đọc & giọng văn
3. Cấu trúc folder
4. Design system tóm tắt
5. Cấu trúc bắt buộc của một bài học
6. Quy trình viết một bài
7. Nguồn nền tảng tham khảo
8. Những điều đã biết / đã vấp
9. Checklist "bài xong"

---

## 1. Dự án là gì

- Bộ tài liệu tự học giúp người mới trở thành **Game Designer thực thụ** — không chỉ
  mang danh. Nội dung đi từ cơ bản đến nâng cao.
- Ví dụ minh hoạ phải đa thể loại: PC, console, indie, mobile — không bó hẹp một mảng.
- Là website HTML tĩnh, mở trực tiếp bằng `file://`. Không build step, không fetch file
  local, không thư viện ngoài. Dữ liệu bài học nằm trong JS global (`curriculum.js`).

## 2. Người đọc & giọng văn

- Đối tượng: người mới bắt đầu học Game Design.
- Tiếng Việt ~90%, thuật ngữ gốc giữ tiếng Anh và **giải thích lần đầu xuất hiện** (dùng
  component `.term[data-en]`).
- Câu ngắn. Đưa **ví dụ game quen thuộc trước**, định nghĩa/lý thuyết sau — không hàn
  lâm, không nịnh.
- Mỗi khái niệm phải trả lời được: "dùng nó để làm gì trong công việc thật".

## 3. Cấu trúc folder

Gốc `D:\Project\GD`:

- `index.html` — trang chủ.
- `lo-trinh.html` — lộ trình đầy đủ, mọi tầng, mọi bài.
- `components.html` — trình diễn toàn bộ component (mục 4 dưới đây); người viết bài xem
  trang này để lấy đúng markup, thay cho `lessons/_template.html` cũ (đã xoá).
- `lessons/tang-N/NN-slug.html` — bài học thật. Slug dạng `tang-1/01-mda`. **Không tự tạo
  file bài trừ khi được yêu cầu viết đúng bài đó.** Bài nào đã có: xem `status` trong
  `curriculum.js`.
- `lessons/_lesson-starter.html` — khung trống để copy khi viết bài mới: đã có đủ
  head/topbar/nav/toc/footer, phần `<article>` chỉ có comment hướng dẫn.
- `assets/css/site.css` — toàn bộ style, token.
- `assets/js/curriculum.js` — `window.CURRICULUM`, dữ liệu 6 tầng × 26 bài.
- `assets/js/site.js` — hành vi JS (theme, tiến độ, TOC, quiz, flashcard, v.v.).
- `tools/check-site.js` — script Node kiểm tra lỗi liên kết/token/markup, không dependency.
- `tools/shoot.ps1` — chụp ảnh headless Chrome để tự kiểm tra layout.
- `research/<chủ-đề>.txt` — research đã fact-check cho từng bài (link nguồn, [CHƯA VERIFY]).
- `worklog/<ngày>__<slug>.txt` — ghi chú bàn giao mỗi session (SUMMARY ghi rõ trạng thái verify).

Không tạo file/folder ngoài danh sách trên trừ khi có yêu cầu rõ ràng.

## 4. Design system tóm tắt

- Theme mặc định **luôn sáng**, không theo hệ điều hành. Tối chỉ khi người dùng bấm
  chuyển (`html[data-theme="dark"]`). Không dùng `prefers-color-scheme`.
- Mọi màu đi qua token CSS (`:root` và khối `dark`) — không hex rời rạc ngoài 2 khối đó
  (ngoại lệ duy nhất: rgba trong token shadow).
- Màu tầng dùng qua biến `--tier` đặt trên phần tử cha (`.tier-0 { --tier: var(--t0) }`).
- Bộ ba MDA có màu riêng: `--mech`, `--dyn`, `--aes` — dùng đúng ngữ nghĩa
  Mechanics/Dynamics/Aesthetics, không dùng lẫn cho việc khác.
- Font: `Baloo 2` (heading, số tầng, tên thẻ) + `Be Vietnam Pro` (thân bài). Không
  uppercase + letter-spacing rộng cho nhãn.
- **Không dùng emoji làm icon.** Icon = inline SVG stroke `currentColor`, có thể lấy từ
  map `ICONS` trong `site.js`.
- **Không tự tạo class/component mới nếu component có sẵn đã đáp ứng được.** Nếu thực sự
  cần component mới: thêm vào `site.css` VÀ trình diễn ngay trong `components.html`
  trong cùng một lần sửa — không để lệch giữa hai file.

### Component có sẵn (tên class cố định — dùng đúng, không đặt tên khác)

| Class | Dùng khi nào |
|---|---|
| `.lesson-head`, `.lesson-meta`, `.objectives` | Đầu bài: tiêu đề, pill meta (thời gian/độ khó/tiên quyết), mục tiêu "Sau bài này bạn sẽ" |
| `.toc`, `.toc-mobile` | Mục lục tự sinh từ `h2[id]` trong article, có scroll-spy |
| `.callout[data-kind="insight\|mistake\|example\|note"]` | Hộp nhấn mạnh: ý đáng nhớ / sai lầm hay gặp / ví dụ trong game / ghi chú |
| `.lens` | Thẻ "Lens" — câu hỏi phân tích game qua một khung lý thuyết cụ thể |
| `.term[data-en]` | Thuật ngữ tiếng Việt, hover/focus hiện tên tiếng Anh gốc |
| `.mda-m` / `.mda-d` / `.mda-a`, `.chip.mda-*` | Đánh dấu nội dung thuộc Mechanics/Dynamics/Aesthetics |
| `.chip` | Pill nhỏ dùng chung (không thuộc MDA) |
| `figure.diagram` (`.wide`) | Sơ đồ minh hoạ — ưu tiên dựng bằng HTML/CSS, chỉ dùng SVG khi thật cần |
| `.table-wrap > table.compare` | Bảng so sánh, cuộn ngang trong container riêng |
| `.exercise` | Bài thực hành: các bước + `details.hint` gợi ý |
| `.quiz[data-answer]` | Câu hỏi trắc nghiệm tự chấm, có giải thích |
| `.flashcards > button.flash` (`.front`/`.back`) | Thẻ lật ôn nhanh |
| `.recap` | Khối "Nhớ 3 điều" cuối phần nội dung |
| `.reading > li` | Danh sách đọc thêm (Sách/Paper/Bài nói/Video/Bài viết) |
| `.lesson-foot`, `#markDoneBtn`, `.pager` | Chân bài: nút đánh dấu đã học, điều hướng bài trước/sau |
| `.btn`, `.btn-primary`, `.btn-secondary`, `.pill`, `.pill-ready`, `.pill-planned`, `.pill-done` | Nút và pill trạng thái dùng chung toàn site |

## 5. Cấu trúc bắt buộc của một bài học

Thứ tự bắt buộc, không đảo:

1. `.lesson-head` (dek, meta, objectives)
2. Mở bài bằng tình huống/ví dụ game cụ thể
3. Khái niệm chính (kèm `figure.diagram` nếu khái niệm có quan hệ/luồng)
4. Ví dụ phân tích đa thể loại
5. `.lens`
6. Sai lầm hay gặp (`.callout[data-kind="mistake"]`)
7. `.exercise` (có `details.hint`)
8. `.quiz` 3–5 câu, mỗi câu giải thích rõ vì sao đúng/sai
9. `.flashcards`
10. `.recap` — "Nhớ 3 điều"
11. `.reading` — đọc thêm
12. `.lesson-foot`

Độ dài mục tiêu: 10–20 phút đọc.

## 6. Quy trình viết một bài

1. **Research**: dùng subagent Sonnet có WebSearch/WebFetch, ưu tiên nguồn gốc (paper
   PDF, sách, talk GDC Vault, bài viết của chính tác giả). Lưu research đã fact-check vào
   `research/<chủ-đề>.txt` (có link nguồn, đánh dấu [CHƯA VERIFY]) để tái dùng.
2. **Fact-check**: mọi định nghĩa/trích dẫn/năm/tên người phải có nguồn đã mở đọc thật.
   Không verify được → **không đưa vào bài**. Không đặt trong ngoặc kép nếu không phải
   nguyên văn.
3. **Tách bạch** nội dung "theo nguồn" và "phân tích minh hoạ" (ví dụ game hiện đại tự
   phân tích) — ghi rõ bằng callout `note` hoặc chú thích, không để người đọc lẫn lộn.
4. **Viết** từ bản copy của `lessons/_lesson-starter.html` (starter nằm ở `lessons/` nên
   dùng `../`; copy vào `lessons/tang-N/` thì đổi mọi `../` thành `../../`); điền `curriculum.js`
   (`summary`, `goals`, `minutes`, `level`); chỉ đổi `status` sang `"ready"` **sau khi**
   file bài đã tồn tại.
5. **Kiểm tra**: chạy `node tools/check-site.js` → phải 0 lỗi; chạy `tools/shoot.ps1` và
   tự xem ảnh chụp desktop + mobile, cả theme sáng lẫn tối.
6. **Báo user duyệt** trước khi sang bài tiếp theo — không tự viết hàng loạt nhiều bài
   liên tiếp mà không xin xác nhận.

## 7. Nguồn nền tảng tham khảo

Danh sách định hướng — mỗi trích dẫn cụ thể vẫn phải tự verify lại theo mục 6:

- Schell — *The Art of Game Design*
- Koster — *A Theory of Fun*
- Salen & Zimmerman — *Rules of Play*
- Fullerton — *Game Design Workshop*
- Hunicke, LeBlanc, Zubek — *MDA* (2004)
- Adams & Dormans — *Game Mechanics*
- Swink — *Game Feel*
- Schreiber & Romero — *Game Balance*
- Hodent — *The Gamer's Brain*
- Lemarchand — *A Playful Production Process*
- Totten — *An Architectural Approach to Level Design*
- GDC Vault
- Lostgarden
- Game Maker's Toolkit
- Deconstructor of Fun

## 8. Những điều đã biết / đã vấp (kỹ thuật)

- Chrome extension không mở được `file://` → dùng `tools/shoot.ps1` (headless Chrome),
  không dựa vào extension chụp ảnh.
- Máy không có Python → không dùng `http.server` hay bất kỳ thứ gì cần Python.
- Chrome headless `--window-size` có min width ~484px → ảnh mobile 400px bị sai. `shoot.ps1`
  dùng DevTools Protocol (Emulation.setDeviceMetricsOverride); đừng quay lại `--window-size`.
- Subagent tự báo "ảnh ổn" từng sai (gutter mobile) → main phải tự xem ít nhất ảnh mobile.
- Node đã có sẵn trên máy — dùng thẳng, không cần cài thêm.
- Grid track phải dùng `minmax(0,1fr)`, không dùng `1fr` trần — tránh tràn ngang mobile
  do min-content bị bảng/diagram kéo giãn.
- **Không bao giờ đánh dấu `status: "ready"` trước khi file bài thật sự tồn tại** — lỗi
  này từng gây 404 ở bản v1.
- Kiểm tra text tiếng Việt trên Windows dùng Grep tool hoặc đọc UTF-8 đúng cách, không
  dùng `Get-Content` (PS 5.1 đọc sai encoding → false-negative).

## 9. Checklist "bài xong"

- [ ] Đủ 12 phần theo đúng thứ tự ở mục 5.
- [ ] Mọi định nghĩa/trích dẫn đã fact-check, có nguồn đã mở đọc thật.
- [ ] Nội dung "theo nguồn" và "phân tích minh hoạ" được tách bạch rõ trong bài.
- [ ] Chỉ dùng component đã có trong mục 4; component mới (nếu có) đã thêm vào cả
      `site.css` và `components.html`.
- [ ] `curriculum.js` đã cập nhật `summary`, `goals`, `minutes`, `level`, `status: "ready"`.
- [ ] `node tools/check-site.js` chạy 0 lỗi.
- [ ] Đã chạy `tools/shoot.ps1` và tự xem ảnh: desktop + mobile, theme sáng + tối.
- [ ] Đã báo user duyệt trước khi sang bài kế tiếp.
