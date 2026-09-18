// subst.js — thay placeholder {{TOKEN}} trong file bài bằng trích dẫn nguyên byte.
//
// VÌ SAO CẦN: subagent viết bài KHÔNG được gõ lại chữ tiếng Anh của trích dẫn — mỗi lần
// gõ lại là một lần nháy cong ' " bị làm phẳng, en dash bị đổi, lỗi chính tả có sẵn
// trong nguồn bị "sửa" hộ. Cách chặn tận gốc: subagent chỉ đặt {{TOKEN}}, main thay bằng
// byte lấy thẳng từ nguồn.
//
// DÙNG:  node tools/subst.js <file-bai.html> <fixture.json>
//
// fixture.json có dạng phẳng { "TEN_TOKEN": "nguyên văn trích dẫn", ... }
// Nội dung trong đó phải được cắt ra từ nguồn đã curl (grep -o / slice theo chỉ số),
// KHÔNG gõ tay. Xem tools/check2way.js để verify lại sau khi thay.
//
// Script GHI ĐÈ file bài tại chỗ, và TỪ CHỐI ghi nếu có token thiếu / lặp / lạ —
// thà không ghi còn hơn ghi ra một bài thiếu trích dẫn mà không ai biết.

const fs = require('fs');

const [file, fixturePath] = process.argv.slice(2);
if (!file || !fixturePath) {
  console.error('Dùng: node tools/subst.js <file-bai.html> <fixture.json>');
  process.exit(2);
}

const QUOTES = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
let s = fs.readFileSync(file, 'utf8');

// Trích dẫn đi vào thân HTML nên phải escape, nếu không "<" trong nguồn sẽ phá markup.
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const found = {};
const unknown = [];
s = s.replace(/\{\{([A-Z0-9_]+)\}\}/g, (m, k) => {
  if (!(k in QUOTES)) { unknown.push(k); return m; }
  found[k] = (found[k] || 0) + 1;
  return esc(QUOTES[k]);
});

const missing = Object.keys(QUOTES).filter(k => !found[k]);
const dup = Object.keys(found).filter(k => found[k] > 1);

console.log(`thay: ${Object.keys(found).length}/${Object.keys(QUOTES).length} token`);
if (unknown.length) console.log('TOKEN LẠ (không có trong fixture): ' + [...new Set(unknown)].join(', '));
if (missing.length) console.log('THIẾU TOKEN (có trong fixture nhưng bài không dùng): ' + missing.join(', '));
if (dup.length)     console.log('TOKEN LẶP: ' + dup.map(k => `${k}×${found[k]}`).join(', '));

if (unknown.length || missing.length || dup.length) {
  console.log('=> KHÔNG GHI FILE. Sửa bài hoặc sửa fixture rồi chạy lại.');
  process.exit(1);
}
fs.writeFileSync(file, s, 'utf8');
console.log('=> đã ghi ' + file);
