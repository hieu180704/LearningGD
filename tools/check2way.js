// check2way.js — so byte HAI CHIỀU: trích dẫn trong bài <-> nguồn gốc đã tải về.
//
// VÌ SAO CẦN: "đã verify" do subagent tự khai không có giá trị. Đã vấp nhiều lần —
// nháy cong bị làm phẳng, lỗi chính tả có sẵn trong nguồn bị sửa hộ, hai đoạn rời bị
// ghép thành một câu. Chỉ so từng byte với nguồn gốc mới bắt được.
//
// DÙNG:  node tools/check2way.js <file-bai.html> <fixture.json> <thu-muc-nguon>
//
//   <fixture.json>     { "TEN_TOKEN": "nguyên văn trích dẫn", ... }
//   <thu-muc-nguon>    thư mục chứa nguồn đã tải: .txt (văn bản thô, vd từ pdftotext)
//                      hoặc .html (script tự bóc thẻ).
//
// Script phân biệt HAI loại lỗi, vì cách xử lý khác hẳn nhau:
//   - LỆCH KÝ TỰ  : chữ đúng, chỉ sai kiểu nháy/gạch => lấy lại byte từ nguồn.
//   - LỆCH NỘI DUNG: chữ khác thật => quote sai, phải bỏ hoặc trích lại.
//
// LƯU Ý bẫy đã gặp, đừng tưởng là lỗi thật:
//   - Ranh giới thẻ (</a>, <em>) làm chèn thêm space khi bóc thẻ.
//   - pdftotext chèn caption hình ("Fig. 4-2") vào giữa câu, và để lại ligature ﬁ ﬂ.
// Cả hai đều là false-negative của khâu bóc text, không phải quote sai.

const fs = require('fs');
const path = require('path');

const [file, fixturePath, srcDir] = process.argv.slice(2);
if (!file || !fixturePath || !srcDir) {
  console.error('Dùng: node tools/check2way.js <file-bai.html> <fixture.json> <thu-muc-nguon>');
  process.exit(2);
}

const decode = s => s
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');

function stripHtml(s) {
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(+d))
       .replace(/&#x([0-9a-f]+);/gi, (m, d) => String.fromCodePoint(parseInt(d, 16)));
  return decode(s)
    .replace(/&rsquo;/g, '\u2019').replace(/&lsquo;/g, '\u2018')
    .replace(/&ldquo;/g, '\u201c').replace(/&rdquo;/g, '\u201d')
    .replace(/&mdash;/g, '\u2014').replace(/&ndash;/g, '\u2013');
}

// Gỡ CR và ligature — pdftotext để lại, làm grep trượt trong im lặng.
const clean = s => s.replace(/\r/g, '')
  .replace(/\uFB00/g, 'ff').replace(/\uFB01/g, 'fi').replace(/\uFB02/g, 'fl')
  .replace(/\uFB03/g, 'ffi').replace(/\uFB04/g, 'ffl');

const flat = s => clean(s).replace(/\s+/g, ' ');
// Chuẩn hoá nháy/gạch để tách "lệch ký tự" khỏi "lệch nội dung".
const norm = s => flat(s)
  .replace(/[\u2018\u2019]/g, "'").replace(/[\u201c\u201d]/g, '"')
  .replace(/[\u2013\u2014]/g, '-');

const SRC = {};
for (const f of fs.readdirSync(srcDir)) {
  const p = path.join(srcDir, f);
  if (!fs.statSync(p).isFile()) continue;
  if (/\.(txt|html?)$/i.test(f)) {
    const raw = fs.readFileSync(p, 'utf8');
    SRC[f] = flat(/\.html?$/i.test(f) ? stripHtml(raw) : raw);
  }
}
if (!Object.keys(SRC).length) { console.error('Không thấy nguồn .txt/.html nào trong ' + srcDir); process.exit(2); }

const QUOTES = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
const baiFlat = flat(decode(fs.readFileSync(file, 'utf8')));

let ok = 0, charOnly = 0, bad = 0;
for (const [tok, q] of Object.entries(QUOTES)) {
  const inBai = baiFlat.includes(q);
  let hit = null;
  for (const k in SRC) if (SRC[k].includes(q)) { hit = k; break; }

  if (inBai && hit) { ok++; console.log(`OK   ${tok.padEnd(12)} [${hit}]`); continue; }

  // Chữ có đúng không, chỉ sai kiểu ký tự?
  const nq = norm(q);
  let softHit = null;
  for (const k in SRC) if (norm(SRC[k]).includes(nq)) { softHit = k; break; }

  if (!inBai) {
    bad++;
    console.log(`FAIL ${tok.padEnd(12)} KHÔNG thấy trong bài (bài đã sửa tay sau khi thay token?)`);
    continue;
  }
  if (softHit) {
    charOnly++;
    console.log(`LỆCH-KÝ-TỰ ${tok.padEnd(12)} [${softHit}] chữ đúng, sai kiểu nháy/gạch => lấy lại byte từ nguồn`);
    continue;
  }
  bad++;
  // Chỉ ra đúng chỗ bắt đầu lệch.
  let best = { k: null, lo: -1 };
  for (const k in SRC) {
    const hay = norm(SRC[k]);
    let lo = 0, hi = nq.length;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (hay.includes(nq.slice(0, mid))) lo = mid; else hi = mid - 1; }
    if (lo > best.lo) best = { k, lo };
  }
  console.log(`FAIL ${tok.padEnd(12)} LỆCH NỘI DUNG — khớp được ${best.lo}/${nq.length} ký tự với [${best.k}]`);
  console.log('   bài  : ...' + JSON.stringify(nq.slice(Math.max(0, best.lo - 40), best.lo + 40)));
  const hay = norm(SRC[best.k]);
  const anchor = nq.slice(Math.max(0, best.lo - 40), best.lo);
  const p = hay.indexOf(anchor);
  console.log('   nguồn: ...' + (p < 0 ? '(không định vị được)' : JSON.stringify(hay.substr(p, 80))));
}

console.log(`\n=== ${ok} khớp byte | ${charOnly} lệch ký tự | ${bad} lệch nội dung / tổng ${Object.keys(QUOTES).length} ===`);
process.exit(bad || charOnly ? 1 : 0);
