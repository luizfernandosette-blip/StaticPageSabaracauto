/**
 * SABARÁ CENTRO AUTOMOTIVO — MAIN JAVASCRIPT
 * www.sabaracauto.com.br
 */

(function () {
  'use strict';

  /* ── DOM References ── */
  const header     = document.getElementById('header');
  const hamburger  = document.getElementById('hamburger');
  const navMenu    = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const backToTop  = document.getElementById('backToTop');
  const yearSpan   = document.getElementById('currentYear');
  const counters   = document.querySelectorAll('.counter');
  const navLinks   = document.querySelectorAll('.nav__link');
  const sections   = document.querySelectorAll('section[id]');
  const aosEls     = document.querySelectorAll('[data-aos]');

  /* ── Current year in footer ── */
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ══════════════════════════════════════
     SCROLL HANDLER — header, back-to-top,
     active nav link
  ══════════════════════════════════════ */
  function onScrollFixed() {
    const y = window.scrollY;
    const offset = header.offsetHeight + 10;

    header.classList.toggle('scrolled', y > 40);
    backToTop.classList.toggle('visible', y > 450);

    let currentId = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - offset) {
        currentId = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', onScrollFixed, { passive: true });
  onScrollFixed();

  /* ══════════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════════ */
  function openMenu() {
    navMenu.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Fechar menu');
    navOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu');
    navOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  navOverlay.addEventListener('click', closeMenu);

  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      hamburger.focus();
    }
  });

  /* ══════════════════════════════════════
     SMOOTH SCROLL
  ══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════
     BACK TO TOP
  ══════════════════════════════════════ */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════════
     COUNTER ANIMATION
  ══════════════════════════════════════ */
  let countersRan = false;

  function runCounters() {
    if (countersRan || !counters.length) return;
    const statsSection = document.querySelector('.stats');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    countersRan = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target, 10);
      if (isNaN(target)) return;
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const tick = () => {
        current = Math.min(current + increment, target);
        counter.textContent = Math.floor(current);
        if (current < target) requestAnimationFrame(tick);
        else counter.textContent = target;
      };
      requestAnimationFrame(tick);
    });
  }

  /* ══════════════════════════════════════
     SCROLL-REVEAL (lightweight AOS)
  ══════════════════════════════════════ */
  const delayedEls = new Map();

  function revealElements() {
    aosEls.forEach(el => {
      if (el.classList.contains('aos-animate')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        const delay = parseInt(el.dataset.aosDelay || '0', 10);
        if (delay > 0) {
          if (!delayedEls.has(el)) {
            delayedEls.set(el, true);
            setTimeout(() => el.classList.add('aos-animate'), delay);
          }
        } else {
          el.classList.add('aos-animate');
        }
      }
    });
  }

  /* ══════════════════════════════════════
     GALLERY BANNER — dynamic height
  ══════════════════════════════════════ */
  function sizeGallery() {
    const grid = document.querySelector('.gallery-banner__grid');
    if (!grid) return;
    // handled by CSS clamp(); JS fallback for very old browsers
    if (window.innerWidth <= 520) {
      grid.querySelectorAll('.gallery-banner__item').forEach(item => {
        item.style.height = '200px';
      });
    }
  }

  /* ══════════════════════════════════════
     UNIFIED SCROLL LISTENER
  ══════════════════════════════════════ */
  function onScrollAll() {
    runCounters();
    revealElements();
  }

  window.addEventListener('scroll', onScrollAll, { passive: true });

  /* ══════════════════════════════════════
     INIT ON LOAD
  ══════════════════════════════════════ */
  window.addEventListener('load', () => {
    onScrollAll();
    sizeGallery();
    // Give browser a tick to paint before checking visibility
    setTimeout(onScrollAll, 120);
  });

  window.addEventListener('resize', sizeGallery, { passive: true });

  /* ══════════════════════════════════════
     HERO SCROLL INDICATOR
     Fade out once user scrolls
  ══════════════════════════════════════ */
  const heroScroll = document.querySelector('.hero__scroll');
  if (heroScroll) {
    window.addEventListener('scroll', () => {
      heroScroll.style.opacity = window.scrollY > 100 ? '0' : '1';
    }, { passive: true });
  }

  /* ══════════════════════════════════════
     SERVICE CARD — touch tap highlight
     (ensures hover states on mobile)
  ══════════════════════════════════════ */
  document.querySelectorAll('.service-card, .diff-card, .testimonial-card').forEach(card => {
    card.addEventListener('touchstart', () => {}, { passive: true });
  });

})();
