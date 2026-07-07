'use strict';

/**
 * Fallback lazy-loading for older browsers that don't support
 * native loading="lazy". Modern browsers skip this entirely (cheap check).
 */
(function LazyLoad() {

  function init() {
    const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;
    if (supportsNativeLazy) return; // native lazy loading already handles it

    const images = Helpers.qsa('img[loading="lazy"]');
    if (!images.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    images.forEach(img => observer.observe(img));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
