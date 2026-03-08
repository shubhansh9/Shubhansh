/* =============================================
   CURSOR DOT — dot only, no ring
============================================= */
const dot = document.getElementById('cursor-dot');

document.addEventListener('mousemove', (e) => {
  dot.style.left = e.clientX + 'px';
  dot.style.top  = e.clientY + 'px';
});

document.querySelectorAll('a, button, .cp-card, .project-card, .flashcard').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

document.body.style.cursor = 'none';


/* =============================================
   PAGE LOADER — alphabet slot machine
   Each letter scrolls A→B→C...→target letter
============================================= */
(function buildLoader() {
  const NAME    = 'SHUBHANSH';
  const ALPHA   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const container = document.getElementById('loaderName');
  const barFill   = document.getElementById('loaderBarFill');
  if (!container) return;

  const slotHeight = window.innerWidth < 480 ? 29 : window.innerWidth < 768 ? 40 : 48; // px, matches CSS clamp

  // Build one slot per letter
  const slots = NAME.split('').map((letter) => {
    const targetIdx = ALPHA.indexOf(letter); // 0-based index in alphabet

    // Build column: alphabet A-Z then the target letter at the bottom
    // We scroll from top (A) down to target letter
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

    return { inner, targetIdx, letter };
  });

  // Animate each slot: scroll from A down to target letter
  // Stagger start by 120ms per letter
  slots.forEach(({ inner, targetIdx }, i) => {
    // Start at top (A), which means translateY(0)
    inner.style.transform = 'translateY(0px)';
    inner.style.transition = 'none';

    const delay = i * 120; // ms stagger between letters
    const stepDuration = 60; // ms per alphabet step — speed of scroll
    const totalSteps = targetIdx; // number of letters to scroll through

    setTimeout(() => {
      let step = 0;
      const interval = setInterval(() => {
        step++;
        // Scroll down: each step moves one letter height downward
        // But we built the column top→bottom (A at top, target at bottom)
        // To show scrolling DOWN (A disappears up, next letter comes from below):
        // We move inner UP (negative Y) so the next letter enters from bottom
        // Actually: translateY negative moves content up = viewer sees letters scrolling upward
        // We want viewer to see A→B→C going upward (like slot machine reels going up)
        const y = -(step * slotHeight);
        inner.style.transition = `transform ${stepDuration * 0.9}ms linear`;
        inner.style.transform  = `translateY(${y}px)`;

        if (step >= totalSteps) {
          clearInterval(interval);
          // Snap to exact final position + bounce settle
          setTimeout(() => {
            inner.style.transition = 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)';
            inner.style.transform  = `translateY(${-(targetIdx * slotHeight)}px)`;
          }, stepDuration);
        }
      }, stepDuration);
    }, delay);
  });

  // Progress bar tied to total animation time
  const totalTime = (NAME.length - 1) * 120 + 26 * 60; // last letter's full scroll
  let elapsed = 0;
  const barInterval = setInterval(() => {
    elapsed += 40;
    const pct = Math.min((elapsed / totalTime) * 100, 95);
    barFill.style.width = pct + '%';
    if (elapsed >= totalTime) {
      clearInterval(barInterval);
      barFill.style.width = '100%';
    }
  }, 40);

  // Hide loader after all slots finish
  const hideDelay = (NAME.length - 1) * 120 + 26 * 60 + 400;
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    setTimeout(() => {
      document.querySelectorAll('.reveal-left, .reveal-right').forEach(el => {
        el.classList.add('visible');
      });
    }, 200);
  }, hideDelay);
})();


/* =============================================
   NAVBAR: scroll + active link
============================================= */
const navbar   = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

/* =============================================
   HAMBURGER MENU
============================================= */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);

// Close menu on link click
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

/* =============================================
   TYPING ANIMATION
============================================= */
const words = [
  'Competitive Programmer!',
  'Full Stack Developer!',
  'Problem Solver!',
  'Open Source Contributor!',
  'C++ Enthusiast!',
];

let wordIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  if (!typedEl) return;
  const current = words[wordIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, --charIndex)
    : current.substring(0, ++charIndex);

  let speed = isDeleting ? 60 : 100;
  if (!isDeleting && charIndex === current.length) { speed = 1800; isDeleting = true; }
  else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; speed = 400; }
  setTimeout(type, speed);
}
setTimeout(type, 2200);

/* =============================================
   SCROLL REVEAL
============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

/* =============================================
   SKILL BARS
============================================= */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target.querySelector('.bar div');
      if (bar) {
        const target = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => setTimeout(() => { bar.style.width = target; }, 50));
      }
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-bar').forEach(bar => skillObserver.observe(bar));

/* =============================================
   CP STATS: COUNT-UP ANIMATION
============================================= */
function countUp(el, target, duration = 1400) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); }
    else { el.textContent = Math.floor(start).toLocaleString(); }
  }, 16);
}

// CP bar fill animation
function animateCPBars(card) {
  card.querySelectorAll('.cp-bar-fill[data-width]').forEach(bar => {
    const target = bar.getAttribute('data-width');
    setTimeout(() => { bar.style.width = target; }, 100);
  });
}

const cpObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Count up numbers
      entry.target.querySelectorAll('.cp-stat-val[data-target]').forEach(el => {
        countUp(el, parseInt(el.getAttribute('data-target')));
      });
      // Animate bars
      animateCPBars(entry.target);
      cpObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.cp-card').forEach(card => cpObserver.observe(card));

/* =============================================
   FLASHCARD — 3D TILT on mousemove
============================================= */
const flashcard      = document.getElementById('flashcard');
const flashcardInner = document.getElementById('flashcard-inner');

if (flashcard && flashcardInner) {
  flashcard.addEventListener('mousemove', (e) => {
    const rect   = flashcard.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -12;
    const rotateY = ((x - cx) / cx) *  12;
    flashcardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  });

  flashcard.addEventListener('mouseleave', () => {
    flashcardInner.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    flashcardInner.style.transform  = 'rotateX(0deg) rotateY(0deg) scale(1)';
    setTimeout(() => { flashcardInner.style.transition = 'transform 0.08s linear'; }, 600);
  });
}

/* =============================================
   EXPERIENCE ITEMS — scroll in from left
============================================= */
const expObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      expObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.exp-item').forEach(el => expObserver.observe(el));

/* =============================================
   SKILL BARS — percentage label tick up
============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});