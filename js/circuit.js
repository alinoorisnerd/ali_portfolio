/* =========================================================
   Animated PCB / circuit-trace background
   - Traces route on a grid (0°, 45°, 90° turns), draw themselves in,
     then "signal" pulses travel along them.
   - Respects prefers-reduced-motion, pauses when the tab is hidden,
     re-themes when the light/dark toggle changes.
   ========================================================= */
(function () {
  const canvas = document.getElementById('circuit');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  let W = 0, H = 0, DPR = 1, CELL = 26, cols = 0, rows = 0;
  let traces = [], pulses = [], staticLayer = null;
  let drawStart = 0, drawDuration = 2600, fullyDrawn = false;
  let colors = {};
  let rafId = null, running = true, mouse = { x: -9999, y: -9999 };

  function readColors() {
    const cs = getComputedStyle(document.documentElement);
    colors.trace = cs.getPropertyValue('--trace').trim() || '59,224,160';
    colors.dim = cs.getPropertyValue('--trace-dim').trim() || '210,154,91';
    colors.light = document.documentElement.getAttribute('data-theme') === 'light';
  }

  function rand(a, b) { return a + Math.random() * (b - a); }
  function randInt(a, b) { return Math.floor(rand(a, b + 1)); }

  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    CELL = W < 640 ? 22 : 26;
    cols = Math.ceil(W / CELL) + 1; rows = Math.ceil(H / CELL) + 1;

    const occ = new Uint8Array(cols * rows);
    const used = (x, y) => x < 0 || y < 0 || x >= cols || y >= rows || occ[y * cols + x];
    const mark = (x, y) => { if (x >= 0 && y >= 0 && x < cols && y < rows) occ[y * cols + x] = 1; };

    traces = [];
    const target = Math.round((cols * rows) / (W < 640 ? 70 : 52));
    let attempts = 0;
    while (traces.length < target && attempts < target * 12) {
      attempts++;
      let x = randInt(0, cols - 1), y = randInt(0, rows - 1);
      if (used(x, y)) continue;
      let d = randInt(0, 3) * 2; // start orthogonal
      const pts = [[x, y]]; mark(x, y);
      let len = 0; const maxLen = randInt(6, 34);
      let straight = randInt(2, 7);
      while (len < maxLen) {
        if (straight <= 0) { // turn by 45°
          d = (d + (Math.random() < .5 ? 1 : 7)) % 8;
          straight = (d % 2) ? randInt(1, 3) : randInt(3, 9);
        }
        const nx = x + DIRS[d][0], ny = y + DIRS[d][1];
        if (used(nx, ny)) break;
        // avoid crossing diagonals
        if (d % 2 && used(x + DIRS[d][0], y) && used(x, y + DIRS[d][1])) break;
        x = nx; y = ny; mark(x, y); len++; straight--;
        const last = pts[pts.length - 1];
        const prev = pts[pts.length - 2];
        if (prev && (last[0] - prev[0]) === DIRS[d][0] && (last[1] - prev[1]) === DIRS[d][1]) {
          pts[pts.length - 1] = [x, y]; // extend same segment
        } else {
          pts.push([x, y]);
        }
      }
      if (len < 4) continue;
      // reserve neighbours lightly so traces keep spacing
      const px = pts.map(p => [p[0] * CELL, p[1] * CELL]);
      const segLens = []; let total = 0;
      for (let i = 1; i < px.length; i++) {
        const l = Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1]);
        segLens.push(l); total += l;
      }
      traces.push({
        pts: px, segLens, total,
        copper: Math.random() < .35,
        width: Math.random() < .15 ? 2.2 : 1.2,
        delay: Math.random() * .6
      });
    }
    // occasional IC footprints (rows of pads) for texture
    staticLayer = null; fullyDrawn = false;
    drawStart = performance.now();
    pulses = [];
  }

  function pointAt(t, dist) {
    let d = dist;
    for (let i = 0; i < t.segLens.length; i++) {
      if (d <= t.segLens[i]) {
        const a = t.pts[i], b = t.pts[i + 1], k = t.segLens[i] ? d / t.segLens[i] : 0;
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
      }
      d -= t.segLens[i];
    }
    return t.pts[t.pts.length - 1];
  }

  function strokePartial(c, t, frac) {
    const limit = t.total * frac;
    c.beginPath();
    c.moveTo(t.pts[0][0], t.pts[0][1]);
    let acc = 0;
    for (let i = 1; i < t.pts.length; i++) {
      const l = t.segLens[i - 1];
      if (acc + l <= limit) { c.lineTo(t.pts[i][0], t.pts[i][1]); acc += l; }
      else {
        const k = (limit - acc) / l, a = t.pts[i - 1], b = t.pts[i];
        c.lineTo(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k);
        break;
      }
    }
    c.stroke();
  }

  function drawPads(c, t, alpha) {
    const s = t.pts[0], e = t.pts[t.pts.length - 1];
    [s, e].forEach(p => {
      c.beginPath(); c.arc(p[0], p[1], t.width > 2 ? 4 : 3, 0, Math.PI * 2);
      c.strokeStyle = `rgba(${t.copper ? colors.dim : colors.trace},${alpha * 1.6})`;
      c.lineWidth = 1.2; c.stroke();
    });
  }

  function traceAlpha(t) { return (colors.light ? .16 : .13) * (t.copper ? 1.15 : 1); }

  function renderTraces(c, progress) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const t of traces) {
      const p = Math.max(0, Math.min(1, (progress - t.delay) / (1 - t.delay * .5)));
      if (p <= 0) continue;
      const a = traceAlpha(t);
      c.strokeStyle = `rgba(${t.copper ? colors.dim : colors.trace},${a})`;
      c.lineWidth = t.width;
      strokePartial(c, t, p);
      if (p >= 1) drawPads(c, t, a);
      else { // bright drawing head
        const head = pointAt(t, t.total * p);
        c.fillStyle = `rgba(${colors.trace},.7)`;
        c.beginPath(); c.arc(head[0], head[1], 1.8, 0, Math.PI * 2); c.fill();
      }
    }
  }

  function bakeStatic() {
    staticLayer = document.createElement('canvas');
    staticLayer.width = canvas.width; staticLayer.height = canvas.height;
    const s = staticLayer.getContext('2d');
    s.scale(DPR, DPR);
    renderTraces(s, 1.5);
  }

  function spawnPulse() {
    if (!traces.length) return;
    // prefer traces near the mouse
    let t = traces[randInt(0, traces.length - 1)];
    if (mouse.x > 0 && Math.random() < .5) {
      let best = null, bd = 1e9;
      for (let i = 0; i < 12; i++) {
        const c = traces[randInt(0, traces.length - 1)];
        const p = c.pts[0]; const dd = Math.hypot(p[0] - mouse.x, p[1] - mouse.y);
        if (dd < bd) { bd = dd; best = c; }
      }
      if (best) t = best;
    }
    pulses.push({ t, d: 0, speed: rand(110, 240), tail: rand(40, 90), rev: Math.random() < .5 });
  }

  let last = performance.now(), spawnAcc = 0;
  function frame(now) {
    if (!running) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const progress = (now - drawStart) / drawDuration;
    if (!fullyDrawn && progress >= 1.5) { bakeStatic(); fullyDrawn = true; }

    if (fullyDrawn && staticLayer) ctx.drawImage(staticLayer, 0, 0);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (!fullyDrawn) renderTraces(ctx, progress);

    if (progress > .8 && !reduceMotion) {
      spawnAcc += dt;
      const rate = W < 640 ? .35 : .16;
      while (spawnAcc > rate) { spawnAcc -= rate; if (pulses.length < 40) spawnPulse(); }
      ctx.lineCap = 'round';
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.d += p.speed * dt;
        if (p.d - p.tail > p.t.total) { pulses.splice(i, 1); continue; }
        const steps = 10;
        for (let s = 0; s < steps; s++) {
          const d1 = p.d - (p.tail * s) / steps, d2 = p.d - (p.tail * (s + 1)) / steps;
          if (d1 < 0 || d2 > p.t.total) continue;
          const a = pointAt(p.t, p.rev ? p.t.total - Math.max(0, d1) : Math.max(0, d1));
          const b = pointAt(p.t, p.rev ? p.t.total - Math.max(0, d2) : Math.max(0, d2));
          ctx.strokeStyle = `rgba(${colors.trace},${(1 - s / steps) * (colors.light ? .75 : .9)})`;
          ctx.lineWidth = p.t.width + 1;
          ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
        }
        if (p.d <= p.t.total) {
          const h = pointAt(p.t, p.rev ? p.t.total - p.d : p.d);
          const g = ctx.createRadialGradient(h[0], h[1], 0, h[0], h[1], 10);
          g.addColorStop(0, `rgba(${colors.trace},.9)`); g.addColorStop(1, `rgba(${colors.trace},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(h[0], h[1], 10, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    readColors(); build();
    if (reduceMotion) {
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      renderTraces(ctx, 1.5);
      return;
    }
    cancelAnimationFrame(rafId);
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (Math.abs(window.innerWidth - W) < 2 && Math.abs(window.innerHeight - H) < 120) return; // ignore mobile URL-bar jitter
      start();
    }, 200);
  });
  window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running && !reduceMotion) { last = performance.now(); rafId = requestAnimationFrame(frame); }
  });
  window.addEventListener('themechange', () => {
    readColors();
    if (reduceMotion) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.setTransform(DPR, 0, 0, DPR, 0, 0); renderTraces(ctx, 1.5); }
    else if (fullyDrawn) bakeStatic();
  });

  start();
})();
