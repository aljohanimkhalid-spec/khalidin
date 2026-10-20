/* khalidin.com | 3D hero: three nested GRC rings that tell the scroll story */
import * as THREE from "three";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;
const wrapHalfPi = a => { a = ((a + Math.PI / 2) % Math.PI + Math.PI) % Math.PI; return a - Math.PI / 2; };

function glowTexture(c1, c2) {
  const s = 256, cv = document.createElement("canvas");
  cv.width = cv.height = s;
  const g = cv.getContext("2d");
  const grd = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  grd.addColorStop(0, c1); grd.addColorStop(0.35, c2); grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd; g.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function startScene(canvas, S, reduce) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* lights add colour to the metal */
  const l1 = new THREE.DirectionalLight(0x5eead4, 2.2); l1.position.set(-5, 3, 3); scene.add(l1);
  const l2 = new THREE.DirectionalLight(0xb58cff, 2.2); l2.position.set(5, -2, 3); scene.add(l2);
  const l3 = new THREE.DirectionalLight(0xffffff, 0.8); l3.position.set(0, 5, -4); scene.add(l3);

  const world = new THREE.Group(); scene.add(world);
  const group = new THREE.Group(); world.add(group);

  /* three nested rings: Governance, Risk, Compliance */
  const R = [1.35, 1.02, 0.7];
  const COLORS = [0x5eead4, 0x6d8dff, 0xb58cff];
  const BASE = [[Math.PI / 2.4, 0.3], [0.5, Math.PI / 2.3], [-0.6, -0.5]];
  const SPEED = [[0.55, 0.0], [0.0, 0.7], [0.45, 0.35]];
  const rings = R.map((r, i) => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: COLORS[i], metalness: 1, roughness: 0.17, clearcoat: 1, clearcoatRoughness: 0.06,
      iridescence: 0.85, iridescenceIOR: 1.45, iridescenceThicknessRange: [180, 620],
      envMapIntensity: 1.5, emissive: COLORS[i], emissiveIntensity: 0
    });
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.11, 96, 300), mat);
    m.userData = { phase: [Math.random() * 3, Math.random() * 3], rot: [BASE[i][0], BASE[i][1]], pos: new THREE.Vector3(), scale: 1 };
    group.add(m);
    return m;
  });

  /* glowing core */
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 64, 64),
    new THREE.MeshPhysicalMaterial({ color: 0x0b1020, emissive: 0x6d8dff, emissiveIntensity: 1.4, roughness: 0.25, metalness: 0.2, clearcoat: 1 })
  );
  group.add(core);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glowTexture("rgba(160,185,255,0.95)", "rgba(109,141,255,0.35)"),
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true
  }));
  glow.scale.setScalar(2.6);
  group.add(glow);
  const coreLight = new THREE.PointLight(0x7f9bff, 6, 6); group.add(coreLight);

  /* star dust */
  const N = 900, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 3.5 + Math.random() * 7, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.6;
    pos[i * 3 + 2] = r * Math.cos(ph) - 2;
  }
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const dust = new THREE.Points(pg, new THREE.PointsMaterial({
    size: 0.05, map: glowTexture("rgba(255,255,255,1)", "rgba(180,200,255,0.4)"), transparent: true,
    opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xaebfff
  }));
  world.add(dust);

  /* sizing */
  let fit = 1;
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit = clamp(camera.aspect / 0.78, 0.6, 1);
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();
  let gy = -0.36, mxs = 0, mys = 0, first = true;

  function frame() {
    requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!S.visible && !first) return;
    const seg = S.seg, sx = S.rtl ? 1 : -1;
    const t = clock.elapsedTime;
    const k = 1 - Math.pow(0.001, dt);   // frame-rate independent smoothing

    const storyW = smooth(seg) * (1 - smooth(seg - 3));
    const finalW = smooth(seg - 3);

    rings.forEach((m, i) => {
      const u = m.userData;
      const focusW = smooth(1 - Math.abs(seg - (i + 1)));
      const spin = reduce ? 0 : (1 - finalW) * (1 - focusW * 0.8);
      u.phase[0] += dt * SPEED[i][0] * spin;
      u.phase[1] += dt * SPEED[i][1] * spin;

      const gyroW = clamp(1 - focusW - finalW);
      const gx = wrapHalfPi(BASE[i][0] + u.phase[0]);
      const gyy = wrapHalfPi(BASE[i][1] + u.phase[1]);
      const fx = 0.32 + Math.sin(t * 0.8) * 0.05, fy = sx * 0.42 + Math.cos(t * 0.6) * 0.05;
      const rx = gyroW * gx + focusW * fx;
      const ry = gyroW * gyy + focusW * fy;
      u.rot[0] = lerp(u.rot[0], rx, k * 0.35);
      u.rot[1] = lerp(u.rot[1], ry, k * 0.35);
      m.rotation.set(u.rot[0], u.rot[1], 0);

      // position & scale
      // story = a carousel of rings: the focused one centred in front, the others slide aside
      const f = clamp(seg - 1, 0, 2);
      const off = i - f;
      tmp.set(sx * off * 2.5 * fit, 0, -2.2 * Math.min(1, Math.abs(off)) + 0.6 * focusW);
      tmp.multiplyScalar(storyW);
      u.pos.lerp(tmp, k * 0.3);
      m.position.copy(u.pos);
      const sc = lerp(1, lerp(0.55, (0.9 * R[0]) / R[i], focusW), storyW);
      u.scale = lerp(u.scale, sc, k * 0.3);
      m.scale.setScalar(u.scale);
      m.material.emissiveIntensity = lerp(m.material.emissiveIntensity, 0.32 * focusW * storyW, k * 0.3);
    });

    // core and glow
    const coreS = lerp(1, 0.25, storyW) * (1 + Math.sin(t * 2) * 0.04);
    core.scale.setScalar(coreS);
    glow.scale.setScalar(lerp(2.6, 1.2, storyW) * (1 + finalW * 0.6) * (1 + Math.sin(t * 2) * 0.05));
    glow.material.opacity = lerp(1, 0.35, storyW);
    coreLight.intensity = lerp(6, 2, storyW) + finalW * 4;

    // group placement
    gy = lerp(gy, lerp(-0.36, 0.5, smooth(seg)), k * 0.3);
    group.position.y = gy;
    group.scale.setScalar(fit * lerp(0.74, 1, smooth(seg)));

    // pointer parallax
    mxs = lerp(mxs, S.mx, k * 0.15); mys = lerp(mys, S.my, k * 0.15);
    world.rotation.y = mxs * 0.28;
    world.rotation.x = mys * 0.16;
    if (!reduce) dust.rotation.y = t * 0.015 + S.p * 1.4;
    dust.position.y = S.p * 1.2;
    camera.position.z = lerp(9, 8.3, finalW);

    renderer.render(scene, camera);
    if (first) { first = false; canvas.classList.add("ready"); }
  }
  frame();
}
