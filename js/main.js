/* =========================================================
   Ali Noor — Portfolio interactions (no libraries needed)
   ========================================================= */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MEDIA = window.MEDIA || {};

  const ICON = {
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>',
    video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="14" height="14" rx="2"/><path d="M17 10l4-2v8l-4-2"/></svg>'
  };

  /* ---------- theme ---------- */
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch (e) { /* storage unavailable */ }
    window.dispatchEvent(new Event('themechange'));
  }
  $$('.theme-btn').forEach(b => b.addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  }));

  /* ---------- page transitions ---------- */
  function loaded() { requestAnimationFrame(() => document.body.classList.add('is-loaded')); }
  if (document.readyState === 'complete') loaded(); else window.addEventListener('load', loaded);
  setTimeout(loaded, 1200); // never leave the veil up if a big asset is slow
  window.addEventListener('pageshow', e => { if (e.persisted) document.body.classList.remove('is-leaving'); });
  $$('a[data-transition]').forEach(a => a.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || reduceMotion) return;
    e.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(() => { window.location.href = a.href; }, 340);
  }));

  /* ---------- header ---------- */
  const header = $('.site-header');
  const onScrollHeader = () => header && header.classList.toggle('scrolled', window.scrollY > 10);
  onScrollHeader(); window.addEventListener('scroll', onScrollHeader, { passive: true });

  const menuBtn = $('.menu-btn'), navLinks = $('.nav-links');
  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    $$('a', navLinks).forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false');
    }));
  }
  // active section in nav
  const navMap = new Map($$('.nav-links a[href^="#"]').map(a => [a.getAttribute('href').slice(1), a]));
  if (navMap.size) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          navMap.forEach(a => a.classList.remove('active'));
          const a = navMap.get(en.target.id); if (a) a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navMap.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---------- hero: split name into letters ---------- */
  $$('[data-split]').forEach(el => {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text.split('').map((ch, i) =>
      ch === ' ' ? '<span aria-hidden="true">&nbsp;</span>' : `<span class="char" aria-hidden="true" style="--i:${i}">${ch}</span>`
    ).join('');
  });

  /* ---------- typing tagline ---------- */
  const typed = $('[data-typed]');
  if (typed) {
    const phrases = JSON.parse(typed.getAttribute('data-typed'));
    const out = $('.typed-text', typed);
    if (reduceMotion) out.textContent = phrases[0];
    else {
      let p = 0, i = 0, del = false;
      const tick = () => {
        const word = phrases[p];
        out.textContent = word.slice(0, i);
        if (!del && i < word.length) { i++; setTimeout(tick, 55); }
        else if (!del) { del = true; setTimeout(tick, 1900); }
        else if (i > 0) { i--; setTimeout(tick, 28); }
        else { del = false; p = (p + 1) % phrases.length; setTimeout(tick, 350); }
      };
      setTimeout(tick, 1100);
    }
  }

  /* ---------- 3D chip follows the pointer ---------- */
  $$('.chip').forEach(chip => {
    if (reduceMotion) return;
    let t = Math.random() * 6, idle = true, raf;
    window.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      idle = false;
      const x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
      chip.style.setProperty('--ry', (-24 + x * 40).toFixed(1) + 'deg');
      chip.style.setProperty('--rx', (18 - y * 30).toFixed(1) + 'deg');
      clearTimeout(chip._idle); chip._idle = setTimeout(() => { idle = true; }, 2500);
    }, { passive: true });
    const float = () => {
      if (idle) {
        t += .012;
        chip.style.setProperty('--ry', (-24 + Math.sin(t) * 10).toFixed(1) + 'deg');
        chip.style.setProperty('--rx', (18 + Math.cos(t * .8) * 5).toFixed(1) + 'deg');
      }
      raf = requestAnimationFrame(float);
    };
    float();
  });

  /* ---------- scroll reveals ---------- */
  $$('[data-stagger]').forEach(group => {
    const step = parseFloat(group.getAttribute('data-stagger')) || .08;
    Array.from(group.children).forEach((c, i) => c.style.setProperty('--delay', (i * step).toFixed(2) + 's'));
  });
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .reveal-left, .reveal-scale').forEach(el => revealIO.observe(el));

  /* ---------- count-up numbers ---------- */
  const countIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target; countIO.unobserve(el);
      const target = parseFloat(el.getAttribute('data-count'));
      const dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      if (reduceMotion) { el.textContent = target.toFixed(dec); return; }
      const dur = 1600, t0 = performance.now();
      const step = now => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        el.textContent = (target * e).toFixed(dec);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: .6 });
  $$('[data-count]').forEach(el => countIO.observe(el));

  /* ---------- card spotlight + tilt ---------- */
  $$('.card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });
  if (!reduceMotion) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        if (e.pointerType !== 'mouse') return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- timeline draws as you scroll ---------- */
  const timeline = $('.timeline');
  if (timeline) {
    const fill = $('.timeline-fill', timeline), items = $$('.t-item', timeline);
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = timeline.getBoundingClientRect(), vh = window.innerHeight, mark = vh * .62;
      const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
      fill.style.height = (p * 100).toFixed(2) + '%';
      items.forEach(it => {
        const node = $('.t-node', it);
        it.classList.toggle('active', node.getBoundingClientRect().top < mark);
      });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update); update();
  }

  /* ---------- media helpers ---------- */
  function placeholder(item) {
    const div = document.createElement('div');
    div.className = 'media-ph';
    const kind = item.type === 'image' ? 'image' : 'video';
    const hint = item.type === 'youtube'
      ? 'Add the YouTube video ID in <code>js/media.js</code>'
      : `Add <code>${item.src}</code>`;
    div.innerHTML = `<div>${ICON[kind]}<strong>${item.caption || (kind === 'image' ? 'Photo' : 'Video')}</strong><span>${hint}</span></div>`;
    if (item.ar) div.style.setProperty('--ar', item.ar);
    return div;
  }
  function createMedia(item, opts = {}) {
    if (!item) return placeholder({ type: 'image', src: '', caption: '' });
    if (item.type === 'youtube') {
      if (!item.src) return placeholder(item);
      const f = document.createElement('iframe');
      f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(item.src)}?rel=0`;
      f.title = item.caption || 'YouTube video'; f.loading = 'lazy';
      f.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      f.allowFullscreen = true;
      return f;
    }
    if (item.type === 'video') {
      const v = document.createElement('video');
      v.muted = true; v.loop = true; v.playsInline = true;
      v.preload = 'auto';
      v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
      if (item.poster) v.poster = item.poster;          // optional still image shown before playing
      if (opts.controls) v.controls = true;
      v.src = item.src + '#t=0.001';                   // forces the first frame to show
      v.addEventListener('error', () => v.replaceWith(placeholder(item)), { once: true });
      v.addEventListener('loadeddata', () => {          // start playing as soon as it's ready
        const c = v.closest('.carousel'); if (c && c._sync) c._sync();
      });
      return v;
    }
    const img = document.createElement('img');
    img.alt = item.caption || ''; img.loading = opts.eager ? 'eager' : 'lazy'; img.decoding = 'async';
    img.src = item.src;
    img.addEventListener('error', () => img.replaceWith(placeholder(item)), { once: true });
    return img;
  }

  /* ---------- carousels ---------- */
  const visibleIO = new IntersectionObserver(entries => {
    entries.forEach(en => { en.target._visible = en.isIntersecting; en.target._sync && en.target._sync(); });
  }, { threshold: .1 });

  $$('[data-carousel]').forEach(root => {
    const items = MEDIA[root.getAttribute('data-carousel')] || [];
    root.classList.add('carousel');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    if (!root.hasAttribute('aria-label')) root.setAttribute('aria-label', 'Media gallery');
    const track = document.createElement('div'); track.className = 'carousel-track';
    items.forEach((it, i) => {
      const fig = document.createElement('figure');
      fig.className = 'carousel-slide'; fig.style.margin = '0';
      fig.setAttribute('role', 'group'); fig.setAttribute('aria-roledescription', 'slide');
      fig.setAttribute('aria-label', `${i + 1} of ${items.length}`);
      fig.appendChild(createMedia(it));
      if (it.caption && it.type !== 'youtube') {
        const cap = document.createElement('figcaption'); cap.textContent = it.caption; fig.appendChild(cap);
      }
      track.appendChild(fig);
    });
    root.appendChild(track);
    let index = 0;
    const n = items.length;
    if (n > 1) {
      root.tabIndex = 0;
      const prev = document.createElement('button'); prev.className = 'carousel-btn prev'; prev.innerHTML = ICON.prev; prev.setAttribute('aria-label', 'Previous slide');
      const next = document.createElement('button'); next.className = 'carousel-btn next'; next.innerHTML = ICON.next; next.setAttribute('aria-label', 'Next slide');
      const dots = document.createElement('div'); dots.className = 'carousel-dots';
      const count = document.createElement('div'); count.className = 'carousel-count';
      items.forEach((_, i) => {
        const d = document.createElement('button'); d.setAttribute('aria-label', `Go to slide ${i + 1}`);
        d.addEventListener('click', () => go(i)); dots.appendChild(d);
      });
      root.append(prev, next, dots, count);
      prev.addEventListener('click', () => go(index - 1));
      next.addEventListener('click', () => go(index + 1));
      root.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      });
      let sx = null, sy = null;
      track.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; });
      track.addEventListener('pointerup', e => {
        if (sx === null) return;
        const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
      });
      root._ui = { dots: Array.from(dots.children), count };
    }
    function sync() {
      track.style.transform = `translateX(${-index * 100}%)`;
      if (root._ui) {
        root._ui.dots.forEach((d, i) => d.setAttribute('aria-current', String(i === index)));
        root._ui.count.textContent = `${index + 1} / ${n}`;
      }
      $$('video', track).forEach((v, i) => {
        const slide = v.closest('.carousel-slide');
        const active = Array.from(track.children).indexOf(slide) === index;
        if (active && root._visible && !reduceMotion) { const p = v.play(); if (p && p.catch) p.catch(() => {}); }
        else v.pause();
      });
    }
    function go(i) { index = (i + n) % n; sync(); }
    root._sync = sync;
    visibleIO.observe(root);
    sync();
  });

  /* ---------- lightbox ---------- */
  const lb = document.createElement('div');
  lb.className = 'lightbox'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Image viewer');
  lb.innerHTML = `<button class="lb-btn lb-close" aria-label="Close">${ICON.close}</button>
    <button class="lb-btn lb-prev" aria-label="Previous">${ICON.prev}</button>
    <button class="lb-btn lb-next" aria-label="Next">${ICON.next}</button>
    <figure><div class="lb-media"></div><figcaption></figcaption></figure>`;
  document.body.appendChild(lb);
  let lbItems = [], lbIndex = 0, lbReturn = null;
  function lbRender() {
    const box = $('.lb-media', lb); box.innerHTML = '';
    const it = lbItems[lbIndex];
    box.appendChild(createMedia(it, { eager: true, controls: true }));
    $('figcaption', lb).textContent = (it && it.caption) || '';
    const multi = lbItems.length > 1;
    $('.lb-prev', lb).style.display = multi ? '' : 'none';
    $('.lb-next', lb).style.display = multi ? '' : 'none';
  }
  function lbOpen(items, i, from) {
    lbItems = items; lbIndex = i; lbReturn = from || document.activeElement;
    lbRender(); lb.classList.add('open'); document.body.style.overflow = 'hidden';
    $('.lb-close', lb).focus();
  }
  function lbClose() {
    lb.classList.remove('open'); document.body.style.overflow = ''; $('.lb-media', lb).innerHTML = '';
    if (lbReturn && lbReturn.focus) lbReturn.focus();
  }
  $('.lb-close', lb).addEventListener('click', lbClose);
  $('.lb-prev', lb).addEventListener('click', () => { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; lbRender(); });
  $('.lb-next', lb).addEventListener('click', () => { lbIndex = (lbIndex + 1) % lbItems.length; lbRender(); });
  lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') $('.lb-prev', lb).click();
    if (e.key === 'ArrowRight') $('.lb-next', lb).click();
    if (e.key === 'Tab') { // keep focus inside
      const f = $$('button', lb).filter(b => b.style.display !== 'none');
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- certificates ---------- */
  $$('[data-cert]').forEach(btn => {
    const i = parseInt(btn.getAttribute('data-cert'), 10);
    const thumb = $('.cert-thumb', btn);
    if (thumb) thumb.appendChild(createMedia((MEDIA.certificates || [])[i]));
    btn.addEventListener('click', () => lbOpen(MEDIA.certificates || [], i, btn));
  });

  /* ---------- photography ---------- */
  const masonry = $('[data-photos]');
  if (masonry) {
    (MEDIA.photos || []).forEach((p, i) => {
      const b = document.createElement('button');
      b.setAttribute('aria-label', p.caption ? `Open photo: ${p.caption}` : `Open photo ${i + 1}`);
      b.className = 'reveal-scale';
      b.style.setProperty('--delay', ((i % 4) * .08).toFixed(2) + 's');
      b.appendChild(createMedia(p));
      b.addEventListener('click', () => lbOpen(MEDIA.photos, i, b));
      masonry.appendChild(b); revealIO.observe(b);
    });
  }

  /* ---------- battery chart ---------- */
  const chart = $('[data-battery-chart]');
  if (chart) {
    // Minutes until 0% battery, Galaxy A52 5G (from the QIDK battery-drain test).
    const series = [
      { name: 'CPU (fp32)', min: 205, color: 'var(--muted)', w: 2 },
      { name: 'DSP (int4)', min: 260, color: '#6EA8FE', w: 2 },
      { name: 'GPU (fp32)', min: 280, color: 'var(--copper)', w: 2 },
      { name: 'Ours: sMobileNNs', min: 305, color: 'var(--accent)', w: 3.5 }
    ];
    const Wd = 420, Ht = 220, L = 34, R = 22, T = 10, B = 28, maxX = 320;
    const x = m => L + (m / maxX) * (Wd - L - R), y = p => T + (1 - p / 100) * (Ht - T - B);
    let svg = `<svg viewBox="0 0 ${Wd} ${Ht}" role="img" aria-label="Battery remaining over time: CPU 205 minutes, DSP 260, GPU 280, ours 305">`;
    [0, 25, 50, 75, 100].forEach(p => {
      svg += `<line class="grid" x1="${L}" x2="${Wd - R}" y1="${y(p)}" y2="${y(p)}"/><text x="${L - 6}" y="${y(p) + 3}" text-anchor="end">${p}%</text>`;
    });
    [0, 80, 160, 240, 320].forEach(m => { svg += `<text x="${x(m)}" y="${Ht - 8}" text-anchor="middle">${m}m</text>`; });
    svg += `<line class="axis" x1="${L}" x2="${L}" y1="${T}" y2="${Ht - B}"/><line class="axis" x1="${L}" x2="${Wd - R}" y1="${Ht - B}" y2="${Ht - B}"/>`;
    series.forEach(s => {
      svg += `<path class="series" d="M${x(0)} ${y(100)} L${x(s.min)} ${y(0)}" style="stroke:${s.color};stroke-width:${s.w}"/>`;
    });
    svg += '</svg>';
    chart.innerHTML = svg + `<div class="chart-legend">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name} · ${s.min} min</span>`).join('')}</div>`;
    const paths = $$('.series', chart);
    paths.forEach(p => { const L2 = p.getTotalLength(); p.style.strokeDasharray = L2; p.style.strokeDashoffset = reduceMotion ? 0 : L2; });
    const cio = new IntersectionObserver(en => {
      if (!en[0].isIntersecting) return; cio.disconnect();
      paths.forEach((p, i) => { p.classList.add('draw'); p.style.transitionDelay = (i * .25) + 's'; requestAnimationFrame(() => { p.style.strokeDashoffset = 0; }); });
    }, { threshold: .4 });
    cio.observe(chart);
  }

  /* ---------- Novus pipeline ---------- */
  const STAGES = {
    rtl: ['RTL generation', 'An on-device LLM turns a design spec into Verilog, then reads compiler and lint errors back to fix its own code.'],
    tb: ['Testbench', 'Novus writes a self-checking testbench for the module and runs simulation to confirm behaviour before anything is synthesized.'],
    syn: ['Synthesis', 'The RTL is synthesized into a gate-level netlist under your timing constraints (TCL/SDC).'],
    sta: ['Static timing analysis', 'Timing reports are parsed automatically; violating paths are flagged and sent back to the earlier stages for fixes.'],
    pnr: ['Place & route', 'A reinforcement learning agent proposes cell placement to cut wirelength and congestion, then the design is routed.'],
    insp: ['Inspection', 'The final layout is checked and visualized so an engineer can review it, all without the design leaving the laptop.']
  };
  $$('.pipeline').forEach(pl => {
    const steps = $$('.pipe-step', pl);
    let i = -1, timer = null, playing = false;
    const show = k => {
      steps.forEach((s, j) => { s.classList.toggle('on', j === k); s.classList.toggle('done', j < k); });
      const key = steps[k] && steps[k].getAttribute('data-stage');
      const title = $('#flow-title'), text = $('#flow-text');
      if (key && STAGES[key] && title && text) { title.textContent = STAGES[key][0]; text.textContent = STAGES[key][1]; }
      if (key) $$('[data-art]').forEach(a => a.classList.toggle('on', a.getAttribute('data-art') === key));
    };
    const loop = () => {
      i = (i + 1) % (steps.length + 2); // short pause at the end
      show(i < steps.length ? i : (i === steps.length ? steps.length : -1));
      timer = setTimeout(loop, i < steps.length ? 950 : 1400);
    };
    if (reduceMotion) { show(steps.length); }
    else {
      const io = new IntersectionObserver(en => {
        if (en[0].isIntersecting && !playing && !pl._manual) { playing = true; loop(); }
        if (!en[0].isIntersecting && playing) { playing = false; clearTimeout(timer); }
      }, { threshold: .5 });
      io.observe(pl);
    }
    steps.forEach((s, k) => {
      const b = $('button', s);
      if (b) b.addEventListener('click', () => { pl._manual = true; playing = false; clearTimeout(timer); show(k); });
    });
  });

  /* ---------- 16-bit processor simulator ---------- */
  const cpu = $('[data-cpu]');
  if (cpu) {
    const OPS = ['AND', 'ANDI', 'OR', 'ORI', 'XOR', 'XORI', 'SLL', 'SRL', 'ADD', 'ADDI', 'SUB', 'SUBI', 'BLT', 'BE', 'JMP', 'HALT'];
    const bits = (v, n) => ((v >>> 0) & ((1 << n) - 1)).toString(2).padStart(n, '0');
    const wrap14 = v => ((((v + 8192) % 16384) + 16384) % 16384) - 8192;
    // Lab test program: doubling -32 until it overflows the 14-bit range
    const prog = [
      ['ADDI', 1, 0, -32], ['ADDI', 2, 0, -32], ['ADD', 3, 1, 2],
      ['ADD', 3, 3, 3], ['ADD', 3, 3, 3], ['ADD', 3, 3, 3], ['ADD', 3, 3, 3],
      ['ADD', 3, 3, 3], ['ADD', 3, 3, 3], ['ADD', 3, 3, 3], ['SUBI', 4, 3, 1], ['HALT', 0, 0, 0]
    ];
    const encode = ([op, rd, rs1, x]) => {
      const oc = bits(OPS.indexOf(op), 4);
      if (op === 'ADDI' || op === 'SUBI') { const imm = bits(x, 6); return `${oc} ${bits(rd, 3)} ${bits(rs1, 3)} ${imm.slice(0, 3)} ${imm.slice(3)}`; }
      if (op === 'HALT') return `${oc} xxx xxx xxx xxx`;
      return `${oc} ${bits(rd, 3)} ${bits(rs1, 3)} ${bits(x, 3)} 000`;
    };
    const asm = ([op, rd, rs1, x]) => op === 'HALT' ? 'HALT' :
      (op.endsWith('I') ? `${op} R${rd}, R${rs1}, ${x}` : `${op} R${rd}, R${rs1}, R${x}`);
    let pc = 0, regs = new Array(8).fill(0), busy = false, runTimer = null;
    const units = $$('.cpu-unit', cpu), regEls = $$('.cpu-reg', cpu);
    const asmEl = $('.asm', cpu), binEl = $('.bin', cpu), pcEl = $('.pc', cpu), flag = $('.cpu-flag', cpu), note = $('.cpu-note', cpu);
    const paint = (changed = -1) => {
      regEls.forEach((el, i) => { $('span', el).textContent = regs[i]; el.classList.toggle('changed', i === changed); });
      const ins = prog[Math.min(pc, prog.length - 1)];
      asmEl.textContent = asm(ins); binEl.textContent = encode(ins); pcEl.textContent = 'PC ' + pc;
    };
    const step = () => {
      if (busy) return;
      const ins = prog[pc];
      if (!ins || ins[0] === 'HALT') { note.textContent = 'HALT: the PC stops updating, so the processor stalls.'; stopRun(); return; }
      busy = true;
      const order = [0, 1, 2, 3, 4];
      order.forEach((u, k) => setTimeout(() => { units.forEach(el => el.classList.remove('hot')); units[u].classList.add('hot'); }, k * (reduceMotion ? 0 : 140)));
      setTimeout(() => {
        units.forEach(el => el.classList.remove('hot'));
        const [op, rd, rs1, x] = ins;
        let raw = 0;
        if (op === 'ADDI') raw = regs[rs1] + x;
        else if (op === 'SUBI') raw = regs[rs1] - x;
        else if (op === 'ADD') raw = regs[rs1] + regs[x];
        const res = wrap14(raw), ovf = raw !== res;
        if (rd !== 0) regs[rd] = res;
        flag.classList.toggle('on', ovf);
        note.textContent = ovf
          ? `Overflow: ${raw} does not fit in 14 bits (−8192 … 8191), so R${rd} wraps to ${res}.`
          : `R${rd} ← ${res}. Every instruction finishes in one clock cycle.`;
        pc++; paint(rd); busy = false;
      }, reduceMotion ? 0 : 5 * 140 + 60);
    };
    const stopRun = () => { clearInterval(runTimer); runTimer = null; $('[data-cpu-run]', cpu).textContent = 'Run program'; };
    $('[data-cpu-step]', cpu).addEventListener('click', () => { stopRun(); step(); });
    $('[data-cpu-run]', cpu).addEventListener('click', e => {
      if (runTimer) { stopRun(); return; }
      e.currentTarget.textContent = 'Pause';
      step(); runTimer = setInterval(step, 1000);
    });
    $('[data-cpu-reset]', cpu).addEventListener('click', () => {
      stopRun(); pc = 0; regs.fill(0); flag.classList.remove('on'); note.textContent = 'Press Step to execute one instruction.'; paint();
    });
    paint();
  }

  /* ---------- footer year ---------- */
  $$('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
})();
