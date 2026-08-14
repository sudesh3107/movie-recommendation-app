/* ==========================================================
   MOVIEFLIX — GLOBAL EFFECTS ENGINE
   Preloader · Aurora · Grain · Cursor Glow · Particles ·
   Reveal on scroll · Spotlight + Tilt · Ripple · Parallax
   Injected on every page. Safe to load multiple times.
   ========================================================== */
(function () {
    "use strict";

    if (window.__mfEffectsLoaded) return;
    window.__mfEffectsLoaded = true;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    var body = document.body;

    /* ---------- PRELOADER ---------- */
    var preloader = document.createElement("div");
    preloader.id = "mf-preloader";
    preloader.innerHTML =
        '<div class="mf-loader">' +
        '<div class="mf-loader-ring"></div>' +
        '<i class="mf-loader-icon fa-solid fa-film"></i>' +
        '<h2 class="mf-loader-title">MOVIEFLIX</h2>' +
        '<div class="mf-loader-bar"><span></span></div>' +
        "</div>";
    body.prepend(preloader);

    var hidden = false;
    function hidePreloader() {
        if (hidden) return;
        hidden = true;
        preloader.classList.add("hide");
        setTimeout(function () { preloader.remove(); }, 900);
    }
    window.addEventListener("load", hidePreloader);
    setTimeout(hidePreloader, 3200);

    /* ---------- AURORA ORBS ---------- */
    var aurora = document.createElement("div");
    aurora.id = "mf-aurora";
    aurora.innerHTML =
        '<div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="orb o4"></div>';
    body.prepend(aurora);

    /* ---------- GRAIN ---------- */
    var grain = document.createElement("div");
    grain.id = "mf-grain";
    body.appendChild(grain);

    /* ---------- CURSOR GLOW (desktop only) ---------- */
    if (!reduced && !isTouch) {
        var glow = document.createElement("div");
        glow.id = "mf-cursor-glow";
        body.appendChild(glow);

        var mx = window.innerWidth / 2, my = window.innerHeight / 2;
        var gx = mx, gy = my;

        document.addEventListener("mousemove", function (e) {
            mx = e.clientX;
            my = e.clientY;
        });

        function follow() {
            gx += (mx - gx) * 0.08;
            gy += (my - gy) * 0.08;
            glow.style.transform = "translate(" + gx.toFixed(1) + "px," + gy.toFixed(1) + "px)";
            requestAnimationFrame(follow);
        }
        requestAnimationFrame(follow);
    }

    /* ---------- PARTICLES CANVAS ---------- */
    var canvas = document.createElement("canvas");
    canvas.id = "mf-particles";
    body.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var W = 0, H = 0, parts = [], running = !document.hidden;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        var n = Math.min(90, Math.floor((W * H) / 22000));
        parts = [];
        for (var i = 0; i < n; i++) {
            parts.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: 0.8 + Math.random() * 1.8,
                s: 0.25 + Math.random() * 0.75,
                tw: Math.random() * Math.PI * 2,
                hue: Math.random() < 0.85 ? [0, 18, 32][Math.floor(Math.random() * 3)] : 190
            });
        }
    }
    window.addEventListener("resize", resize);
    resize();

    document.addEventListener("visibilitychange", function () {
        running = !document.hidden;
        if (running) loop();
    });

    function loop() {
        if (!running || reduced) return;
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            p.y -= p.s;
            p.tw += 0.03;
            if (p.y < -12) {
                p.y = H + 12;
                p.x = Math.random() * W;
            }
            var tw = 0.5 + 0.5 * Math.sin(p.tw);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = "hsla(" + p.hue + ",95%,62%," + (0.12 + 0.3 * tw).toFixed(3) + ")";
            ctx.shadowColor = "hsla(" + p.hue + ",95%,60%,.9)";
            ctx.shadowBlur = 6 * p.r;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        requestAnimationFrame(loop);
    }
    if (!reduced) loop();

    /* ---------- GLASSIFY INLINE-STYLED WRAPPERS (details / watchlist) ---------- */
    document.querySelectorAll("body > div[style]").forEach(function (d) {
        var st = d.getAttribute("style") || "";
        if (!d.id && !d.className && /padding/i.test(st)) {
            d.classList.add("mf-glass-panel");
        }
    });

    document.querySelectorAll("section[style*='padding']").forEach(function (s) {
        s.classList.add("mf-soft-panel");
    });

    document.querySelectorAll("img[style*='box-shadow']").forEach(function (img) {
        img.classList.add("mf-poster");
    });

    /* ---------- NAVBAR SCROLL STATE ---------- */
    var nav = document.querySelector(".navbar");
    if (nav) {
        var onScroll = function () {
            nav.classList.toggle("scrolled", window.scrollY > 30);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    /* ---------- REVEAL ON SCROLL ---------- */
    var revealSel =
        "section, .movie-card, .movie-grid, .movie-row, .feature, .box, .card, .stat-card, .summary-card, " +
        ".account-card, .profile-left, .profile-header, .genre-tag, .genre, .tech-grid > div, .review-card, " +
        ".review-form, .review-item, .register-box, .container, .hero, .page-header, .empty, .watch-card, " +
        ".profile-header, .profile-center, .stats-section, .section-header, .footer-content, .review-list";

    var revealEls = [];
    document.querySelectorAll(revealSel).forEach(function (el) { revealEls.push(el); });

    if (!reduced && "IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    var el = en.target;
                    var idx = Array.prototype.indexOf.call(el.parentElement.children, el);
                    el.style.setProperty("--reveal-delay", Math.min(idx * 60, 420) + "ms");
                    el.classList.add("in");
                    io.unobserve(el);
                }
            });
        }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

        revealEls.forEach(function (el) {
            el.classList.add("reveal");
            io.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add("reveal", "in");
        });
    }

    /* ---------- SPOTLIGHT + TILT ---------- */
    if (!isTouch) {
        document.querySelectorAll(
            ".movie-card, .watch-card, .review-card, .review-item, .profile-header, .feature, .box, .stat-card, .summary-card, .account-card, .card, .genre-tag, .genre"
        ).forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var r = card.getBoundingClientRect();
                var x = e.clientX - r.left, y = e.clientY - r.top;
                card.style.setProperty("--mx", x + "px");
                card.style.setProperty("--my", y + "px");
                var rx = ((y / r.height) - 0.5) * -8;
                var ry = ((x / r.width) - 0.5) * 8;
                card.style.setProperty("--rx", rx.toFixed(2) + "deg");
                card.style.setProperty("--ry", ry.toFixed(2) + "deg");
            });
            card.addEventListener("mouseleave", function () {
                card.style.setProperty("--rx", "0deg");
                card.style.setProperty("--ry", "0deg");
            });
        });
    }

    /* ---------- RIPPLE ON CLICK ---------- */
    if (!reduced) {
        document.addEventListener("click", function (e) {
            var btn = e.target.closest("a, button");
            if (!btn || !btn.getBoundingClientRect) return;
            var rect = btn.getBoundingClientRect();
            var d = Math.max(rect.width, rect.height) * 2;
            var span = document.createElement("span");
            span.className = "mf-ripple";
            span.style.width = d + "px";
            span.style.height = d + "px";
            span.style.left = e.clientX - rect.left - d / 2 + "px";
            span.style.top = e.clientY - rect.top - d / 2 + "px";
            btn.appendChild(span);
            setTimeout(function () { span.remove(); }, 750);
        });
    }

    /* ---------- TOUCH TAP SELECTION (cards on touch screens) ---------- */
    var touchCards =
        ".movie-card, .watch-card, .review-card, .review-item, .stat-card, .summary-card, " +
        ".account-card, .genre-tag, .genre, .feature, .box, .tech-grid > div, .card";

    if (isTouch) {
        document.addEventListener("touchstart", function (e) {
            var card = e.target.closest(touchCards);
            if (!card) return;
            var wasSelected = card.classList.contains("mf-touch");
            document.querySelectorAll(".mf-touch").forEach(function (el) {
                el.classList.remove("mf-touch");
            });
            if (!wasSelected) card.classList.add("mf-touch");
        }, { passive: true });
    } else {
        document.addEventListener("click", function (e) {
            var card = e.target.closest(touchCards);
            if (!card) return;
            card.classList.add("mf-touch");
            setTimeout(function () { card.classList.remove("mf-touch"); }, 900);
        });
    }

    /* ---------- ORB PARALLAX ---------- */
    if (!reduced && !isTouch) {
        var orbs = aurora.querySelectorAll(".orb");
        document.addEventListener("mousemove", function (e) {
            var x = e.clientX / window.innerWidth - 0.5;
            var y = e.clientY / window.innerHeight - 0.5;
            orbs.forEach(function (orb, i) {
                var depth = (i + 1) * 14;
                orb.style.transform = "translate(" + (x * depth).toFixed(1) + "px," + (y * depth).toFixed(1) + "px)";
            });
        });
    }
})();