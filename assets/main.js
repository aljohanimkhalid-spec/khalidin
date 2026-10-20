/* khalidin.com | interactions, scroll story, language switch */

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ================= Language ================= */
const EN = {
  "brand": 'Khalid<span class="dot">.</span>',
  "lang": "عربي",
  "nav.journey": "Journey", "nav.certs": "Certifications", "nav.expertise": "Expertise",
  "nav.experience": "Experience", "nav.projects": "Projects", "nav.contact": "Contact",
  "hero.eyebrow": "Senior Internal Auditor",
  "hero.title": 'Khalid<span class="dot">.</span>',
  "hero.tag": "Assurance. Elevated.",
  "hero.sub": "Risk-based auditing that gives organizations the confidence to move faster.",
  "hero.cta": "Get in touch",
  "hero.link": "Follow the journey ›",
  "hero.scroll": "Scroll",
  "s1.k": "Governance", "s1.t": "Clarity in every decision.",
  "s2.k": "Risk", "s2.t": "Seeing what others might miss.",
  "s3.k": "Compliance", "s3.t": "Rules respected. Always.",
  "s4.k": "GRC", "s4.t": "Three rings. One integrated view.",
  "j.title": 'The road to <span class="grad-text">CIA</span>.',
  "j.sub": "The world’s leading internal audit certification, from The Institute of Internal Auditors. Three parts, one step at a time.",
  "j.ring": "parts completed",
  "j.p1": "Essentials of Internal Auditing", "j.p1s": "أساسيات التدقيق الداخلي",
  "j.p2": "Practice of Internal Auditing", "j.p2s": "ممارسة التدقيق الداخلي",
  "j.p3": "Business Knowledge for Internal Auditing", "j.p3s": "المعرفة التجارية للتدقيق الداخلي",
  "st.progress": "In preparation", "st.done": "Completed", "st.next": "Up next",
  "n1": "GRC certifications", "n2": "Professional memberships", "n3": "Business cycles I audit", "n4": "Questions in my CIA simulator",
  "c.eyebrow": "Certifications",
  "c.title": 'Certified knowledge.<br><span class="muted">Across every corner of GRC.</span>',
  "c.hint": "Hover or tap a card to flip it",
  "c1": "GRC Professional", "c1s": "محترف الحوكمة والمخاطر والامتثال",
  "c2": "GRC Audit", "c2s": "مدقق الحوكمة والمخاطر والامتثال",
  "c3": "Integrated Risk Management Professional", "c3s": "محترف إدارة المخاطر المتكاملة",
  "c4": "Integrated Policy Management Professional", "c4s": "محترف إدارة السياسات المتكاملة",
  "c5": "Integrated Audit & Assurance Professional", "c5s": "محترف التدقيق والتأكيد المتكامل",
  "c.members": "Professional memberships",
  "c.iia": "The Institute of Internal Auditors",
  "c.socpa": "Saudi Organization for Chartered and Professional Accountants",
  "e.eyebrow": "Areas of expertise", "e.title": "Where I make a difference.",
  "e1.k": "Procure to Pay", "e1.t": "Every riyal, controlled.", "e1.d": "From requisition to payment, I verify that spending follows clear authority and sound documentation.",
  "e2.k": "Sales & Marketing", "e2.t": "Revenue, protected.", "e2.d": "Pricing, discounts and collections, under controls that catch gaps before they cost.",
  "e3.k": "HR & Payroll", "e3.t": "Fairness, by the numbers.", "e3.d": "Payroll accuracy, system access and process integrity, from hire to exit.",
  "e4.k": "Health, Safety & Environment", "e4.t": "People first.", "e4.d": "Controls that protect lives first, then the facility, the reputation and the world around it.",
  "x.eyebrow": "Experience", "x.title": "A career built with intent.", "x.now": "Current",
  "x1.n": "Alkhorayef Group", "x1.r": "Senior Internal Auditor · Shared Services, Riyadh",
  "x1.d": "Risk-based audit engagements across group companies, covering procurement, sales, HR and HSE.",
  "x2.n": "MHR Holding Company", "x2.r": "Internal Audit",
  "x3.n": "Golden Fingers Veterinary Clinic", "x3.r": "Internal Auditor",
  "x4.n": "Yanbu United Company (YUNIGREEN)", "x4.r": "Associate Internal Auditor · Yanbu", "x4.d": "Where the story began.",
  "p.eyebrow": "What I build", "p.title": 'Tools that turn knowledge<br><span class="muted">into action.</span>',
  "q.count": "Question 37 of 125",
  "q.q": "What is the primary purpose of risk assessment when planning an engagement?",
  "q.a": "Set scope by materiality", "q.b": "Direct resources to the highest risks", "q.c": "Reduce sample sizes", "q.next": "Next", "q.ok": "Correct", "q.why": "Risk assessment focuses the engagement plan on what matters most.",
  "p1.t": "CIA Exam Simulator", "p1.d": "125 questions that mirror the real exam, with instant scoring and an explanation for every answer.",
  "p2.t": "Bilingual Study Guides", "p2.d": "Arabic and English explanations side by side, plus cards for fraud concepts and discrimination rules.",
  "p3.d": "A personal project that brings planning, sampling and testing into one place.",
  "f1": "Planning", "f2": "Sampling", "f3": "Testing", "f4": "Reporting",
  "ct.title": 'Let’s build assurance<br><span class="grad-text">that matters.</span>',
  "ct.sub": "For opportunities and collaboration, or to talk audit and the road to CIA.",
  "ct.email": "Email",
  "footer": "© 2026 Khalid. Riyadh, Saudi Arabia."
};
const META = {
  ar: { title: "خالد | مدقق داخلي أول", desc: document.querySelector('meta[name="description"]').content },
  en: { title: "Khalid | Senior Internal Auditor", desc: "Khalid, Senior Internal Auditor specializing in risk-based auditing, governance and compliance, and his road to the CIA." }
};

const i18nEls = $$("[data-i18n]");
i18nEls.forEach(el => { el.dataset.ar = el.innerHTML; });

function setLang(lang, save) {
  const isEn = lang === "en";
  document.documentElement.lang = isEn ? "en" : "ar";
  document.documentElement.dir = isEn ? "ltr" : "rtl";
  i18nEls.forEach(el => {
    const k = el.dataset.i18n;
    el.innerHTML = isEn ? (EN[k] ?? el.dataset.ar) : el.dataset.ar;
  });
  document.title = META[isEn ? "en" : "ar"].title;
  $('meta[name="description"]').content = META[isEn ? "en" : "ar"].desc;
  window.__stage && (window.__stage.rtl = !isEn);
  if (save) { try { localStorage.setItem("lang", lang); } catch (e) {} }
  onScroll();
}

let startLang = "ar";
try {
  const q = new URLSearchParams(location.search).get("lang");
  const saved = localStorage.getItem("lang");
  if (q === "en" || q === "ar") startLang = q;
  else if (saved) startLang = saved;
  else if (!/^ar/i.test(navigator.language || "")) startLang = "en";
} catch (e) {}

$("#langBtn").addEventListener("click", () => {
  document.body.classList.add("lang-swap");
  setTimeout(() => {
    setLang(document.documentElement.lang === "en" ? "ar" : "en", true);
    document.body.classList.remove("lang-swap");
  }, 180);
});

/* ================= Contact links: hide empty ================= */
$$("[data-link]").forEach(a => { if (!a.getAttribute("href")) a.style.display = "none"; });

/* ================= Nav ================= */
const nav = $("#nav"), toggle = $("#navToggle"), links = $("#navLinks");
toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
$$("a", links).forEach(a => a.addEventListener("click", () => { links.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }));
const lightSections = $$(".light, .white, .footer");

/* ================= Stage (scroll story) ================= */
const stage = $(".stage");
const layers = $$(".layer");
const dots = $$(".stage-dots i");
const LAYERS = 4;
window.__stage = { seg: 0, p: 0, rtl: true, mx: 0, my: 0, visible: true };

function updateStage() {
  const r = stage.getBoundingClientRect();
  const span = r.height - innerHeight;
  const p = clamp(-r.top / span);
  const seg = p * LAYERS;
  window.__stage.p = p;
  window.__stage.seg = seg;
  window.__stage.visible = r.bottom > 0;
  layers.forEach(l => {
    const d = seg - Number(l.dataset.layer);
    let o = clamp((0.5 - Math.abs(d)) / 0.22);
    if (l.dataset.layer === "0" && d < 0) o = 1;
    if (l.dataset.layer === String(LAYERS) && d > 0) o = 1;
    l.style.opacity = o;
    l.style.transform = `translateY(${(-d * 60).toFixed(1)}px) scale(${(1 - Math.abs(d) * 0.04).toFixed(3)})`;
    l.classList.toggle("live", o > 0.6);
  });
  const idx = Math.round(seg);
  dots.forEach((d, i) => d.classList.toggle("on", i === idx));
}

/* ================= Scroll-linked bits ================= */
const tl = $("#timeline"), tFill = $("#tFill");
const device = $("#device"), devStage = $("#deviceStage");
const ease = t => 1 - Math.pow(1 - t, 3);

function onScroll() {
  updateStage();
  // nav theme
  const probe = 24;
  const onLight = lightSections.some(s => { const r = s.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; });
  nav.classList.toggle("on-light", onLight);
  // timeline fill
  if (tl) {
    const r = tl.getBoundingClientRect();
    tFill.style.height = (clamp((innerHeight * 0.65 - r.top) / r.height) * 100) + "%";
  }
  // device straightens as it scrolls in
  if (device && !reduce) {
    const r = devStage.getBoundingClientRect();
    const t = ease(clamp((innerHeight - r.top) / (innerHeight * 0.95)));
    const s = document.documentElement.dir === "rtl" ? 1 : -1;
    device.style.setProperty("--rx", (26 - 20 * t).toFixed(2) + "deg");
    device.style.setProperty("--ry", (s * (-34 + 22 * t)).toFixed(2) + "deg");
    device.style.setProperty("--rz", (s * 7 * (1 - t)).toFixed(2) + "deg");
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);

/* ================= Pointer: 3D tilt + parallax ================= */
addEventListener("pointermove", e => {
  window.__stage.mx = (e.clientX / innerWidth) * 2 - 1;
  window.__stage.my = (e.clientY / innerHeight) * 2 - 1;
}, { passive: true });

if (finePointer && !reduce) {
  $$(".tilt").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.transform = `rotateX(${((0.5 - y) * 10).toFixed(2)}deg) rotateY(${((x - 0.5) * 12).toFixed(2)}deg) translateZ(0)`;
      el.style.setProperty("--gx", x * 100 + "%");
      el.style.setProperty("--gy", y * 100 + "%");
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

/* ================= Flip cards (tap) ================= */
$$(".flip").forEach(f => f.addEventListener("click", () => f.classList.toggle("flipped")));

/* ================= Carousel ================= */
const car = $("#carousel");
const step = () => (car.querySelector(".ex-card")?.offsetWidth || 360) + 20;
$("#carPrev").addEventListener("click", () => car.scrollBy({ left: -step(), behavior: "smooth" }));
$("#carNext").addEventListener("click", () => car.scrollBy({ left: step(), behavior: "smooth" }));

/* ================= Journey ring + counters ================= */
const parts = $$("#parts .part");
const done = parts.filter(p => p.dataset.status === "done").length;
const ring = $("#ringFg");
const CIRC = 2 * Math.PI * 92;
ring.style.strokeDasharray = CIRC;
ring.style.strokeDashoffset = CIRC;

function countTo(el, to, dur = 1400) {
  if (reduce) { el.textContent = to; return; }
  let t0;
  const f = t => {
    t0 ??= t;
    const k = clamp((t - t0) / dur);
    el.textContent = Math.round(to * ease(k));
    if (k < 1) requestAnimationFrame(f);
  };
  requestAnimationFrame(f);
}

/* ================= Reveal ================= */
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const sib = Array.from(el.parentElement.children).filter(c => c.classList.contains("reveal"));
    el.style.transitionDelay = Math.max(0, sib.indexOf(el)) * 90 + "ms";
    el.classList.add("in");
    setTimeout(() => { el.style.transitionDelay = ""; }, 1400);
    io.unobserve(el);
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const once = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    if (el.classList.contains("ring-card")) {
      ring.style.strokeDashoffset = CIRC * (1 - done / parts.length);
      countTo($("#partsDone"), done, 1300);
    }
    if (el.classList.contains("count")) countTo(el, +el.dataset.to);
    once.unobserve(el);
  }), { threshold: 0.4 });
  $$(".ring-card, .count").forEach(el => once.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("in"));
  $$(".count").forEach(el => (el.textContent = el.dataset.to));
  ring.style.strokeDashoffset = CIRC * (1 - done / parts.length);
  $("#partsDone").textContent = done;
}

/* ================= Boot ================= */
setLang(startLang, false);
onScroll();

/* ================= 3D scene ================= */
(async () => {
  const canvas = $("#gl");
  const ok = (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } })();
  if (!ok) { document.documentElement.classList.add("no-gl"); return; }
  try {
    const { startScene } = await import("./scene.js");
    startScene(canvas, window.__stage, reduce);
  } catch (err) {
    console.warn("3D scene unavailable", err);
    document.documentElement.classList.add("no-gl");
  }
})();
