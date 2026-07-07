/* ════════════════════════════════════════════════
   DATTATRAY BHOSALE — PORTFOLIO SCRIPT
   Canvas · Cursor · Tilt · Reveal · Form
   ════════════════════════════════════════════════ */
'use strict';

/* ══ CANVAS — Subtle constellation ══ */
(function heroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  const resize = () => {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  };
  resize();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  // Particles — amber/slate only
  const COLORS = ['rgba(217,119,6,', 'rgba(242,240,237,'];
  const pts = Array.from({ length: 70 }, () => ({
    x:  Math.random() * 1920,
    y:  Math.random() * 1080,
    vx: (Math.random() - .5) * .22,
    vy: (Math.random() - .5) * .22,
    r:  Math.random() * 1.2 + .3,
    c:  COLORS[Math.random() > .6 ? 0 : 1],
    a:  Math.random() * .35 + .08,
  }));

  let mx = W/2, my = H/2;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 110) {
          const a = (1 - d/110) * .08;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(217,119,6,${a})`;
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }

    // Mouse gravity — gentle pull
    pts.forEach(p => {
      const dx  = mx - p.x;
      const dy  = my - p.y;
      const d   = Math.sqrt(dx*dx + dy*dy);
      if (d < 180) {
        p.vx += dx * .00004;
        p.vy += dy * .00004;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Damping
      p.vx *= .992;
      p.vy *= .992;

      // Wrap
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.c}${p.a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══ CUSTOM CURSOR ══ */
(function cursor() {
  const dot  = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function lag() {
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lag);
  })();

  // Hover scale
  const hov = 'a,button,.ach-card,.proj-row,.svc-item,.av-card,.tf-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hov)) {
      dot.style.transform  = 'translate(-50%,-50%) scale(3)';
      dot.style.opacity    = '.5';
      ring.style.width     = '50px';
      ring.style.height    = '50px';
      ring.style.opacity   = '.2';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hov)) {
      dot.style.transform  = 'translate(-50%,-50%) scale(1)';
      dot.style.opacity    = '1';
      ring.style.width     = '28px';
      ring.style.height    = '28px';
      ring.style.opacity   = '.5';
    }
  });
})();

/* ══ TYPING ══ */
const roles = [
  'Full Stack Developer',
  'Frontend Developer',
  'PHP Developer',
  'UI Designer',
  'Web Application Builder'
];
let ri = 0, ci = 0, del = false;
const typed = document.getElementById('typed');

(function tick() {
  if (!typed) return;
  const w = roles[ri];
  typed.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
  let t = del ? 42 : 75;
  if (!del && ci === w.length)  { t = 2400; del = true; }
  else if (del && ci === 0)     { del = false; ri = (ri + 1) % roles.length; t = 450; }
  setTimeout(tick, t);
})();

/* ══ NAVBAR ══ */
const nav = document.getElementById('nav');
function refreshNav() {
  nav.classList.toggle('stuck', window.scrollY > 60);
  const secs = document.querySelectorAll('section[id]');
  let cur = '';
  secs.forEach(s => { if (window.scrollY >= s.offsetTop - 140) cur = s.id; });
  document.querySelectorAll('.links a').forEach(a => {
    a.classList.toggle('on', a.getAttribute('href') === '#' + cur);
  });
}
window.addEventListener('scroll', refreshNav, { passive: true });
refreshNav();

/* ══ HAMBURGER ══ */
const ham   = document.getElementById('ham');
const links = document.getElementById('links');
ham.addEventListener('click', () => {
  const o = links.classList.toggle('open');
  ham.classList.toggle('x', o);
});
links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  links.classList.remove('open');
  ham.classList.remove('x');
}));
document.addEventListener('click', e => {
  if (!nav.contains(e.target)) {
    links.classList.remove('open');
    ham.classList.remove('x');
  }
});

/* ══ THEME ══ */
const thBtn  = document.getElementById('theme-btn');
const thIco  = document.getElementById('theme-ico');
const html   = document.documentElement;
const saved  = localStorage.getItem('db-t') || 'dark';
html.setAttribute('data-theme', saved);

thBtn.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('db-t', next);
});

/* ══ SCROLL PROGRESS ══ */
const prog = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (prog) prog.style.transform = `scaleX(${s / h})`;
}, { passive: true });

/* ══ INTERSECTION OBSERVER ══ */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: .1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.sr,.sr-left,.sr-right').forEach(el => io.observe(el));

/* ══ SKILL BARS ══ */
const sbObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.sb-fill').forEach((f, i) => {
      const pct = parseInt(f.closest('.sb').dataset.pct);
      setTimeout(() => { f.style.width = pct + '%'; }, i * 60);
    });
    sbObs.unobserve(e.target);
  });
}, { threshold: .2 });
const skillSec = document.getElementById('skills');
if (skillSec) sbObs.observe(skillSec);

/* ══ COUNTERS ══ */
function runCount(el, to, dur = 1400) {
  let s = null;
  const step = ts => {
    if (!s) s = ts;
    const p = Math.min((ts - s) / dur, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(e * to);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = to;
  };
  requestAnimationFrame(step);
}

// Hero counters (run once on load)
setTimeout(() => {
  document.querySelectorAll('#hero .cnt').forEach(el => {
    runCount(el, parseInt(el.dataset.to));
  });
}, 900);

// Section counters
const cntObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll('.cnt').forEach(el => {
      runCount(el, parseInt(el.dataset.to));
    });
    cntObs.unobserve(e.target);
  });
}, { threshold: .3 });
document.querySelectorAll('#about').forEach(s => cntObs.observe(s));

/* ══ 3D TILT — About card ══ */
const card = document.getElementById('av-card');
if (card) {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left)  / r.width  - .5;
    const y  = (e.clientY - r.top)   / r.height - .5;
    card.style.transform = `perspective(700px) rotateY(${x*14}deg) rotateX(${-y*14}deg) scale(1.02)`;
    const bg = card.querySelector('.av-bg');
    if (bg) bg.style.background = `radial-gradient(ellipse 200px 180px at ${50+x*60}% ${40+y*40}%,rgba(217,119,6,.18),transparent)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
}

/* ══ PROJECT ROW TILT (subtle) ══ */
if (window.matchMedia('(hover:hover)').matches) {
  document.querySelectorAll('.proj-row').forEach(row => {
    row.addEventListener('mousemove', e => {
      const r = row.getBoundingClientRect();
      const y = ((e.clientY - r.top) / r.height - .5) * 2;
      row.style.transform = `perspective(1000px) rotateX(${-y * 1.5}deg)`;
    });
    row.addEventListener('mouseleave', () => { row.style.transform = ''; });
  });
}

/* ══ CONTACT FORM ══ */
(function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;

    form.querySelectorAll('[required]').forEach(f => {
      const g = f.closest('.field');
      g.classList.remove('err');
      const v = f.value.trim();
      if (!v) { g.classList.add('err'); ok = false; }
      if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        g.classList.add('err'); ok = false;
      }
    });
    if (!ok) return;

    const btn  = form.querySelector('.send-btn');
    const txt  = document.getElementById('s-text');
    const ico  = document.getElementById('s-icon');
    btn.disabled = true;
    txt.textContent = 'Sending...';
    ico.className   = 'fas fa-spinner fa-spin';

    setTimeout(() => {
      txt.textContent   = 'Sent successfully';
      ico.className     = 'fas fa-check';
      btn.style.background = '#22c55e';

      setTimeout(() => {
        form.reset();
        btn.disabled      = false;
        txt.textContent   = 'Send Message';
        ico.className     = 'fas fa-arrow-right';
        btn.style.background = '';
      }, 4000);
    }, 1800);
  });

  form.querySelectorAll('[required]').forEach(f => {
    f.addEventListener('input', () => f.closest('.field').classList.remove('err'));
  });
})();

/* ══ SMOOTH SCROLL ══ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
  });
});

/* ══ FOOTER YEAR ══ */
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

/* ══ ESC CLOSE NAV ══ */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    links.classList.remove('open');
    ham.classList.remove('x');
  }
});

/* ══ SECTION HIGHLIGHT ANIMATION — Project rows stagger ══ */
(function staggerRows() {
  const rows = document.querySelectorAll('.proj-row.sr');
  rows.forEach((r, i) => { r.style.transitionDelay = `${i * 0.08}s`; });
  const achCards = document.querySelectorAll('.ach-card');
  achCards.forEach((c, i) => {
    if (!c.style.transitionDelay) c.style.transitionDelay = `${i * 0.1}s`;
  });
})();

console.log(
  '%cDattatray Bhosale%c\nFull Stack Developer — Built by hand.',
  'font-size:16px;font-weight:800;color:#d97706;padding:4px 0',
  'font-size:11px;color:#8c8a88'
);
