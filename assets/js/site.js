// site.js — mọi hành vi tương tác của site. Vanilla, IIFE, tự guard theo phần tử có/không có trên trang.
// Nạp SAU curriculum.js (dùng window.CURRICULUM). Chạy trên mọi trang qua body[data-page].
// Xem: design-spec-v2.txt mục 7 (JS behaviors).
(function () {
    "use strict";

    var CURRICULUM = window.CURRICULUM || [];

    // ===== ICON MAP =====
    // Mọi icon là SVG stroke, 24x24, currentColor, stroke-width 2, round caps — không emoji.
    // icon(name, extraClass) trả về markup <svg> string; iconEl(...) trả về Element thật.
    var ICONS = {
        controller: '<rect x="2" y="8" width="20" height="10" rx="5"></rect><line x1="7" y1="11" x2="7" y2="15"></line><line x1="5" y1="13" x2="9" y2="13"></line><circle cx="16" cy="12" r="1"></circle><circle cx="18.5" cy="14.5" r="1"></circle>',
        sun: '<circle cx="12" cy="12" r="4"></circle><line x1="12" y1="2" x2="12" y2="5"></line><line x1="12" y1="19" x2="12" y2="22"></line><line x1="4.2" y1="4.2" x2="6.3" y2="6.3"></line><line x1="17.7" y1="17.7" x2="19.8" y2="19.8"></line><line x1="2" y1="12" x2="5" y2="12"></line><line x1="19" y1="12" x2="22" y2="12"></line><line x1="4.2" y1="19.8" x2="6.3" y2="17.7"></line><line x1="17.7" y1="6.3" x2="19.8" y2="4.2"></line>',
        moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.8 6.8 0 0 0 20 14.5Z"></path>',
        menu: '<line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line>',
        close: '<line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line>',
        check: '<polyline points="4,13 9,18 20,6"></polyline>',
        x: '<line x1="6" y1="6" x2="18" y2="18"></line><line x1="18" y1="6" x2="6" y2="18"></line>',
        circle: '<circle cx="12" cy="12" r="8"></circle>',
        chevronRight: '<polyline points="9,5 16,12 9,19"></polyline>',
        clock: '<circle cx="12" cy="12" r="9"></circle><polyline points="12,7 12,12 16,14"></polyline>',
        barChart: '<line x1="5" y1="19" x2="5" y2="11"></line><line x1="12" y1="19" x2="12" y2="6"></line><line x1="19" y1="19" x2="19" y2="14"></line>',
        link: '<path d="M9 15 15 9"></path><path d="M11 6l1.5-1.5a4 4 0 0 1 5.7 5.7L16.5 12"></path><path d="M13 18l-1.5 1.5a4 4 0 0 1-5.7-5.7L7.5 12"></path>',
        bulb: '<path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.5h6c0-1.1.4-1.9 1-2.5A6 6 0 0 0 12 2Z"></path>',
        eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle>',
        tool: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2Z"></path>',
        checkCircle: '<circle cx="12" cy="12" r="9"></circle><polyline points="8,12.5 11,15.5 16,9"></polyline>',
        pencil: '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z"></path><line x1="14" y1="7" x2="17" y2="10"></line>',
        magnifier: '<circle cx="11" cy="11" r="6"></circle><line x1="16" y1="16" x2="21" y2="21"></line>',
        question: '<circle cx="12" cy="12" r="9"></circle><path d="M9.5 9a2.5 2.5 0 0 1 4.8 1c0 1.5-2.3 1.8-2.3 3.5"></path><line x1="12" y1="17" x2="12" y2="17.2"></line>',
        arrowRight: '<line x1="4" y1="12" x2="20" y2="12"></line><polyline points="14,6 20,12 14,18"></polyline>',
        foundation: '<line x1="5" y1="3" x2="5" y2="21"></line><path d="M5 4h13l-3 4 3 4H5Z"></path>',
        core: '<polygon points="12,3 21,8 12,13 3,8"></polygon><polyline points="3,13.5 12,18.5 21,13.5"></polyline>',
        craft: '<path d="M17 3l4 4-3 3-4-4Z"></path><path d="M14.5 7.5 3 19l2 2 11.5-11.5Z"></path>',
        deep: '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle>',
        advanced: '<path d="M12 2c3 2 5 6 5 10 0 2-1 4-2 5l-3 3-3-3c-1-1-2-3-2-5 0-4 2-8 5-10Z"></path><circle cx="12" cy="10" r="1.5"></circle><path d="M9 17l-3 4"></path><path d="M15 17l3 4"></path>',
        capstone: '<path d="M7 4h10v4a5 5 0 0 1-10 0Z"></path><path d="M7 5H4a3 3 0 0 0 3 3"></path><path d="M17 5h3a3 3 0 0 1-3 3"></path><line x1="12" y1="13" x2="12" y2="17"></line><path d="M8 21h8"></path><path d="M9 21v-2a3 3 0 0 1 6 0v2"></path>'
    };

    function icon(name, extraClass) {
        var body = ICONS[name];
        if (!body) return "";
        return '<svg class="icon' + (extraClass ? " " + extraClass : "") + '" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + body + "</svg>";
    }
    function iconEl(name, extraClass) {
        var tmp = document.createElement("div");
        tmp.innerHTML = icon(name, extraClass);
        return tmp.firstElementChild;
    }

    // ===== DOM HELPERS =====
    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
    function el(tag, className, text) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (text != null) e.textContent = text;
        return e;
    }

    // ===== CURRICULUM HELPERS =====
    // Danh sách bài phẳng theo đúng thứ tự tầng > bài, kèm tham chiếu tầng của nó.
    function flattenLessons() {
        var out = [];
        CURRICULUM.forEach(function (tier) {
            tier.lessons.forEach(function (lesson) {
                out.push({ lesson: lesson, tier: tier });
            });
        });
        return out;
    }

    // Đọc localStorage "gd-progress", chỉ giữ slug còn tồn tại trong CURRICULUM (tránh rác khi curriculum đổi).
    function getProgress() {
        var slugs = [];
        try {
            var raw = localStorage.getItem("gd-progress");
            if (raw) slugs = JSON.parse(raw);
        } catch (e) { /* localStorage bị chặn hoặc JSON hỏng -> coi như rỗng */ }
        if (!Array.isArray(slugs)) slugs = [];
        var valid = flattenLessons().map(function (x) { return x.lesson.slug; });
        return slugs.filter(function (s) { return valid.indexOf(s) !== -1; });
    }
    function setProgress(slugs) {
        try { localStorage.setItem("gd-progress", JSON.stringify(slugs)); } catch (e) { /* ignore */ }
    }
    function toggleLessonDone(slug) {
        var slugs = getProgress();
        var i = slugs.indexOf(slug);
        if (i === -1) slugs.push(slug); else slugs.splice(i, 1);
        setProgress(slugs);
        return slugs;
    }

    function dataRoot() {
        return document.body.getAttribute("data-root") || "./";
    }

    // ===== THEME TOGGLE =====
    // Theme đã được set trên <html> bởi inline script chống nháy trong <head>; ở đây chỉ gắn nút bấm.
    function initTheme() {
        var btn = $("#themeToggle");
        if (!btn) return;
        function apply(theme) {
            document.documentElement.setAttribute("data-theme", theme);
            btn.setAttribute("aria-label", theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
            btn.innerHTML = "";
            btn.appendChild(iconEl(theme === "dark" ? "moon" : "sun"));
        }
        apply(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
        btn.addEventListener("click", function () {
            var cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
            var next = cur === "dark" ? "light" : "dark";
            try { localStorage.setItem("gd-theme", next); } catch (e) { /* ignore */ }
            apply(next);
        });
    }

    // ===== DRAWER (dùng chung cho nav mobile và lesson-nav) =====
    // Tạo backdrop riêng, xử lý Esc, click-outside, khóa scroll body, trả focus về nút mở khi đóng.
    function createDrawer(trigger, panel) {
        if (!trigger || !panel) return;
        var backdrop = el("div", "drawer-backdrop");
        document.body.appendChild(backdrop);
        var lastFocused = null;

        function onKeydown(e) {
            if (e.key === "Escape") close();
        }
        function open() {
            lastFocused = document.activeElement;
            panel.classList.add("is-open");
            backdrop.classList.add("is-open");
            document.body.classList.add("no-scroll");
            trigger.setAttribute("aria-expanded", "true");
            document.addEventListener("keydown", onKeydown);
        }
        function close() {
            panel.classList.remove("is-open");
            backdrop.classList.remove("is-open");
            document.body.classList.remove("no-scroll");
            trigger.setAttribute("aria-expanded", "false");
            document.removeEventListener("keydown", onKeydown);
            if (lastFocused && lastFocused.focus) lastFocused.focus();
        }
        trigger.addEventListener("click", function () {
            if (panel.classList.contains("is-open")) close(); else open();
        });
        backdrop.addEventListener("click", close);
        $all("a", panel).forEach(function (a) { a.addEventListener("click", close); });
    }

    function initDrawers() {
        var menuBtn = $("#menuToggle");
        if (menuBtn) {
            menuBtn.innerHTML = "";
            menuBtn.appendChild(iconEl("menu"));
            createDrawer(menuBtn, $("#siteNav"));
        }
        var lessonNavBtn = $("#lessonNavToggle");
        if (lessonNavBtn) {
            lessonNavBtn.innerHTML = "";
            lessonNavBtn.appendChild(iconEl("core"));
            var label = el("span", null, "Lộ trình");
            lessonNavBtn.appendChild(label);
            createDrawer(lessonNavBtn, $("#lessonNav"));
        }
    }

    // ===== HOME: thẻ tiến độ + bài tiếp theo =====
    function renderHomeProgress() {
        var mount = $("#progressCard");
        if (!mount) return;
        var flat = flattenLessons();
        var done = getProgress();
        var total = flat.length;
        var doneCount = done.length;
        var percent = total ? doneCount / total : 0;
        var circumference = 2 * Math.PI * 40;

        var ringFill = $("#progressRingFill", mount);
        if (ringFill) {
            ringFill.style.strokeDasharray = circumference.toFixed(1);
            ringFill.style.strokeDashoffset = (circumference * (1 - percent)).toFixed(1);
        }
        var ringLabel = $("#progressRingLabel", mount);
        if (ringLabel) ringLabel.textContent = doneCount + "/" + total;

        var nextWrap = $("#progressNext", mount);
        if (nextWrap) {
            nextWrap.textContent = "";
            var next = flat.filter(function (x) { return done.indexOf(x.lesson.slug) === -1; })[0];
            if (!next) {
                nextWrap.textContent = "Bạn đã học hết các bài hiện có. Tuyệt vời!";
            } else {
                nextWrap.appendChild(document.createTextNode("Bài tiếp theo nên học: "));
                var a = document.createElement("a");
                a.href = dataRoot() + "lo-trinh.html#" + next.tier.key;
                var strong = document.createElement("strong");
                strong.textContent = next.lesson.title + (next.lesson.status === "planned" ? " (đang soạn)" : "");
                a.appendChild(strong);
                nextWrap.appendChild(a);
            }
        }
    }

    // ===== HOME: thẻ tầng (bản đồ lộ trình) =====
    function renderHomeTierCards() {
        var mount = $("#tierGrid");
        if (!mount) return;
        var root = dataRoot();
        var done = getProgress();
        CURRICULUM.forEach(function (tier) {
            var readyCount = tier.lessons.filter(function (l) { return l.status === "ready"; }).length;
            var a = document.createElement("a");
            a.className = "tier-card tier-" + tier.tier;
            a.href = root + "lo-trinh.html#" + tier.key;

            var band = el("div", "tier-card-band");
            band.appendChild(el("span", "tier-card-num", String(tier.tier)));
            band.appendChild(iconEl(tier.icon, "tier-card-icon"));
            a.appendChild(band);

            var body = el("div", "tier-card-body");
            var h3 = el("h3"); h3.textContent = tier.name;
            var p = el("p"); p.textContent = tier.blurb;
            body.appendChild(h3);
            body.appendChild(p);

            var foot = el("div", "tier-card-foot");
            foot.appendChild(el("span", "tier-card-count", tier.lessons.length + " bài"));
            var bar = el("div", "tier-progress-bar");
            var fill = document.createElement("span");
            fill.style.width = (tier.lessons.length ? Math.round((readyCount / tier.lessons.length) * 100) : 0) + "%";
            bar.appendChild(fill);
            foot.appendChild(bar);
            var pill = el("span", "pill " + (readyCount > 0 ? "pill-ready" : "pill-planned"),
                readyCount > 0 ? (readyCount + " bài sẵn sàng") : "Sắp có");
            foot.appendChild(pill);
            body.appendChild(foot);
            a.appendChild(body);

            mount.appendChild(a);
        });
        void done; // tiến độ chi tiết theo tầng hiển thị ở lo-trinh.html; ở đây chỉ cần trạng thái sẵn sàng
    }

    // ===== LO-TRINH.HTML: toàn bộ =====
    function buildLessonCardTop(container, lesson, idx, pillClass, pillText, isDone) {
        var top = el("div", "lesson-card-top");
        top.appendChild(el("span", "lesson-card-index", String(idx + 1).length < 2 ? "0" + (idx + 1) : String(idx + 1)));
        var pill = el("span", "pill " + pillClass);
        if (isDone) pill.appendChild(iconEl("check"));
        pill.appendChild(document.createTextNode(pillText));
        top.appendChild(pill);
        container.appendChild(top);
    }
    function buildLessonCardBody(container, lesson) {
        var h3 = el("h3"); h3.textContent = lesson.title;
        container.appendChild(h3);
        container.appendChild(el("p", "desc", lesson.summary));
        var meta = el("div", "lesson-card-meta");
        meta.appendChild(iconEl("clock"));
        meta.appendChild(document.createTextNode(lesson.minutes + " phút đọc"));
        container.appendChild(meta);
    }
    function buildLessonCard(tier, lesson, idx, root, done) {
        var isDone = done.indexOf(lesson.slug) !== -1;
        if (lesson.status === "ready") {
            var a = document.createElement("a");
            a.className = "lesson-card";
            a.href = root + "lessons/" + lesson.slug + ".html";
            buildLessonCardTop(a, lesson, idx, isDone ? "pill-done" : "pill-ready", isDone ? "Đã học" : "Đọc ngay", isDone);
            buildLessonCardBody(a, lesson);
            return a;
        }
        // planned: cả thẻ là button mở rộng tại chỗ — không bao giờ là link chết.
        var wrap = el("div", "lesson-card");
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lesson-card-trigger";
        btn.setAttribute("aria-expanded", "false");
        var expandId = "expand-" + lesson.slug.replace(/\//g, "-");
        btn.setAttribute("aria-controls", expandId);
        buildLessonCardTop(btn, lesson, idx, "pill-planned", "Sắp có", false);
        buildLessonCardBody(btn, lesson);
        wrap.appendChild(btn);

        var expand = el("div", "lesson-card-expand");
        expand.id = expandId;
        expand.hidden = true;
        expand.appendChild(el("p", null, "Bài này sẽ giúp bạn:"));
        var ul = document.createElement("ul");
        lesson.goals.forEach(function (g) { ul.appendChild(el("li", null, g)); });
        expand.appendChild(ul);
        expand.appendChild(el("p", "note", "Bài đang được soạn."));
        wrap.appendChild(expand);

        btn.addEventListener("click", function () {
            var isOpen = btn.getAttribute("aria-expanded") === "true";
            btn.setAttribute("aria-expanded", String(!isOpen));
            expand.hidden = isOpen;
        });
        return wrap;
    }
    function renderRoadmap() {
        var mount = $("#roadmapTiers");
        if (!mount) return;
        var root = dataRoot();
        var done = getProgress();
        var jump = $("#jumpbar .jumpbar-inner");
        var flat = flattenLessons();
        var totalDone = done.length;

        var headerProgress = $("#roadmapHeaderProgress");
        if (headerProgress) headerProgress.textContent = totalDone + "/" + flat.length + " bài đã học";

        CURRICULUM.forEach(function (tier) {
            if (jump) {
                var jlink = document.createElement("a");
                jlink.href = "#" + tier.key;
                jlink.className = "tier-" + tier.tier;
                jlink.textContent = tier.name;
                jump.appendChild(jlink);
            }

            var section = document.createElement("section");
            section.id = tier.key;
            section.className = "tier-section tier-" + tier.tier;

            // Layout note: copy chỉ chứa h2 (tên tầng); blurb (p) là con trực tiếp của
            // head để mobile grid có thể đặt nó full-width, thẳng mép trái với số tầng
            // — xem .tier-section-head trong site.css (mục 10).
            var head = el("div", "tier-section-head");
            head.appendChild(el("span", "tier-card-num", String(tier.tier)));
            var copy = el("div", "tier-section-head-copy");
            var h2 = el("h2"); h2.textContent = tier.name;
            copy.appendChild(h2);
            head.appendChild(copy);
            head.appendChild(el("p", null, tier.blurb));

            var doneInTier = tier.lessons.filter(function (l) { return done.indexOf(l.slug) !== -1; }).length;
            var progWrap = el("div", "tier-section-progress");
            progWrap.appendChild(document.createTextNode(doneInTier + "/" + tier.lessons.length));
            var bar = el("div", "tier-progress-bar");
            var fill = document.createElement("span");
            fill.style.width = (tier.lessons.length ? Math.round((doneInTier / tier.lessons.length) * 100) : 0) + "%";
            bar.appendChild(fill);
            progWrap.appendChild(bar);
            head.appendChild(progWrap);
            section.appendChild(head);

            var grid = el("div", "lesson-grid");
            tier.lessons.forEach(function (lesson, idx) {
                grid.appendChild(buildLessonCard(tier, lesson, idx, root, done));
            });
            section.appendChild(grid);
            mount.appendChild(section);
        });
    }

    // ===== LESSON / COMPONENTS: nav trái (accordion tầng + bài) =====
    function renderLessonNav() {
        var mount = $("#lessonNavTree");
        if (!mount) return;
        var root = dataRoot();
        var currentSlug = document.body.getAttribute("data-lesson") || "";
        var done = getProgress();

        CURRICULUM.forEach(function (tier) {
            var containsCurrent = tier.lessons.some(function (l) { return l.slug === currentSlug; });
            var details = document.createElement("details");
            details.className = "lesson-nav-tier tier-" + tier.tier;
            if (containsCurrent) details.open = true;

            var summary = document.createElement("summary");
            summary.appendChild(el("span", "dot"));
            summary.appendChild(document.createTextNode(tier.name));
            summary.appendChild(iconEl("chevronRight", "chev"));
            details.appendChild(summary);

            var list = el("div", "lesson-nav-list");
            tier.lessons.forEach(function (lesson) {
                var isDone = done.indexOf(lesson.slug) !== -1;
                var isCurrent = lesson.slug === currentSlug;
                var state = isDone ? "is-done" : (isCurrent ? "is-current" : (lesson.status === "ready" ? "is-ready" : "is-planned"));
                var item = el("div", "lesson-nav-item " + state);
                var ring = el("span", "ring");
                if (isDone) ring.appendChild(iconEl("check"));
                item.appendChild(ring);

                var copy = el("div", "lesson-nav-item-copy");
                var link = document.createElement("a");
                if (lesson.status === "ready") {
                    link.href = root + "lessons/" + lesson.slug + ".html";
                } else {
                    // planned trong nav vẫn có đích: về lộ trình đúng tầng.
                    link.href = root + "lo-trinh.html#" + tier.key;
                }
                link.textContent = lesson.title;
                copy.appendChild(link);
                if (lesson.status !== "ready") copy.appendChild(el("span", "soon", "sắp có"));
                item.appendChild(copy);
                list.appendChild(item);
            });
            details.appendChild(list);
            mount.appendChild(details);
        });
    }

    // ===== LESSON / COMPONENTS: TOC tự sinh + scroll-spy =====
    function renderTOC() {
        var article = $(".lesson-article");
        var tocDesktop = $("#toc");
        var tocMobile = $("#tocMobile");
        if (!article || (!tocDesktop && !tocMobile)) return;
        var headings = $all("h2[id]", article);
        if (!headings.length) return;

        function buildList() {
            var ul = document.createElement("ul");
            headings.forEach(function (h) {
                var li = document.createElement("li");
                var a = document.createElement("a");
                a.href = "#" + h.id;
                a.textContent = h.textContent;
                li.appendChild(a);
                ul.appendChild(li);
            });
            return ul;
        }
        if (tocDesktop) {
            tocDesktop.appendChild(el("p", "toc-title", "Trong bài này"));
            tocDesktop.appendChild(buildList());
        }
        if (tocMobile) {
            tocMobile.appendChild(buildList());
        }

        if (tocDesktop && "IntersectionObserver" in window) {
            var links = $all("a", tocDesktop);
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var href = "#" + entry.target.id;
                    links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("href") === href); });
                });
            }, { rootMargin: "-20% 0px -70% 0px" });
            headings.forEach(function (h) { observer.observe(h); });
        }
    }

    // ===== LESSON / COMPONENTS: thanh tiến độ đọc =====
    function initReadingBar() {
        var fill = $("#readingBarFill");
        var article = $(".lesson-article");
        if (!fill || !article) return;
        var ticking = false;
        function update() {
            var rect = article.getBoundingClientRect();
            var total = rect.height - window.innerHeight;
            var scrolled = -rect.top;
            var percent = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
            fill.style.width = percent + "%";
            ticking = false;
        }
        window.addEventListener("scroll", function () {
            if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
        }, { passive: true });
        update();
    }

    // ===== LESSON / COMPONENTS: pager bài trước/sau =====
    function renderPager() {
        var prevMount = $("#pagerPrev");
        var nextMount = $("#pagerNext");
        if (!prevMount && !nextMount) return;
        var root = dataRoot();
        var currentSlug = document.body.getAttribute("data-lesson") || "";
        var flat = flattenLessons();
        var idx = -1;
        flat.forEach(function (x, i) { if (x.lesson.slug === currentSlug) idx = i; });
        if (idx === -1) {
            if (prevMount) prevMount.hidden = true;
            if (nextMount) nextMount.hidden = true;
            return;
        }
        var prev = idx > 0 ? flat[idx - 1] : null;
        var next = idx < flat.length - 1 ? flat[idx + 1] : null;

        function fill(mount, entry, dirLabel) {
            if (!mount) return;
            if (!entry) { mount.hidden = true; return; }
            mount.textContent = "";
            mount.hidden = false;
            mount.appendChild(el("span", "dir", dirLabel));
            var ttl = el("span", "ttl");
            if (entry.lesson.status === "ready") {
                mount.href = root + "lessons/" + entry.lesson.slug + ".html";
                ttl.textContent = entry.lesson.title;
            } else {
                mount.href = root + "lo-trinh.html#" + entry.tier.key;
                ttl.textContent = entry.lesson.title + " — Sắp có";
            }
            mount.appendChild(ttl);
        }
        fill(prevMount, prev, "Bài trước");
        fill(nextMount, next, "Bài tiếp");
    }

    // ===== LESSON / COMPONENTS: đánh dấu đã học =====
    // data-demo="true" trên <body> (dùng ở components.html — trang trình diễn component,
    // không phải bài học thật) -> nút chỉ đổi trạng thái hiển thị trong bộ nhớ, KHÔNG
    // bao giờ đọc/ghi localStorage "gd-progress". Tránh demo page ghi đè tiến độ thật
    // của slug bài học mà nó mượn để demo nav/pager.
    function initMarkDone() {
        var btn = $("#markDoneBtn");
        if (!btn) return;
        var slug = document.body.getAttribute("data-lesson");
        if (!slug) return;
        var isDemo = document.body.getAttribute("data-demo") === "true";
        var demoIsDone = false;
        function render() {
            var isDone = isDemo ? demoIsDone : getProgress().indexOf(slug) !== -1;
            btn.classList.toggle("is-done", isDone);
            btn.setAttribute("aria-pressed", String(isDone));
            btn.innerHTML = "";
            btn.appendChild(iconEl(isDone ? "checkCircle" : "circle"));
            btn.appendChild(document.createTextNode(isDone ? "Đã học" : "Đánh dấu đã học"));
        }
        render();
        btn.addEventListener("click", function () {
            if (isDemo) { demoIsDone = !demoIsDone; } else { toggleLessonDone(slug); }
            render();
        });
    }

    // ===== QUIZ =====
    function initQuiz() {
        $all(".quiz").forEach(function (quiz) {
            var answer = quiz.getAttribute("data-answer");
            var opts = $all("button[data-opt]", quiz);
            var explain = $(".explain", quiz);
            if (explain) explain.hidden = true;

            var feedback = $(".quiz-feedback", quiz);
            if (!feedback) {
                feedback = el("div", "quiz-feedback");
                feedback.hidden = true;
                if (explain) quiz.insertBefore(feedback, explain); else quiz.appendChild(feedback);
            }
            var retry = $(".quiz-retry", quiz);
            if (!retry) {
                retry = document.createElement("button");
                retry.type = "button";
                retry.className = "quiz-retry";
                retry.textContent = "Làm lại";
                retry.hidden = true;
                quiz.appendChild(retry);
            }
            opts.forEach(function (opt) {
                if (!$(".result-icon", opt)) {
                    var c = el("span", "result-icon icon-correct"); c.appendChild(iconEl("check")); opt.appendChild(c);
                    var w = el("span", "result-icon icon-wrong"); w.appendChild(iconEl("x")); opt.appendChild(w);
                }
            });

            var locked = false;
            function reset() {
                locked = false;
                opts.forEach(function (o) { o.classList.remove("is-correct", "is-wrong"); o.disabled = false; });
                feedback.hidden = true;
                if (explain) explain.hidden = true;
                retry.hidden = true;
            }
            opts.forEach(function (opt) {
                opt.addEventListener("click", function () {
                    if (locked) return;
                    locked = true;
                    var chosen = opt.getAttribute("data-opt");
                    var isCorrect = chosen === answer;
                    opts.forEach(function (o) { o.disabled = true; });
                    opt.classList.add(isCorrect ? "is-correct" : "is-wrong");
                    if (!isCorrect) {
                        opts.forEach(function (o) {
                            if (o.getAttribute("data-opt") === answer) o.classList.add("is-correct");
                        });
                    }
                    feedback.hidden = false;
                    feedback.className = "quiz-feedback " + (isCorrect ? "is-correct" : "is-wrong");
                    feedback.textContent = "";
                    feedback.appendChild(iconEl(isCorrect ? "check" : "x"));
                    feedback.appendChild(document.createTextNode(isCorrect ? "Chính xác" : "Chưa đúng"));
                    if (explain) explain.hidden = false;
                    retry.hidden = false;
                });
            });
            retry.addEventListener("click", reset);
        });
    }

    // ===== FLASHCARDS =====
    // button mặc định đã hỗ trợ Enter/Space -> chỉ cần lắng nghe click.
    function initFlashcards() {
        $all("button.flash").forEach(function (card) {
            card.addEventListener("click", function () {
                card.classList.toggle("is-flipped");
            });
        });
    }

    // ===== INIT =====
    function init() {
        initTheme();
        initDrawers();

        var page = document.body.getAttribute("data-page");
        if (page === "home") {
            renderHomeProgress();
            renderHomeTierCards();
        }
        if (page === "roadmap") {
            renderRoadmap();
        }
        if (page === "lesson" || page === "components") {
            renderLessonNav();
            renderTOC();
            initReadingBar();
            renderPager();
            initMarkDone();
        }
        initQuiz();
        initFlashcards();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
