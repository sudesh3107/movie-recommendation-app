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