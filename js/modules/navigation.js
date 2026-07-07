'use strict';

/**
 * Handles: sticky navbar scroll state, mobile menu toggle,
 * mobile dropdown expand, and closing menu on outside click / Escape.
 */
(function Navigation() {

  function init() {
    const navbar = Helpers.qs('#navbar');
    const navToggle = Helpers.qs('#navToggle');
    const navLinks = Helpers.qs('#navLinks');

    if (!navbar) return;

    // ---- Sticky navbar shadow on scroll ----
    const onScroll = Helpers.throttle(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ---- Mobile menu toggle ----
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Close menu when a nav link is clicked (mobile)
      Helpers.qsa('.navbar-link', navLinks).forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    // ---- Mobile dropdown (Services) expand on tap ----
    Helpers.qsa('.navbar-dropdown').forEach(dropdown => {
      const trigger = Helpers.qs('.navbar-link', dropdown);
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          dropdown.classList.toggle('open');
        }
      });
    });

    // ---- Close mobile menu with Escape key ----
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // ---- Mark active link based on current path ----
    const currentPath = window.location.pathname.replace(/\/index\.html$/, '/');
    Helpers.qsa('.navbar-link').forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath) {
        link.classList.add('active');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
