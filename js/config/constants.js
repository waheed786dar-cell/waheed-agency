'use strict';

/**
 * Global constants used across the site.
 * Loaded first, before any other script.
 */
const APP_CONFIG = Object.freeze({
  SITE_NAME: 'Waheed Agency',
  SITE_URL: 'https://waheed786dar-cell.github.io/waheed-agency',
  CONTACT_EMAIL: 'waheed786dar@gmail.com',

  BREAKPOINTS: Object.freeze({
    mobile: 480,
    tablet: 768,
    laptop: 1024,
    desktop: 1280
  }),

  ANIMATION: Object.freeze({
    scrollThreshold: 0.15,   // IntersectionObserver trigger point
    countUpDuration: 1800,   // ms for stat counters
    debounceDelay: 150       // ms for scroll/resize debouncing
  }),

  STORAGE_KEYS: Object.freeze({
    theme: 'wa_theme_preference'
  }),

  FORM: Object.freeze({
    maxNameLength: 100,
    maxMessageLength: 2000,
    emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  })
});

// Expose globally (no module bundler in this static setup)
window.APP_CONFIG = APP_CONFIG;
