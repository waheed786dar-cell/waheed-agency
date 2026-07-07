'use strict';

/**
 * Portfolio category filter (used on portfolio/index.html).
 * Filters .portfolio-masonry-item elements by data-category attribute.
 * No page reload — pure DOM show/hide.
 */
(function PortfolioFilter() {

  function init() {
    const filterBar = Helpers.qs('.portfolio-filter-bar');
    const items = Helpers.qsa('.portfolio-masonry-item');
    if (!filterBar || !items.length) return;

    const buttons = Helpers.qsa('.filter-btn', filterBar);

    function applyFilter(category) {
      items.forEach(item => {
        const matches = category === 'all' || item.dataset.category === category;
        item.classList.toggle('hidden', !matches);
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.dataset.filter || 'all');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
