/* ==========================================================
   MOVIEFLIX — REDESIGN v2 ENGINE
   Hero backdrop carousel · row scroll arrows ·
   scroll reveal · solid navbar on scroll
   Safe to load on any page.
   ========================================================== */
(function () {
    "use strict";

    if (window.__mfRedesignLoaded) return;
    window.__mfRedesignLoaded = true;

    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- SOLID NAVBAR ON SCROLL ---------- */
    var navbar = document.getElementById("navbar");
    if (navbar) {
        var onScroll = function () {
            navbar.classList.toggle("scrolled", window.scrollY > 40);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
    }

    /* ---------- HERO BACKDROP CAROUSEL ---------- */
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dotsWrap = document.getElementById("heroDots");
    var current = 0;
    var timer = null;

    if (slides.length > 1 && dotsWrap) {

        slides.forEach(function (_, i) {
            var dot = document.createElement("button");
            dot.className = "hero-dot" + (i === 0 ? " active" : "");
            dot.setAttribute("aria-label", "Slide " + (i + 1));
            dot.addEventListener("click", function () {
                goTo(i);
                restart();
            });
            dotsWrap.appendChild(dot);
        });

        var dots = Array.prototype.slice.call(dotsWrap.children);

        function goTo(i) {
            current = (i + slides.length) % slides.length;
            slides.forEach(function (s, k) {
                s.classList.toggle("active", k === current);
            });
            dots.forEach(function (d, k) {
                d.classList.toggle("active", k === current);
            });
        }

        function restart() {
            if (timer) clearInterval(timer);
            if (!reduced) {
                timer = setInterval(function () { goTo(current + 1); }, 5500);
            }
        }

        restart();
    }

    /* ---------- ROW SCROLL ARROWS ---------- */
    document.querySelectorAll(".row-wrapper").forEach(function (wrapper) {
        var row = wrapper.querySelector(".movie-row");
        var left = wrapper.querySelector(".row-arrow.left");
        var right = wrapper.querySelector(".row-arrow.right");
        if (!row || !left || !right) return;

        var step = function () { return row.clientWidth * 0.8; };

        left.addEventListener("click", function () {
            row.scrollBy({ left: -step(), behavior: "smooth" });
        });

        right.addEventListener("click", function () {
            row.scrollBy({ left: step(), behavior: "smooth" });
        });
    });

    /* ---------- CARD CLICK -> DETAILS ---------- */
    document.querySelectorAll(".movie-card").forEach(function (card) {
        var href = card.getAttribute("data-href");
        if (!href) {
            var link = card.querySelector("a.details-btn");
            if (link) href = link.getAttribute("href");
        }
        if (!href) return;
        card.addEventListener("click", function (e) {
            if (e.target.closest("a, button, form, input")) return;
            window.location.href = href;
        });
    });

    /* ---------- SCROLL REVEAL ---------- */
    var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (revealEls.length) {
        if ("IntersectionObserver" in window && !reduced) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        e.target.classList.add("in-view");
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.12 });
            revealEls.forEach(function (el) { io.observe(el); });
        } else {
            revealEls.forEach(function (el) { el.classList.add("in-view"); });
        }
    }
})();