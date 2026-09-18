// tagcheck.js — kiểm cân bằng thẻ HTML.
//
// VÌ SAO CẦN: check-site.js KHÔNG bắt được thẻ thiếu đóng. Nó báo "0 lỗi" trong khi
// file bài vẫn có thể thiếu </div> và vỡ layout. Script này bù đúng lỗ hổng đó.
//
// DÙNG:  node tools/tagcheck.js lessons/tang-4/05-portfolio-con-duong.html [file2 ...]
// Thoát mã 0 nếu mọi file cân bằng, 1 nếu có file lệch.
//
// Đã tự test: chạy trên các bài đã duyệt phải ra OK (không false-positive).

const fs = require('fs');

// Thẻ tự đóng (HTML void + các thẻ SVG hay dùng trong bộ component của site).
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta',
  'param','source','track','wbr','path','circle','rect','line','polyline','polygon',
  'ellipse','use','stop']);

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Thiếu tham số. Dùng: node tools/tagcheck.js <file.html> [file2 ...]');
  process.exit(2);
}

let bad = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/<!--[\s\S]*?-->/g, '').replace(/<!DOCTYPE[^>]*>/gi, '');

  const stack = [];
  const errs = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)([^>]*?)(\/?)>/g;
  let m;
  while ((m = re.exec(s))) {
    const isClose = m[1] === '/';
    const tag = m[2].toLowerCase();
    const selfClosed = m[4] === '/';
    if (VOID.has(tag) || selfClosed) continue;
    const line = s.slice(0, m.index).split('\n').length;
    if (!isClose) { stack.push({ tag, line }); continue; }
    if (!stack.length) { errs.push(`thẻ đóng thừa </${tag}> ở dòng ${line}`); continue; }
    const top = stack.pop();
    if (top.tag !== tag) {
      errs.push(`lệch: mở <${top.tag}> dòng ${top.line} nhưng đóng </${tag}> dòng ${line}`);
    }
  }
  for (const o of stack) errs.push(`THIẾU thẻ đóng </${o.tag}> (mở ở dòng ${o.line})`);

  if (errs.length) { bad++; console.log(`FAIL ${f}\n  - ` + errs.join('\n  - ')); }
  else console.log(`OK   ${f}`);
}
process.exit(bad ? 1 : 0);
