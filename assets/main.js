/* khalidin.com · v3 · interactions, scroll story, analytics console, language switch */

document.documentElement.classList.add("js");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = t => 1 - Math.pow(1 - t, 3);
const fmt = n => Math.round(n).toLocaleString("en-US");

/* =========================================================
   Language
   ========================================================= */
const EN = {
  "brand": "Khalid", "lang": "عربي",
  "nav.analytics": "Analytics", "nav.cia": "CIA", "nav.credentials": "Credentials",
  "nav.cycles": "Expertise", "nav.experience": "Experience", "nav.contact": "Contact",
  "hud.pop": "Population", "hud.tested": "Tested", "hud.exc": "Exceptions",
  "hero.kicker": "Senior Internal Auditor · Riyadh",
  "hero.name": "Khalid.",
  "hero.thesis": 'I audit the whole population,<br><span class="amber-text">not just the sample.</span>',
  "hero.sub": "Risk-based internal audit, powered by data analytics and automation.",
  "hero.cta": "See how I work", "hero.cta2": "Get in touch",
  "s1.k": "01 · Full-population testing", "s1.t": "Every transaction. Tested.",
  "s1.d": "Instead of sampling 25 entries, I test all of them with rules written once. Exceptions surface on their own.",
  "s2.k": "02 · Benford's law", "s2.t": "Numbers say what people don't.",
  "s2.d": "In natural data, about 30% of amounts start with a 1. When a ledger drifts from that curve, it earns a question.",
  "s3.k": "03 · Assurance", "s3.t": "From data, to confidence.",
  "s3.d": "The result is an opinion built on evidence, and a management team that knows exactly where it stands.",
  "a.k": "Automation & data analytics",
  "a.t": 'Write the test once.<br><span class="dim">Run it on every transaction.</span>',
  "a.s": "I turn repetitive audit procedures into automated tests in Python and SQL that run directly on system data and hand over exceptions ready for follow-up.",
  "t1": "Duplicate payments", "t2": "Benford analysis", "t3": "Three-way match", "t4": "Segregation of duties",
  "c.run": "Running", "c.scanned": "Records scanned", "c.exceptions": "Exceptions", "c.coverage": "Coverage",
  "c.note": "Illustrative data to show the method",
  "pl1": "Extract", "pl2": "Transform", "pl3": "Test", "pl3d": "Rules engine · YAML", "pl4": "Report",
  "b.h": "Tools I've built",
  "b1": "A procure-to-pay rules engine with 34 test rules written in YAML and easy to extend.", "b1s": "rules",
  "b2t": "Audit automation app", "b2": "An interactive app that loads ERP data, runs the tests and shows exceptions in minutes instead of days.", "b2s": "to report",
  "b3": "Planning, workpapers and sample selection in one file. Fill in the key inputs and the rest builds itself.", "b3s": "file per engagement",
  "b4t": "CIA exam simulator", "b4": "125 questions that mirror the real exam, with instant scoring, explanations, and bilingual study guides.", "b4s": "questions",
  "j.t": 'The road to <span class="amber-text">CIA</span>.',
  "j.s": "The world's leading internal audit certification, from The Institute of Internal Auditors. Three parts, one step at a time.",
  "j.ring": "parts completed",
  "j.p1": "Essentials of Internal Auditing", "j.p1s": "أساسيات التدقيق الداخلي",
  "j.p2": "Practice of Internal Auditing", "j.p2s": "ممارسة التدقيق الداخلي",
  "j.p3": "Business Knowledge for Internal Auditing", "j.p3s": "المعرفة التجارية للتدقيق الداخلي",
  "st.progress": "In preparation", "st.done": "Completed", "st.next": "Up next",
  "c.k": "Certifications & memberships",
  "c.t": 'Certified knowledge,<br><span class="dim">across every corner of GRC.</span>',
  "l.code": "Code", "l.name": "Credential", "l.issuer": "Issuer", "l.member": "Member",
  "cr1": "GRC Professional", "cr2": "GRC Audit", "cr3": "Integrated Risk Management Professional",
  "cr4": "Integrated Policy Management Professional", "cr5": "Integrated Audit & Assurance Professional",
  "cr6": "Member, The Institute of Internal Auditors", "cr7": "Member, Saudi Organization for Chartered and Professional Accountants",
  "cy.k": "Business cycles", "cy.t": "Where I make a difference.",
  "cy1": "Procure to Pay", "cy1d": "Every riyal spent with clear authority and sound documents.",
  "cy1c": "<li>Three-way match</li><li>Vendor master</li><li>PO splitting</li>",
  "cy2": "Sales & Marketing", "cy2d": "Revenue protected from leakage, from pricing to collection.",
  "cy2c": "<li>Credit limits</li><li>Discounts</li><li>Receivables ageing</li>",
  "cy3": "HR & Payroll", "cy3d": "Fairness by the numbers, from hire to exit.",
  "cy3c": "<li>Ghost employees</li><li>System access</li><li>Payroll reconciliations</li>",
  "cy4": "Health, Safety & Environment", "cy4d": "Controls that protect people first, then the facility and the reputation.",
  "cy4c": "<li>Incident reporting</li><li>Permits to work</li><li>Environmental compliance</li>",
  "wp.ref": "W/P ref", "wp.prep": "Prepared by", "wp.rev": "Status", "wp.ok": "Reviewed",
  "x.t": "A career built with intent.", "x.now": "Current",
  "x1n": "Alkhorayef Group", "x1r": "Senior Internal Auditor · Shared Services, Riyadh",
  "x1d": "Risk-based audit engagements across group companies, covering procurement, sales, HR and HSE, using Oracle EBS data.",
  "x2n": "MHR Holding Company", "x2r": "Internal Audit",
  "x2d": "Procure-to-pay and sales cycle audits on Odoo data, and an audit automation tool built in Python and Streamlit.",
  "x3n": "Golden Fingers Veterinary Clinic", "x3r": "Internal Auditor",
  "x4n": "Yanbu United Company (YUNIGREEN)", "x4r": "Associate Internal Auditor · Yanbu", "x4d": "Where the story began.",
  "ct.k": "Sign-off", "ct.t": 'Let\'s start the next<br><span class="amber-text">engagement.</span>',
  "ct.s": "For opportunities and collaboration, or to talk data-driven audit and the road to CIA.",
  "ct.email": "Email", "ct.prep": "Prepared by Khalid · Riyadh",
  "footer": "© 2026 Khalid. Riyadh, Saudi Arabia."
};
const UI = {
  ar: { running: "يعمل", done: "اكتمل", title: "خالد | مدقق داخلي أول" },
  en: { running: "Running", done: "Complete", title: "Khalid | Senior Internal Auditor" }
};
const i18nEls = $$("[data-i18n]");
i18nEls.forEach(el => { el.dataset.ar = el.innerHTML; });
const metaDesc = $('meta[name="description"]');
const descAr = metaDesc ? metaDesc.content : "";
let lang = "ar";

function setLang(l, save) {
  lang = l === "en" ? "en" : "ar";
  const en = lang === "en";
  document.documentElement.lang = lang;
  document.documentElement.dir = en ? "ltr" : "rtl";
  i18nEls.forEach(el => { el.innerHTML = en ? (EN[el.dataset.i18n] ?? el.dataset.ar) : el.dataset.ar; });
  document.title = UI[lang].title;
  if (metaDesc) metaDesc.content = en ? "Khalid, Senior Internal Auditor. Risk-based audit powered by data analytics and automation, and the road to the CIA." : descAr;
  S.rtl = !en;
  updateRunLabel();
  if (save) { try { localStorage.setItem("lang", lang); } catch (e) {} }
  onScroll();
}

/* =========================================================
   Shared stage state (read by the 3D scene)
   ========================================================= */
const S = window.__stage = { seg: 0, p: 0, rtl: true, mx: 0, my: 0, visible: true, scanT: 0, flagCount: 0, populationScale: 1 };

/* =========================================================
   Nav
   ========================================================= */
const nav = $("#nav"), toggle = $("#navToggle"), links = $("#navLinks");
toggle.addEventListener("click", () => { const o = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", o); });
$$("a", links).forEach(a => a.addEventListener("click", () => { links.classList.remove("open"); toggle.setAttribute("aria-expanded", false); }));
$("#langBtn").addEventListener("click", () => {
  document.body.classList.add("lang-swap");
  setTimeout(() => { setLang(lang === "en" ? "ar" : "en", true); document.body.classList.remove("lang-swap"); }, 180);
});
$$("[data-link]").forEach(a => { if (!a.getAttribute("href")) a.hidden = true; });
$("#year").textContent = new Date().getFullYear();

/* =========================================================
   Stage: scroll story + audit HUD
   ========================================================= */
const stage = $(".stage");
const layers = $$(".layer");
const prog = $$(".stage-progress i");
const STEPS = 3;
const hudTested = $("#hudTested"), hudExc = $("#hudExc"), hudBar = $("#hudBar");
const POP = 12480;

function updateStage() {
  const r = stage.getBoundingClientRect();
  const span = r.height - innerHeight;
  const p = clamp(-r.top / span);
  const seg = p * STEPS;
  S.p = p; S.seg = seg; S.visible = r.bottom > 0;
  layers.forEach(l => {
    const i = +l.dataset.layer, d = seg - i;
    let o = clamp((0.42 - Math.abs(d)) / 0.2);
    if (i === 0 && d < 0) o = 1;
    if (i === STEPS && d > 0) o = 1;
    l.style.opacity = o;
    l.style.transform = `translateY(${(-d * 50).toFixed(1)}px)`;
    l.classList.toggle("live", o > 0.6);
  });
  prog.forEach((el, i) => el.classList.toggle("on", i === Math.round(seg)));

  // HUD: tested grows as the scan beam passes
  const scan = S.scanT || clamp((seg - 0.82) / 0.55);
  const tested = seg > 1.4 ? 1 : scan;
  const exc = (S.flagCount ? S.flagCount * S.populationScale : 150) * tested;
  hudTested.textContent = fmt(POP * tested);
  hudExc.textContent = fmt(exc);
  hudBar.style.width = tested * 100 + "%";
}

/* Benford digit labels, positioned by the 3D scene */
const axis = $("#benfordAxis");
for (let d = 1; d <= 9; d++) { const s = document.createElement("span"); s.textContent = d; if (d === 6) s.className = "hot"; axis.appendChild(s); }
const axisEls = $$("span", axis);
S.onBenford = (pts, w) => {
  axis.style.opacity = w;
  if (!pts) return;
  pts.forEach((pt, i) => { axisEls[i].style.left = pt[0] + "px"; axisEls[i].style.top = pt[1] + "px"; });
};

/* =========================================================
   Scroll-linked bits
   ========================================================= */
const tl = $("#tl"), tlFill = $("#tlFill");
function onScroll() {
  updateStage();
  nav.classList.toggle("scrolled", scrollY > 10);
  if (tl) {
    const r = tl.getBoundingClientRect();
    tlFill.style.height = clamp((innerHeight * 0.7 - r.top) / r.height) * 100 + "%";
  }
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
addEventListener("pointermove", e => { S.mx = (e.clientX / innerWidth) * 2 - 1; S.my = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });

/* =========================================================
   Analytics console
   ========================================================= */
const TESTS = {
  dup: {
    file: "tests/duplicate_payments.py", scanned: 48210, exc: 23,
    code:
`import pandas as pd

ap = pd.read_csv("ap_invoices.csv")
# normalise invoice numbers: "INV-88317A" -> "88317"
ap["inv_key"] = ap.invoice_no.str.replace(r"\\D", "", regex=True)

dupes = ap[ap.duplicated(["vendor_id", "inv_key", "amount"], keep=False)]
print(len(dupes), "suspected duplicate payments")`,
    viz: () => table(["Vendor", "Invoice", "Date", "Amount (SAR)"], [
      ["V-1042", "INV-88317", "2025-03-14", "184,500.00", 1],
      ["V-1042", "INV-88317A", "2025-03-14", "184,500.00", 1],
      ["V-2210", "INV-55102", "2025-04-02", "12,940.00"],
      ["V-0877", "INV-70411", "2025-04-09", "3,215.50"],
      ["V-1563", "INV-90233", "2025-05-21", "61,000.00", 1],
      ["V-1563", "90233", "2025-05-21", "61,000.00", 1]
    ], [3])
  },
  benford: {
    file: "tests/benford_first_digit.py", scanned: 126904, exc: 1388,
    code:
`import numpy as np

digits = df.amount.astype(str).str.lstrip("0.").str[0].astype(int)
observed = digits.value_counts(normalize=True).sort_index()
expected = np.log10(1 + 1 / np.arange(1, 10))

mad = np.mean(np.abs(observed - expected))
# MAD above 0.015 = nonconformity (Nigrini): drill into digit 6`,
    viz: benfordViz
  },
  match: {
    file: "tests/three_way_match.sql", scanned: 9372, exc: 41,
    code:
`SELECT po.po_no, po.qty_ordered, grn.qty_received, inv.qty_billed
FROM   purchase_orders po
JOIN   goods_receipts  grn ON grn.po_no = po.po_no
JOIN   ap_invoices     inv ON inv.po_no = po.po_no
WHERE  inv.qty_billed > grn.qty_received
   OR  inv.unit_price > po.unit_price * 1.02;`,
    viz: () => table(["PO", "Ordered", "Received", "Billed"], [
      ["PO-24117", "500", "500", "500"],
      ["PO-24151", "120", "96", "120", 1],
      ["PO-24188", "40", "40", "40"],
      ["PO-24203", "1,000", "1,000", "1,000"],
      ["PO-24236", "75", "60", "75", 1]
    ], [1, 2, 3])
  },
  sod: {
    file: "tests/segregation_of_duties.py", scanned: 1286, exc: 7,
    code:
`duties = access.pivot_table(index="user_id", columns="duty",
                            values="granted", aggfunc="max", fill_value=0)

# one person must not both create a vendor and approve its payment
conflicts = duties[(duties.create_vendor == 1) & (duties.approve_payment == 1)]
print(len(conflicts), "users with conflicting access")`,
    viz: sodViz
  }
};

function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function highlight(code) {
  const KW = /\b(import|from|as|print|len|SELECT|FROM|JOIN|ON|WHERE|OR|AND|True|False)\b/g;
  return code.split("\n").map(line => {
    const ci = line.search(/#|--/);
    let body = ci >= 0 ? line.slice(0, ci) : line, cm = ci >= 0 ? line.slice(ci) : "";
    const parts = body.split(/("[^"]*")/g).map((seg, i) => {
      if (i % 2) return `<span class="str">${esc(seg)}</span>`;
      return esc(seg).replace(KW, '<span class="kw">$1</span>').replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>');
    }).join("");
    return parts + (cm ? `<span class="cm">${esc(cm)}</span>` : "");
  }).join("\n");
}
function table(head, rows, right = []) {
  const th = head.map((h, i) => `<th class="${right.includes(i) ? "r" : ""}">${h}</th>`).join("");
  const tr = rows.map((r, k) => `<tr class="${r[4] ? "flag" : ""}" style="animation-delay:${k * 70}ms">${r.slice(0, 4).map((c, i) => `<td class="${right.includes(i) ? "r" : ""}">${c}</td>`).join("")}</tr>`).join("");
  return `<div class="viz-wrap"><table class="vt"><thead><tr>${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}
const EXP = Array.from({ length: 9 }, (_, i) => Math.log10(1 + 1 / (i + 1)));
const OBS = [.265, .160, .116, .092, .073, .125, .059, .058, .052];
function benfordViz() {
  const W = 560, H = 210, L = 34, B = 26, T = 10, cw = (W - L - 8) / 9, max = 0.32;
  const y = v => T + (H - T - B) * (1 - v / max);
  let s = `<svg class="bf" viewBox="0 0 ${W} ${H}" role="img" aria-label="Benford first digit: observed versus expected">`;
  [0, .1, .2, .3].forEach(g => { s += `<line class="grid" x1="${L}" x2="${W - 4}" y1="${y(g)}" y2="${y(g)}"/><text x="${L - 6}" y="${y(g) + 4}" text-anchor="end">${Math.round(g * 100)}%</text>`; });
  OBS.forEach((o, i) => {
    const x = L + i * cw + cw * 0.18, w = cw * 0.64, h = (H - T - B) * (o / max);
    s += `<rect class="bar${i === 5 ? " hot" : ""}" x="${x}" y="${y(o)}" width="${w}" height="${h}" rx="3"><animate attributeName="height" from="0" to="${h}" dur=".7s" begin="${i * .05}s" fill="freeze"/><animate attributeName="y" from="${y(0)}" to="${y(o)}" dur=".7s" begin="${i * .05}s" fill="freeze"/></rect>`;
    s += `<text x="${L + i * cw + cw / 2}" y="${H - 8}" text-anchor="middle">${i + 1}</text>`;
  });
  s += `<polyline class="exp" points="${EXP.map((e, i) => `${L + i * cw + cw / 2},${y(e)}`).join(" ")}"/>`;
  EXP.forEach((e, i) => { s += `<circle class="dotx" cx="${L + i * cw + cw / 2}" cy="${y(e)}" r="2.6"/>`; });
  s += `</svg>`;
  const mad = OBS.reduce((a, o, i) => a + Math.abs(o - EXP[i]), 0) / 9;
  s += `<div class="bf-legend"><span><i style="background:rgba(142,166,200,.55)"></i>Observed</span><span><i style="background:transparent;box-shadow:inset 0 0 0 1px currentColor"></i>Benford expected</span><span style="color:var(--amber)">MAD ${mad.toFixed(4)} · Nonconformity</span></div>`;
  return s;
}
function sodViz() {
  const duties = ["Create vendor", "Raise PO", "Approve payment", "Post to GL"];
  const users = [["U-104", [1, 0, 0, 0]], ["U-117", [1, 1, 1, 0], 1], ["U-133", [0, 1, 0, 1]], ["U-151", [0, 0, 1, 1]], ["U-162", [1, 0, 1, 0], 1]];
  let s = `<div class="sod"><div class="sod-row sod-h" style="animation-delay:0ms"><span></span>${duties.map(d => `<span>${d}</span>`).join("")}</div>`;
  users.forEach((u, k) => { s += `<div class="sod-row${u[2] ? " flag" : ""}" style="animation-delay:${(k + 1) * 80}ms"><span>${u[0]}</span>${u[1].map(v => `<span class="cell${v ? " on" : ""}"></span>`).join("")}</div>`; });
  return s + `</div>`;
}

const tabs = $$(".test"), pFile = $("#pFile"), pCode = $("#pCode"), pViz = $("#pViz"), pRun = $("#pRun");
const mScanned = $("#mScanned"), mExc = $("#mExc");
let current = "dup", runToken = 0, autoplay = true, autoTimer = null, consoleVisible = false, running = false;

function updateRunLabel() { const sp = $("span", pRun); if (sp) sp.textContent = running ? UI[lang].running : UI[lang].done; }
function countTo(el, to, dur = 1200) {
  if (reduce) { el.textContent = fmt(to); return; }
  let t0; const tok = runToken;
  const f = t => { if (tok !== runToken) return; t0 ??= t; const k = clamp((t - t0) / dur); el.textContent = fmt(to * ease(k)); if (k < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
function runTest(key) {
  current = key; const T = TESTS[key]; const tok = ++runToken;
  tabs.forEach(b => { const on = b.dataset.test === key; b.classList.toggle("on", on); b.setAttribute("aria-selected", on); b.style.removeProperty("--auto"); });
  pFile.textContent = T.file; pViz.innerHTML = ""; mScanned.textContent = "0"; mExc.textContent = "0";
  running = true; pRun.classList.remove("done"); updateRunLabel();
  const full = T.code;
  const finish = () => {
    if (tok !== runToken) return;
    pCode.innerHTML = highlight(full);
    countTo(mScanned, T.scanned); countTo(mExc, T.exc, 1400);
    setTimeout(() => { if (tok !== runToken) return; pViz.innerHTML = T.viz(); running = false; pRun.classList.add("done"); updateRunLabel(); scheduleAuto(); }, reduce ? 0 : 500);
  };
  if (reduce) return finish();
  let i = 0; const speed = Math.max(4, Math.round(full.length / 55));
  const type = () => {
    if (tok !== runToken) return;
    i = Math.min(full.length, i + speed);
    pCode.innerHTML = esc(full.slice(0, i)) + '<span class="caret"></span>';
    if (i < full.length) requestAnimationFrame(type); else finish();
  };
  type();
}
function scheduleAuto() {
  clearTimeout(autoTimer);
  if (!autoplay || reduce) return;
  const btn = tabs.find(b => b.dataset.test === current);
  const DUR = 6500; const start = performance.now(); const tok = runToken;
  const tick = now => {
    if (tok !== runToken || !autoplay) return;
    if (!consoleVisible) { requestAnimationFrame(tick); return; }
    const k = clamp((now - start) / DUR);
    btn.style.setProperty("--auto", k * 100 + "%");
    if (k < 1) requestAnimationFrame(tick);
    else { const keys = Object.keys(TESTS); runTest(keys[(keys.indexOf(current) + 1) % keys.length]); }
  };
  requestAnimationFrame(tick);
}
tabs.forEach(b => b.addEventListener("click", () => { autoplay = false; runTest(b.dataset.test); }));
tabs.forEach((b, i) => b.addEventListener("keydown", e => {
  const dirMul = document.documentElement.dir === "rtl" ? -1 : 1;
  let j = null;
  if (e.key === "ArrowDown" || e.key === (dirMul > 0 ? "ArrowRight" : "ArrowLeft")) j = (i + 1) % tabs.length;
  if (e.key === "ArrowUp" || e.key === (dirMul > 0 ? "ArrowLeft" : "ArrowRight")) j = (i - 1 + tabs.length) % tabs.length;
  if (j !== null) { e.preventDefault(); tabs[j].focus(); tabs[j].click(); }
}));

/* =========================================================
   CIA ring
   ========================================================= */
const parts = $$("#parts .part");
const done = parts.filter(p => p.dataset.status === "done").length;
const ring = $("#ringFill"), CIRC = 2 * Math.PI * 100;
ring.style.strokeDasharray = CIRC; ring.style.strokeDashoffset = CIRC;
function playRing() {
  ring.style.strokeDashoffset = CIRC * (1 - done / parts.length);
  const el = $("#partsDone");
  if (reduce) { el.textContent = done; return; }
  let t0; const f = t => { t0 ??= t; const k = clamp((t - t0) / 1400); el.textContent = Math.round(done * ease(k)); if (k < 1) requestAnimationFrame(f); };
  requestAnimationFrame(f);
}

/* =========================================================
   Reveal + one-shot triggers
   ========================================================= */
if ("IntersectionObserver" in window && !reduce) {
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const sib = Array.from(el.parentElement.children).filter(c => c.classList.contains("reveal"));
    el.style.transitionDelay = Math.max(0, sib.indexOf(el)) * 80 + "ms";
    el.classList.add("in");
    setTimeout(() => { el.style.transitionDelay = ""; }, 1500);
    io.unobserve(el);
  }), { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const once = new IntersectionObserver(entries => entries.forEach(en => {
    if (!en.isIntersecting) return;
    if (en.target.classList.contains("ring-box")) playRing();
    once.unobserve(en.target);
  }), { threshold: 0.35 });
  once.observe($(".ring-box"));

  let started = false;
  new IntersectionObserver(entries => entries.forEach(en => {
    consoleVisible = en.isIntersecting;
    if (en.isIntersecting && !started) { started = true; runTest("dup"); }
  }), { threshold: 0.25 }).observe($("#console"));
} else {
  $$(".reveal").forEach(el => el.classList.add("in"));
  playRing();
  runTest("dup");
}

/* =========================================================
   Boot
   ========================================================= */
let startLang = "ar";
try {
  const q = new URLSearchParams(location.search).get("lang");
  const saved = localStorage.getItem("lang");
  if (q === "en" || q === "ar") startLang = q;
  else if (saved === "en" || saved === "ar") startLang = saved;
  else if (!/^ar/i.test(navigator.language || "")) startLang = "en";
} catch (e) {}
setLang(startLang, false);
onScroll();

/* =========================================================
   3D stage
   ========================================================= */
(async () => {
  const canvas = $("#gl");
  const ok = (() => { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { return false; } })();
  if (!ok) { document.documentElement.classList.add("no-gl"); return; }
  try {
    const { startScene } = await import("./scene.js");
    startScene(canvas, S, { reduce });
  } catch (err) {
    console.warn("3D stage unavailable", err);
    document.documentElement.classList.add("no-gl");
  }
})();
