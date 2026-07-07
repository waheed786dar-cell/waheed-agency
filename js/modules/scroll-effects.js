'use strict';

/**
 * Handles scroll-based UI effects:
 * - reveal-on-scroll (.animate-on-scroll elements)
 * - animated stat counters (.stat-number[data-count])
 * Uses IntersectionObserver — no scroll-event polling, so it's cheap on CPU/battery.
 */
(function ScrollEffects() {

  function setupRevealOnScroll() {
    const targets = Helpers.qsa('.animate-on-scroll');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => el.classList.add('in-view'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: APP_CONFIG.ANIMATION.scrollThreshold, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(el => observer.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const duration = APP_CONFIG.ANIMATION.countUpDuration;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      el.textContent = Helpers.formatNumber(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = Helpers.formatNumber(target) + '+';
      }
    }
    requestAnimationFrame(tick);
  }

  function setupCounters() {
    const counters = Helpers.qsa('.stat-number[data-count]');
    if (!counters.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  }

  function init() {
    setupRevealOnScroll();
    setupCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
