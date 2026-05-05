/* ============================================================
   360 ELITE MANAGEMENT â SHARED JAVASCRIPT
   Nav, parallax, reveal, counters, carousel.
   Each athlete page includes this via <script src="../assets/main.js">
   ============================================================ */

// ===== NAV SCROLL =====
const topBar = document.getElementById('topBar');
if (topBar) {
  window.addEventListener('scroll', () => {
    topBar.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ===== PARALLAX HERO =====
const heroBg = document.getElementById('heroBg');
if (heroBg) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroBg.style.transform = `translateY(${scrolled * 0.35}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== MOBILE NAV =====
const mobileToggle = document.getElementById('mobileToggle');
const mobileNav = document.getElementById('mobileNav');
if (mobileToggle && mobileNav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    mobileToggle.innerHTML = isOpen ? '&times;' : '&#9776;';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
}
function closeMobileNav() {
  if (mobileNav) mobileNav.classList.remove('open');
  if (mobileToggle) mobileToggle.innerHTML = '&#9776;';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileNav();
});

// ===== REVEAL ON SCROLL =====
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, duration = 1200) {
  let start = 0;
  const startTime = performance.now();
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statsBar = document.getElementById('statsBar');
if (statsBar) {
  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-count]').forEach(el => {
          animateCounter(el, parseInt(el.dataset.count));
        });
        statsObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  statsObs.observe(statsBar);
}

// ===== BRAND PARTNERS CAROUSEL =====
function initCarousel(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const track = container.querySelector('.carousel-track');
  const cards = container.querySelectorAll('.partner-card');
  const prevBtn = container.querySelector('.carousel-prev');
  const nextBtn = container.querySelector('.carousel-next');
  const dotsContainer = container.querySelector('.carousel-dots');

  const isMobile = () => window.innerWidth <= 768;
  const visibleCount = () => isMobile() ? 1 : 2;
  const total = cards.length;
  let current = 0;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total - visibleCount() + 1; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function updateButtons() {
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current >= total - visibleCount();
  }

  function goTo(index) {
    const vc = visibleCount();
    current = Math.max(0, Math.min(index, total - vc));
    // Each card is (100 / vc)% wide; gap is 16px
    const cardWidthPct = 100 / vc;
    // Offset by card width + gap pixels converted
    const cardPx = track.offsetWidth / vc;
    const offset = current * (cardPx + 16);
    track.style.transform = `translateX(-${offset}px)`;
    updateDots();
    updateButtons();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-advance every 4s
  let autoInterval = setInterval(() => {
    const vc = visibleCount();
    if (current >= total - vc) {
      goTo(0);
    } else {
      goTo(current + 1);
    }
  }, 4000);

  container.addEventListener('mouseenter', () => clearInterval(autoInterval));
  container.addEventListener('mouseleave', () => {
    autoInterval = setInterval(() => {
      const vc = visibleCount();
      if (current >= total - vc) goTo(0);
      else goTo(current + 1);
    }, 4000);
  });

  // Recalculate on resize
  window.addEventListener('resize', () => goTo(0));

  // Init
  goTo(0);
}

// Init all carousels on page
document.addEventListener('DOMContentLoaded', () => {
  initCarousel('partnerCarousel');
});
