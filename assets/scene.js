/* khalidin.com · v3 · "Live audit"
   Thousands of transactions (points) morph through four states as you scroll:
   0 population (a spiral cloud) · 1 ledger, swept by a scan beam that flags exceptions
   2 Benford's first-digit distribution as 3D bars · 3 assurance sphere with exceptions in orbit */
import * as THREE from "three";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/* deterministic RNG so the exception count is stable */
function rng(seed) { return () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296); }
function gauss(r) { let u = 0, v = 0; while (!u) u = r(); while (!v) v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }

export const POPULATION = 12480;
export const BENFORD = Array.from({ length: 9 }, (_, i) => Math.log10(1 + 1 / (i + 1)));

export function startScene(canvas, S, opts = {}) {
  const reduce = !!opts.reduce;
  const mobile = Math.min(innerWidth, innerHeight) < 700;
  const N = mobile ? 6240 : POPULATION;
  const FLAG_RATE = 0.012;
  const r = rng(20261021);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 11);

  /* ---------- build the four layouts ---------- */
  const P0 = new Float32Array(N * 3), P1 = new Float32Array(N * 3), P2 = new Float32Array(N * 3), P3 = new Float32Array(N * 3);
  const FL = new Float32Array(N), RD = new Float32Array(N);
  const flags = [];
  for (let i = 0; i < N; i++) { RD[i] = r(); if (r() < FLAG_RATE) { FL[i] = 1; flags.push(i); } }
  const normal = []; for (let i = 0; i < N; i++) if (!FL[i]) normal.push(i);

  // 0 · population: three-arm spiral, tilted toward the viewer
  const tilt0 = 1.05, c0 = Math.cos(tilt0), s0 = Math.sin(tilt0);
  for (let i = 0; i < N; i++) {
    let x, y, z;
    if (r() < 0.16) { // central bulge
      x = gauss(r) * 0.5; z = gauss(r) * 0.5; y = gauss(r) * 0.32;
    } else {
      const rad = 0.3 + Math.pow(r(), 1.1) * 4.1;
      const arm = Math.floor(r() * 3);
      const ang = arm * (Math.PI * 2 / 3) + rad * 1.05 + gauss(r) * (0.18 + rad * 0.05);
      x = Math.cos(ang) * rad; z = Math.sin(ang) * rad;
      y = gauss(r) * 0.14 * (1.2 - rad / 5);
    }
    P0[i * 3] = x; P0[i * 3 + 1] = y * c0 - z * s0; P0[i * 3 + 2] = y * s0 + z * c0;
  }

  // 1 · ledger: a tilted spreadsheet, columns grouped into fields
  const COLS = mobile ? 80 : 160, ROWS = Math.ceil(N / COLS);
  const sp = mobile ? 0.058 : 0.056;
  const fieldGap = sp * 1.6, perField = 20;
  const ledgerW = COLS * sp + Math.floor((COLS - 1) / perField) * fieldGap;
  const ledgerH = ROWS * sp;
  const tilt1 = -0.42, c1 = Math.cos(tilt1), s1 = Math.sin(tilt1);
  const order = Array.from({ length: N }, (_, i) => i).sort(() => r() - 0.5);
  order.forEach((idx, k) => {
    const col = k % COLS, row = Math.floor(k / COLS);
    const x = col * sp + Math.floor(col / perField) * fieldGap - ledgerW / 2;
    const y = ledgerH / 2 - row * sp;
    P1[idx * 3] = x; P1[idx * 3 + 1] = y * c1; P1[idx * 3 + 2] = y * s1;
  });

  // 2 · Benford bars: 3D blocks, bar height follows log10(1 + 1/d); exceptions spike digit 6
  const BAR_GAP = mobile ? 0.5 : 0.95, BW = mobile ? 0.36 : 0.62;
  const BC = mobile ? 7 : 12, BD = mobile ? 4 : 6;
  const bsx = BW / (BC - 1), bsz = 0.55 / (BD - 1);
  const perLayer = BC * BD;
  const maxRows = Math.ceil((normal.length * BENFORD[0]) / perLayer);
  const bsy = 3.4 / maxRows, base = -2.2;
  const barX = d => (d - 5) * BAR_GAP;
  let cursor = 0;
  const fillBar = (d, list, startRow) => {
    list.forEach((idx, k) => {
      const kk = k + startRow * perLayer;
      const cx = kk % BC, cz = Math.floor(kk / BC) % BD, cy = Math.floor(kk / perLayer);
      P2[idx * 3] = barX(d) - BW / 2 + cx * bsx + (r() - 0.5) * bsx * 0.5;
      P2[idx * 3 + 1] = base + cy * bsy + (r() - 0.5) * bsy * 0.4;
      P2[idx * 3 + 2] = -0.27 + cz * bsz + (r() - 0.5) * bsz * 0.5;
    });
    return Math.ceil((list.length + startRow * perLayer) / perLayer);
  };
  const shuffledNormal = normal.slice().sort(() => r() - 0.5);
  let rows6 = 0;
  for (let d = 1; d <= 9; d++) {
    const n = d === 9 ? shuffledNormal.length - cursor : Math.round(normal.length * BENFORD[d - 1]);
    const list = shuffledNormal.slice(cursor, cursor + n); cursor += n;
    const rr = fillBar(d, list, 0);
    if (d === 6) rows6 = rr;
  }
  fillBar(6, flags, rows6);
  S.barTops = Array.from({ length: 9 }, (_, i) => barX(i + 1));
  S.barBase = base;

  // 3 · assurance: fibonacci sphere, exceptions on a tilted orbit
  const R3 = 1.95, ga = Math.PI * (3 - Math.sqrt(5));
  normal.forEach((idx, k) => {
    const y = 1 - (k / (normal.length - 1)) * 2, rad = Math.sqrt(1 - y * y), th = ga * k;
    P3[idx * 3] = Math.cos(th) * rad * R3; P3[idx * 3 + 1] = y * R3; P3[idx * 3 + 2] = Math.sin(th) * rad * R3;
  });
  const ot = 0.45;
  flags.forEach((idx, k) => {
    const a = (k / flags.length) * Math.PI * 2, rad = 2.85 + gauss(r) * 0.06;
    const x = Math.cos(a) * rad, z = Math.sin(a) * rad;
    P3[idx * 3] = x; P3[idx * 3 + 1] = -z * Math.sin(ot); P3[idx * 3 + 2] = z * Math.cos(ot);
  });

  S.flagCount = flags.length;
  S.populationScale = POPULATION / N;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(P0, 3));
  geo.setAttribute("aP1", new THREE.BufferAttribute(P1, 3));
  geo.setAttribute("aP2", new THREE.BufferAttribute(P2, 3));
  geo.setAttribute("aP3", new THREE.BufferAttribute(P3, 3));
  geo.setAttribute("aFlag", new THREE.BufferAttribute(FL, 1));
  geo.setAttribute("aRand", new THREE.BufferAttribute(RD, 1));

  const uniforms = {
    uP: { value: 0 }, uTime: { value: 0 }, uScan: { value: -99 }, uDir: { value: -1 },
    uSize: { value: mobile ? 2.6 : 2.3 }, uPR: { value: renderer.getPixelRatio() }, uReveal: { value: 0 }
  };

  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */`
      attribute vec3 aP1; attribute vec3 aP2; attribute vec3 aP3;
      attribute float aFlag; attribute float aRand;
      uniform float uP, uTime, uScan, uDir, uSize, uPR, uReveal;
      varying float vFlag; varying float vBeam; varying float vA; varying float vBoost;
      float seg(float x){ return smoothstep(0.0, 1.0, clamp((x - aRand * 0.38) / 0.62, 0.0, 1.0)); }
      mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
      void main(){
        float s1 = seg(uP), s2 = seg(uP - 1.0), s3 = seg(uP - 2.0);
        vec3 p0 = position;
        p0.xz = rot(uTime * 0.04) * p0.xz;
        vec3 q = aP3;
        if (aFlag > 0.5) { q.xz = rot(uTime * 0.22) * q.xz; }
        vec3 p = mix(p0, aP1, s1);
        p = mix(p, aP2, s2);
        p = mix(p, q, s3);
        float wob = (1.0 - s1) + s3;
        p += 0.03 * wob * vec3(sin(uTime * 0.8 + aRand * 40.0), cos(uTime * 0.7 + aRand * 31.0), sin(uTime * 0.6 + aRand * 23.0));

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        float passed = step(0.0, (uScan - aP1.x) * uDir);
        float ledgerW = s1 * (1.0 - s2);
        float reveal = max(passed * ledgerW, uReveal) * aFlag;
        float beam = (1.0 - smoothstep(0.0, 0.28, abs(aP1.x - uScan))) * ledgerW;
        vFlag = reveal; vBeam = beam;
        vA = 0.5 + 0.5 * aRand;
        vBoost = 1.0 + 0.9 * (1.0 - s1) + 0.35 * s3;
        float size = uSize * (0.65 + aRand * 0.7) * (1.0 + reveal * 1.6 + beam * 1.2) * (1.0 + 0.35 * (1.0 - s1));
        gl_PointSize = size * uPR * (11.0 / -mv.z);
      }`,
    fragmentShader: /* glsl */`
      varying float vFlag; varying float vBeam; varying float vA; varying float vBoost;
      void main(){
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d);
        vec3 base = vec3(0.84, 0.86, 0.90);
        vec3 amber = vec3(1.0, 0.66, 0.16);
        vec3 col = mix(base, amber, vFlag) + vBeam * vec3(0.45, 0.6, 0.85);
        float alpha = a * vA * vBoost * (0.62 + vFlag * 0.9 + vBeam * 0.8);
        gl_FragColor = vec4(col, alpha);
      }`
  });
  const points = new THREE.Points(geo, mat);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  /* scan beam: a thin glowing bar laid on the ledger plane */
  const beamGroup = new THREE.Group();
  beamGroup.rotation.x = tilt1;
  const beamMat = new THREE.MeshBasicMaterial({ color: 0x8ea6c8, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
  const beam = new THREE.Mesh(new THREE.PlaneGeometry(0.018, ledgerH * 1.12), beamMat);
  const haloMat = beamMat.clone();
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(0.34, ledgerH * 1.12), haloMat);
  beamGroup.add(halo, beam);
  group.add(beamGroup);

  /* sizing */
  let aspect = 1;
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    aspect = w / h;
    camera.aspect = aspect; camera.updateProjectionMatrix();
    uniforms.uPR.value = renderer.getPixelRatio();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  const clock = new THREE.Clock();
  const v = new THREE.Vector3();
  let mx = 0, my = 0, gx = 0, gy = 0, gs = 1, ry = 0, first = true;

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!S.visible && !first) return;
    const t = clock.elapsedTime;
    const k = 1 - Math.pow(0.0015, dt);
    const p = S.seg;
    const dir = S.rtl ? -1 : 1;

    uniforms.uP.value = p;
    uniforms.uTime.value = reduce ? 0 : t;
    uniforms.uDir.value = dir;

    // scan sweeps across the ledger in reading direction
    const scanT = clamp((p - 0.82) / 0.55);
    const half = ledgerW / 2 + 0.3;
    uniforms.uScan.value = dir > 0 ? lerp(-half, half, scanT) : lerp(half, -half, scanT);
    uniforms.uReveal.value = smooth((p - 1.35) / 0.3);
    const ledgerW8 = smooth((p - 0.7) / 0.2) * (1 - smooth((p - 1.4) / 0.2));
    beamGroup.position.x = uniforms.uScan.value;
    beamMat.opacity = ledgerW8 * 0.9 * (scanT > 0 && scanT < 1 ? 1 : 0.15);
    haloMat.opacity = beamMat.opacity * 0.12;
    S.scanT = scanT;

    // framing per state
    const wHero = 1 - smooth(p / 0.8);
    const wFlat = smooth((p - 0.5) / 0.6) * (1 - smooth((p - 2.4) / 0.5));   // ledger + benford
    const visW = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * aspect;
    const wideFit = Math.min(1, (visW * 0.9) / Math.max(ledgerW, 9 * BAR_GAP + BW));
    const roundFit = Math.min(1, (visW * 0.95) / 6.2);
    const fit = lerp(roundFit, wideFit, wFlat);
    const heroX = aspect > 1.1 ? dir * 2.4 : 0; // cloud sits opposite the headline
    const tx = heroX * wHero;
    const TY = aspect < 0.8 ? [1.6, 1.0, -0.45, 0.95] : [0.55, 0.7, -0.35, 0.62];
    const si = Math.min(2, Math.floor(clamp(p, 0, 2.999))), sf = smooth(p - si);
    const ty = lerp(TY[si], TY[si + 1], sf);
    gx = lerp(gx, tx, k * 0.25); gy = lerp(gy, ty, k * 0.25); gs = lerp(gs, fit, k * 0.25);
    group.position.set(gx, gy, 0);
    group.scale.setScalar(gs);

    const wSphere = smooth(p - 2.2);
    ry = lerp(ry, (reduce ? 0 : t * 0.12) * wSphere, k * 0.2);
    mx = lerp(mx, S.mx, k * 0.12); my = lerp(my, S.my, k * 0.12);
    group.rotation.set(my * 0.1 + wSphere * 0.15, mx * 0.22 * (1 - wFlat * 0.6) + ry, 0);

    // Benford digit labels follow the bars on screen
    const wBen = smooth((p - 1.6) / 0.3) * (1 - smooth((p - 2.4) / 0.25));
    S.benfordW = wBen;
    if (S.onBenford && wBen > 0.01) {
      group.updateMatrixWorld();
      const pts = S.barTops.map(bx => {
        v.set(bx, S.barBase - 0.28, 0.3).applyMatrix4(group.matrixWorld).project(camera);
        return [(v.x * 0.5 + 0.5) * canvas.clientWidth, (-v.y * 0.5 + 0.5) * canvas.clientHeight];
      });
      S.onBenford(pts, wBen);
    } else if (S.onBenford) S.onBenford(null, 0);

    renderer.render(scene, camera);
    if (first) { first = false; canvas.classList.add("ready"); }
  }
  frame();
}
