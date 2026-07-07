'use strict';

/**
 * Accessible FAQ accordion.
 * Click toggles open/close; only one item open at a time per list.
 * Uses max-height animation (already defined in services.css).
 */
(function FaqAccordion() {

  function toggleItem(item, allItems) {
    const isOpen = item.classList.contains('open');
    const answer = item.querySelector('.faq-answer');
    const button = item.querySelector('.faq-question');

    // Close all other items in the same list
    allItems.forEach(other => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      }
    });

    if (isOpen) {
      item.classList.remove('open');
      answer.style.maxHeight = null;
      button.setAttribute('aria-expanded', 'false');
    } else {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      button.setAttribute('aria-expanded', 'true');
    }
  }

  function init() {
    const lists = Helpers.qsa('.faq-list');
    lists.forEach(list => {
      const items = Helpers.qsa('.faq-item', list);
      items.forEach(item => {
        const button = item.querySelector('.faq-question');
        button.addEventListener('click', () => toggleItem(item, items));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
