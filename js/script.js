/* =============================================
   CUSTOM ARROW CURSOR + CLICK SPARK
============================================= */
const cursorArrow = document.getElementById('cursor-arrow');
const sparkCanvas = document.getElementById('spark-canvas');
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

if (!isTouch && cursorArrow) {

  /* ── Arrow cursor tracks mouse ── */
  let mx = -100, my = -100;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorArrow.style.transform = `translate(${mx}px, ${my}px)`;
  });

  /* ── Hover state ── */
  document.querySelectorAll('a, button, .cp-card, .project-card, .sk-card, .flashcard').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* ── Click shrink feedback ── */
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  /* ── Spark canvas ── */
  const ctx = sparkCanvas.getContext('2d');
  let sparks = [];

  // Resize canvas to full viewport
  function resizeSpark() {
    sparkCanvas.width  = window.innerWidth;
    sparkCanvas.height = window.innerHeight;
  }
  resizeSpark();
  window.addEventListener('resize', resizeSpark);

  // Spark config (matching ReactBits defaults)
  const SPARK_COUNT  = 8;
  const SPARK_COLOR  = '#2dd4bf';
  const SPARK_RADIUS = 22;
  const SPARK_SIZE   = 10;
  const DURATION     = 450;

  document.addEventListener('click', (e) => {
    const now = performance.now();
    for (let i = 0; i < SPARK_COUNT; i++) {
      sparks.push({
        x: e.clientX,
        y: e.clientY,
        angle: (2 * Math.PI * i) / SPARK_COUNT,
        startTime: now
      });
    }
  });

  function easeOut(t) { return t * (2 - t); }

  function drawSparks(timestamp) {
    ctx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
    sparks = sparks.filter(spark => {
      const elapsed  = timestamp - spark.startTime;
      if (elapsed >= DURATION) return false;
      const progress = elapsed / DURATION;
      const eased    = easeOut(progress);
      const dist     = eased * SPARK_RADIUS;
      const len      = SPARK_SIZE * (1 - eased);
      const x1 = spark.x + dist * Math.cos(spark.angle);
      const y1 = spark.y + dist * Math.sin(spark.angle);
      const x2 = spark.x + (dist + len) * Math.cos(spark.angle);
      const y2 = spark.y + (dist + len) * Math.sin(spark.angle);
      ctx.strokeStyle = SPARK_COLOR;
      ctx.lineWidth   = 2;
      ctx.shadowColor = SPARK_COLOR;
      ctx.shadowBlur  = 6;
      ctx.globalAlpha = 1 - eased;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur  = 0;
      return true;
    });
    requestAnimationFrame(drawSparks);
  }
  requestAnimationFrame(drawSparks);

} else if (cursorArrow) {
  cursorArrow.style.display = 'none';
}

/* =============================================
   PAGE LOADER — slot machine
============================================= */
(function buildLoader() {
  const NAME      = 'SHUBHANSH';
  const ALPHA     = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const container = document.getElementById('loaderName');
  const barFill   = document.getElementById('loaderBarFill');
  if (!container) return;

  const slotH = window.innerWidth < 768 ? 28 : 48;

  const slots = NAME.split('').map((letter) => {
    const targetIdx = ALPHA.indexOf(letter);
    const inner = document.createElement('div');
    inner.className = 'loader-slot-inner';
    for (let i = 0; i <= targetIdx; i++) {
      const s = document.createElement('span');
      s.textContent = ALPHA[i];
      if (i === targetIdx) s.className = 'active';
      inner.appendChild(s);
    }
    const slot = document.createElement('div');
    slot.className = 'loader-slot';
    slot.appendChild(inner);
    container.appendChild(slot);
    return { inner, targetIdx };
  });

  slots.forEach(({ inner, targetIdx }, i) => {
    inner.style.transform  = 'translateY(0px)';
    inner.style.transition = 'none';
    const delay      = i * 60;
    const stepDur    = 18;
    setTimeout(() => {
      let step = 0;
      const iv = setInterval(() => {
        step++;
        inner.style.transition = `transform ${stepDur * 0.9}ms linear`;
        inner.style.transform  = `translateY(${-(step * slotH)}px)`;
        if (step >= targetIdx) {
          clearInterval(iv);
          setTimeout(() => {
            inner.style.transition = 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)';
            inner.style.transform  = `translateY(${-(targetIdx * slotH)}px)`;
          }, stepDur);
        }
      }, stepDur);
    }, delay);
  });

  const totalTime = (NAME.length - 1) * 60 + 26 * 18 + 300;
  let elapsed = 0;
  const barIv = setInterval(() => {
    elapsed += 20;
    barFill.style.width = Math.min((elapsed / totalTime) * 100, 95) + '%';
    if (elapsed >= totalTime) { clearInterval(barIv); barFill.style.width = '100%'; }
  }, 20);

  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    setTimeout(() => {
      document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => el.classList.add('visible'));
    }, 200);
  }, (NAME.length - 1) * 60 + 26 * 18 + 500);
})();

/* =============================================
   SCROLL PROGRESS
============================================= */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  scrollBar.style.width = pct + '%';
});

/* =============================================
   NAVBAR
============================================= */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
});

/* =============================================
   HAMBURGER MENU
============================================= */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay    = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

function openMenu()  { hamburger.classList.add('open'); mobileMenu.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeMenu() { hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

hamburger.addEventListener('click', () => mobileMenu.classList.contains('open') ? closeMenu() : openMenu());
overlay.addEventListener('click', closeMenu);
const menuClose = document.getElementById('menuClose');
if (menuClose) menuClose.addEventListener('click', closeMenu);
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));

/* =============================================
   TYPING ANIMATION
============================================= */
const words = [
  'Competitive Programmer!',
  'Full Stack Developer!',
  'Plugin Developer!',
  'Problem Solver!',
  'Open Source Contributor!',
  'C++ Enthusiast!',
];
let wordIdx = 0, charIdx = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const cur = words[wordIdx];
  typedEl.textContent = isDeleting ? cur.substring(0, --charIdx) : cur.substring(0, ++charIdx);
  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIdx === cur.length)  { speed = 1800; isDeleting = true; }
  else if (isDeleting && charIdx === 0)        { isDeleting = false; wordIdx = (wordIdx + 1) % words.length; speed = 400; }
  setTimeout(type, speed);
}
setTimeout(type, 2200);

/* =============================================
   SCROLL REVEAL
============================================= */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); revObs.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.scroll-reveal').forEach(el => revObs.observe(el));

/* =============================================
   SKILL BARS
============================================= */
const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const bar = e.target.querySelector('.bar div');
      if (bar) { const t = bar.style.width; bar.style.width = '0'; requestAnimationFrame(() => setTimeout(() => { bar.style.width = t; }, 50)); }
      skillObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar').forEach(b => skillObs.observe(b));

/* =============================================
   CP COUNT-UP + BARS
============================================= */
function countUp(el, target, duration = 1400) {
  let start = 0;
  const step = target / (duration / 16);
  const t = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(t); }
    else el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

const cpObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.cp-stat-val[data-target]').forEach(el => countUp(el, parseInt(el.dataset.target)));
      e.target.querySelectorAll('.cp-bar-fill[data-width]').forEach(b => { setTimeout(() => { b.style.width = b.dataset.width; }, 100); });
      cpObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.cp-card').forEach(c => cpObs.observe(c));

/* =============================================
   FLASHCARD 3D TILT
============================================= */
const fc    = document.getElementById('flashcard');
const fcIn  = document.getElementById('flashcard-inner');
if (fc && fcIn && !isTouch) {
  fc.addEventListener('mousemove', (e) => {
    const r  = fc.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -12;
    const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  12;
    fcIn.style.transition = 'transform 0.08s linear';
    fcIn.style.transform  = `translate(-50%, -50%) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
  });
  fc.addEventListener('mouseleave', () => {
    fcIn.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    fcIn.style.transform  = 'translate(-50%, -50%) rotateX(0) rotateY(0) scale(1)';
  });
}

/* =============================================
   EXPERIENCE ITEMS
============================================= */
const expObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); expObs.unobserve(e.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.exp-item').forEach(el => expObs.observe(el));

/* =============================================
   PROJECT FILTER
============================================= */
const filterBtns = document.querySelectorAll('.filter-btn');
const projCards  = document.querySelectorAll('#projGrid .project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.filter;
    projCards.forEach(card => {
      const match = cat === 'all' || card.dataset.cat === cat;
      if (match) {
        card.style.display = '';
        card.style.animation = 'fadeInCard 0.35s ease forwards';
      } else {
        card.style.animation = 'fadeOutCard 0.25s ease forwards';
        setTimeout(() => { card.style.display = 'none'; }, 250);
      }
    });
  });
});

/* =============================================
   PROJECT MODALS
============================================= */
const modal      = document.getElementById('projModal');
const modalClose = document.getElementById('modalClose');
const modalBack  = document.getElementById('modalBackdrop');

function openModal(card) {
  if (!modal) return;
  document.getElementById('modalTitle').textContent = card.dataset.title || '';
  document.getElementById('modalDesc').textContent  = card.dataset.desc  || '';
  document.getElementById('modalTech').innerHTML = (card.dataset.tech || '').split(',').map(t => `<span>${t.trim()}</span>`).join('');
  document.getElementById('modalDemo').href = card.dataset.demo  || '#';
  document.getElementById('modalSrc').href  = card.dataset.source || '#';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-btn').forEach(btn => {
  btn.addEventListener('click', () => openModal(btn.closest('.project-card')));
});
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalBack)  modalBack.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* =============================================
   SMOOTH SCROLL
============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* =============================================
   SCROLL REVEAL — GSAP + ScrollTrigger
   Word-by-word: opacity 0.1→1, blur 4px→0
   Container rotates 3deg→0 as you scroll
   (ReactBits ScrollReveal, vanilla port)
============================================= */
gsap.registerPlugin(ScrollTrigger);

function initScrollReveal() {
  // All elements that should get the word-reveal treatment
  const targets = [
    ...document.querySelectorAll('[data-sr-heading]'),
    ...document.querySelectorAll('[data-sr-text]'),
  ];

  targets.forEach(el => {
    if (el.dataset.srDone) return;
    el.dataset.srDone = '1';

    // Wrap each word in a span, preserve child nodes (like <br>)
    const childNodes = Array.from(el.childNodes);
    el.innerHTML = '';

    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(chunk => {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) {
            el.appendChild(document.createTextNode(' '));
          } else {
            const span = document.createElement('span');
            span.className = 'sr-word';
            span.textContent = chunk;
            el.appendChild(span);
          }
        });
      } else {
        el.appendChild(node); // keep <br>, child spans etc.
      }
    });

    const words = el.querySelectorAll('.sr-word');
    if (!words.length) return;

    // Slight rotation on the container — scrubbed
    gsap.fromTo(el,
      { transformOrigin: '0% 50%', rotate: 3 },
      {
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true
        }
      }
    );

    // Opacity scrub
    gsap.fromTo(words,
      { opacity: 0.1, willChange: 'opacity, filter' },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=20%',
          end: 'bottom bottom',
          scrub: true
        }
      }
    );

    // Blur scrub
    gsap.fromTo(words,
      { filter: 'blur(4px)' },
      {
        filter: 'blur(0px)',
        ease: 'none',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=20%',
          end: 'bottom bottom',
          scrub: true
        }
      }
    );
  });
}

// Run after loader finishes
const srInitDelay = (9 - 1) * 60 + 26 * 18 + 600;
setTimeout(initScrollReveal, srInitDelay);
