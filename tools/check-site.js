// tools/check-site.js — kiểm tra tĩnh toàn bộ site, không dependency ngoài Node core.
// Chạy: node tools/check-site.js  → exit 0 nếu sạch, exit 1 + in danh sách lỗi nếu có.
// Xem: design-spec-v2.txt mục 8.
"use strict";

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var ROOT = path.resolve(__dirname, "..");
var errors = [];

function rel(file) {
    return path.relative(ROOT, file).split(path.sep).join("/");
}

// Duyệt đệ quy tìm file có đuôi extension, bỏ qua node_modules/.git.
function walk(dir, ext) {
    var out = [];
    var names;
    try {
        names = fs.readdirSync(dir);
    } catch (e) {
        return out;
    }
    names.forEach(function (name) {
        if (name === "node_modules" || name === ".git") return;
        var full = path.join(dir, name);
        var stat = fs.statSync(full);
        if (stat.isDirectory()) {
            out = out.concat(walk(full, ext));
        } else if (full.toLowerCase().endsWith(ext)) {
            out.push(full);
        }
    });
    return out;
}

// ===== Nạp curriculum.js qua vm (sandbox { window: {} }) =====
var curriculumPath = path.join(ROOT, "assets", "js", "curriculum.js");
var CURRICULUM = [];
if (!fs.existsSync(curriculumPath)) {
    errors.push("Không tìm thấy assets/js/curriculum.js");
} else {
    var curriculumSrc = fs.readFileSync(curriculumPath, "utf8");
    var sandbox = { window: {} };
    vm.createContext(sandbox);
    try {
        vm.runInContext(curriculumSrc, sandbox, { filename: curriculumPath });
        CURRICULUM = (sandbox.window && sandbox.window.CURRICULUM) || [];
    } catch (e) {
        errors.push("Lỗi khi chạy curriculum.js trong vm: " + e.message);
    }
}

var lessons = []; // { tier, lesson }
CURRICULUM.forEach(function (tier) {
    (tier.lessons || []).forEach(function (lesson) {
        lessons.push({ tier: tier, lesson: lesson });
    });
});

// ===== (a) status "ready" <-> file tồn tại, 2 chiều =====
var slugMap = {};
lessons.forEach(function (entry) {
    slugMap[entry.lesson.slug] = entry.lesson;
    var filePath = path.join(ROOT, "lessons", entry.lesson.slug + ".html");
    var exists = fs.existsSync(filePath);
    if (entry.lesson.status === "ready" && !exists) {
        errors.push('[a] curriculum.js: bài "' + entry.lesson.slug + '" có status "ready" nhưng không có file lessons/' + entry.lesson.slug + ".html");
    }
});
var lessonsDir = path.join(ROOT, "lessons");
if (fs.existsSync(lessonsDir)) {
    var lessonFiles = walk(lessonsDir, ".html").filter(function (f) {
        return !path.basename(f).startsWith("_");
    });
    lessonFiles.forEach(function (f) {
        var slug = path.relative(lessonsDir, f).split(path.sep).join("/").replace(/\.html$/i, "");
        var lesson = slugMap[slug];
        if (!lesson) {
            errors.push("[a] file lessons/" + slug + ".html tồn tại nhưng không có trong curriculum.js");
        } else if (lesson.status !== "ready") {
            errors.push('[a] file lessons/' + slug + '.html tồn tại nhưng status trong curriculum.js là "' + lesson.status + '" (phải là "ready")');
        }
    });
}

// ===== HTML files: (b) link tồn tại, (c) hash cùng trang, (e) charset/BOM/title =====
var htmlFiles = walk(ROOT, ".html");

htmlFiles.forEach(function (file) {
    var buf = fs.readFileSync(file);
    if (buf.length >= 3 && buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) {
        errors.push("[e] " + rel(file) + ": file có BOM UTF-8, phải lưu không BOM");
    }
    var html = buf.toString("utf8");

    if (!/<meta\s+charset=["']utf-8["']/i.test(html)) {
        errors.push("[e] " + rel(file) + ': thiếu <meta charset="utf-8">');
    }
    if (!/<title>[^<]+<\/title>/i.test(html)) {
        errors.push("[e] " + rel(file) + ": thiếu <title>");
    }

    var ids = {};
    var idRe = /\bid=["']([^"']+)["']/g;
    var m;
    while ((m = idRe.exec(html))) ids[m[1]] = true;

    var attrRe = /\b(href|src)=["']([^"']+)["']/g;
    while ((m = attrRe.exec(html))) {
        var val = m[2].trim();
        if (!val) continue;
        if (/^(https?:|mailto:|data:|javascript:)/i.test(val)) continue;
        if (val.charAt(0) === "#") {
            var id = val.slice(1);
            if (id && !ids[id]) {
                errors.push("[c] " + rel(file) + ': href="' + val + '" không có id tương ứng trong cùng trang');
            }
            continue;
        }
        var clean = val.split("#")[0].split("?")[0];
        if (!clean) continue;
        var resolved = path.resolve(path.dirname(file), clean);
        if (!fs.existsSync(resolved)) {
            errors.push("[b] " + rel(file) + ": " + m[1] + '="' + val + '" trỏ tới file không tồn tại (' + rel(resolved) + ")");
        }
    }
});

// ===== (f) mỗi .quiz có data-answer khớp đúng 1 button[data-opt] =====
htmlFiles.forEach(function (file) {
    var html = fs.readFileSync(file, "utf8");
    var quizStartRe = /<div class="quiz"[^>]*data-answer="([^"]*)"[^>]*>/g;
    var qm;
    while ((qm = quizStartRe.exec(html))) {
        var answer = qm[1];
        var openEnd = quizStartRe.lastIndex;
        var depth = 1;
        var tagRe = /<div\b|<\/div>/g;
        tagRe.lastIndex = openEnd;
        var tm;
        var end = html.length;
        while ((tm = tagRe.exec(html))) {
            if (tm[0] === "<div") depth++; else depth--;
            if (depth === 0) { end = tagRe.lastIndex; break; }
        }
        var content = html.slice(openEnd, end);
        var opts = [];
        var optRe = /data-opt="([^"]*)"/g;
        var om;
        while ((om = optRe.exec(content))) opts.push(om[1]);
        var matchCount = opts.filter(function (o) { return o === answer; }).length;
        if (matchCount !== 1) {
            errors.push("[f] " + rel(file) + ': quiz data-answer="' + answer + '" khớp ' + matchCount + " button[data-opt] (cần đúng 1)");
        }
        quizStartRe.lastIndex = end;
    }
});

// ===== (d) site.css: không hex color ngoài khối :root và html[data-theme="dark"] =====
var cssPath = path.join(ROOT, "assets", "css", "site.css");
if (!fs.existsSync(cssPath)) {
    errors.push("Không tìm thấy assets/css/site.css");
} else {
    var css = fs.readFileSync(cssPath, "utf8");

    function extractBlock(source, selectorRe) {
        var mm = selectorRe.exec(source);
        if (!mm) return null;
        var start = mm.index;
        var i = source.indexOf("{", start);
        if (i === -1) return null;
        var depth = 0;
        var j = i;
        for (; j < source.length; j++) {
            if (source[j] === "{") depth++;
            else if (source[j] === "}") {
                depth--;
                if (depth === 0) { j++; break; }
            }
        }
        return [start, j];
    }

    var rootBlock = extractBlock(css, /:root\s*\{/);
    var darkBlock = extractBlock(css, /html\[data-theme=["']dark["']\]\s*\{/);
    var stripped = css;
    [rootBlock, darkBlock]
        .filter(function (b) { return b; })
        .sort(function (a, b) { return b[0] - a[0]; })
        .forEach(function (b) {
            stripped = stripped.slice(0, b[0]) + stripped.slice(b[1]);
        });

    var hexRe = /#[0-9a-fA-F]{3,8}\b/g;
    var hm;
    while ((hm = hexRe.exec(stripped))) {
        errors.push('[d] site.css: hex color "' + hm[0] + '" nằm ngoài khối token (:root / html[data-theme="dark"])');
    }
}

// ===== Kết quả =====
if (errors.length) {
    console.log("check-site.js: tìm thấy " + errors.length + " lỗi:\n");
    errors.forEach(function (e) { console.log(" - " + e); });
    process.exit(1);
} else {
    console.log("check-site.js: 0 lỗi.");
    process.exit(0);
}
