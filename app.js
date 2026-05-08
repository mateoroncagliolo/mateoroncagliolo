/* =========================================================
   MATEO RONCAGLIOLO — landing JS
   ========================================================= */

(function () {
  'use strict';

  // ---------- Poster del hero según viewport ----------
  const heroVideo = document.querySelector('.hero__video');
  if (heroVideo) {
    heroVideo.poster = window.innerWidth >= 900
      ? 'assets/fallback-ordenador.jpg'
      : 'assets/fallback-movil.jpg';
  }

  // ---------- IntersectionObserver — reveals on scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -2% 0px' });

  document.querySelectorAll('.fade-up, .line-mask, .split-word').forEach(el => io.observe(el));

  // ---------- Process pinned section: switch active step ----------
  const pinSection = document.querySelector('.process__pin');
  const steps = document.querySelectorAll('.step');
  const pips = document.querySelectorAll('.process__progress button');

  function setActiveStep(i) {
    steps.forEach((s, idx) => s.classList.toggle('is-active', idx === i));
    pips.forEach((p, idx) => p.classList.toggle('is-active', idx === i));
  }

  if (pinSection && steps.length) {
    setActiveStep(0);
    function onScroll() {
      const rect = pinSection.getBoundingClientRect();
      const total = pinSection.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const ratio = total > 0 ? scrolled / total : 0;
      const n = steps.length;
      let active = Math.min(n - 1, Math.floor(ratio * n + 0.0001));
      if (ratio > 0.95) active = n - 1;
      setActiveStep(active);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    pips.forEach((p, idx) => {
      p.addEventListener('click', () => {
        const top = pinSection.offsetTop + (pinSection.offsetHeight - window.innerHeight) * (idx / steps.length) + 4;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  // ---------- Hero subtle parallax on scroll ----------
  const heroInner = document.querySelector('.hero__inner');
  if (heroVideo && heroInner) {
    let raf;
    function onHeroScroll() {
      const y = window.scrollY;
      if (y > window.innerHeight * 1.2) return;
      heroVideo.style.transform = `translate3d(0, ${y * 0.18}px, 0) scale(1.04)`;
      heroInner.style.transform = `translate3d(0, ${y * 0.06}px, 0)`;
      heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.9)));
    }
    window.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onHeroScroll);
    }, { passive: true });
  }

  // ---------- Calendly (lazy) ----------
  function initCalendly() {
    /* usa popup en vez del badge para no chocar con el FAB */
  }
  document.querySelectorAll('[data-calendly]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('data-calendly');
      if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
        window.Calendly.initPopupWidget({ url });
      } else {
        window.open(url, '_blank', 'noopener');
      }
    });
  });
  function loadCalendly() {
    if (document.getElementById('calendly-widget-css')) return;
    const css = document.createElement('link');
    css.id = 'calendly-widget-css';
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src = 'https://assets.calendly.com/assets/external/widget.js';
    js.async = true;
    js.onload = initCalendly;
    document.body.appendChild(js);
  }
  if ('requestIdleCallback' in window) {
    requestIdleCallback(loadCalendly, { timeout: 2500 });
  } else {
    setTimeout(loadCalendly, 1500);
  }

  // ---------- Footer year ----------
  const yEl = document.getElementById('year');
  if (yEl) yEl.textContent = String(new Date().getFullYear());

  // ---------- Ocultar FAB cuando el CTA final es visible ----------
  const fab = document.querySelector('.fab-wa');
  const ctaBtn = document.querySelector('#cta-final-btn');
  if (fab && ctaBtn) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        fab.style.opacity = e.isIntersecting ? '0' : '';
        fab.style.pointerEvents = e.isIntersecting ? 'none' : '';
      });
    }, { threshold: 0.4 });
    obs.observe(ctaBtn);
  }
})();
