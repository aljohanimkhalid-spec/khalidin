(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year ---------- */
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Contact links: hide any button without a link ---------- */
  document.querySelectorAll("[data-link]").forEach(function (a) {
    if (!a.getAttribute("href")) a.style.display = "none";
  });

  /* ---------- Nav: scrolled state, dark sections, mobile menu ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var darkSections = Array.prototype.slice.call(document.querySelectorAll(".dark"));

  function onScroll() {
    var s = window.scrollY;
    nav.classList.toggle("scrolled", s > 8);
    var probe = 26;
    var onDark = darkSections.some(function (sec) {
      var r = sec.getBoundingClientRect();
      return r.top <= probe && r.bottom >= probe;
    });
    nav.classList.toggle("on-dark", onDark);
    updateStatement();
  }

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- Statement: words light up as you scroll ---------- */
  var st = document.getElementById("statement");
  var words = [];
  if (st) {
    var parts = st.textContent.trim().split(/\s+/);
    st.innerHTML = parts.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    words = Array.prototype.slice.call(st.querySelectorAll(".w"));
  }
  function updateStatement() {
    if (!st || reduce) return;
    var r = st.getBoundingClientRect();
    var vh = window.innerHeight;
    var start = vh * 0.85, end = vh * 0.35;
    var p = (start - r.top) / (start - end + r.height * 0.5);
    p = Math.max(0, Math.min(1, p));
    var lit = Math.round(p * words.length);
    words.forEach(function (w, i) { w.classList.toggle("on", i < lit); });
  }

  /* ---------- Journey ring ---------- */
  var partEls = document.querySelectorAll("#parts .part");
  var done = 0;
  partEls.forEach(function (p) { if (p.dataset.status === "done") done++; });
  var ring = document.getElementById("ringFg");
  var CIRC = 2 * Math.PI * 92;
  if (ring) { ring.style.strokeDasharray = CIRC; ring.style.strokeDashoffset = CIRC; }

  function playRing() {
    if (ring) ring.style.strokeDashoffset = CIRC * (1 - done / partEls.length);
    countTo(document.getElementById("partsDone"), done, 1200);
  }

  /* ---------- Counters ---------- */
  function countTo(el, to, dur) {
    if (!el) return;
    if (reduce) { el.textContent = to; return; }
    var t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(to * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Reveal on scroll ---------- */
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        var siblings = el.parentElement ? el.parentElement.querySelectorAll(":scope > .reveal") : [];
        var idx = Array.prototype.indexOf.call(siblings, el);
        el.style.transitionDelay = Math.max(0, idx) * 80 + "ms";
        el.classList.add("in");
        setTimeout(function () { el.style.transitionDelay = ""; }, 1200);
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    var once = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.classList.contains("ring-card")) playRing();
        if (el.classList.contains("count")) countTo(el, parseInt(el.dataset.to, 10), 1400);
        if (el.classList.contains("mock-flow")) el.classList.add("play");
        once.unobserve(el);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll(".ring-card, .count, .mock-flow").forEach(function (el) { once.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    document.querySelectorAll(".count").forEach(function (el) { el.textContent = el.dataset.to; });
    playRing();
    words.forEach(function (w) { w.classList.add("on"); });
  }

  /* ---------- Card spotlight follows the cursor ---------- */
  document.querySelectorAll(".spot").forEach(function (c) {
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
