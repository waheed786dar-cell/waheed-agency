'use strict';

/**
 * Lightweight decorative animations that aren't scroll-triggered:
 * - subtle parallax on hero visual (desktop only, respects reduced-motion)
 */
(function Animations() {

  function setupHeroParallax() {
    const visual = Helpers.qs('.hero-visual');
    if (!visual || window.innerWidth < 1024) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const onMouseMove = Helpers.throttle((e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 12;
      const y = (e.clientY / innerHeight - 0.5) * 12;
      visual.style.transform = `translate(${x}px, ${y}px)`;
    }, 30);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
  }

  function init() {
    setupHeroParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
