'use strict';

/**
 * General-purpose utility functions.
 * Pure functions only — no DOM side effects here.
 */
const Helpers = (() => {

  /** Debounce: delays execution until after `wait` ms of inactivity */
  function debounce(fn, wait = 150) {
    let timeoutId;
    return function debounced(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  /** Throttle: ensures fn runs at most once per `limit` ms */
  function throttle(fn, limit = 100) {
    let inThrottle = false;
    return function throttled(...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => { inThrottle = false; }, limit);
      }
    };
  }

  /** Safely query a single element, returns null if not found (no throw) */
  function qs(selector, scope = document) {
    return scope.querySelector(selector);
  }

  /** Query all elements as a real array (not NodeList) */
  function qsa(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  /** Checks if an element is currently within the viewport */
  function isInViewport(el, offset = 0) {
    const rect = el.getBoundingClientRect();
    return rect.top <= (window.innerHeight - offset) && rect.bottom >= 0;
  }

  /** Basic HTML-escaping to avoid injecting raw user input into the DOM */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /** Formats a number with commas, e.g. 12000 -> "12,000" */
  function formatNumber(num) {
    return Number(num).toLocaleString('en-US');
  }

  /** Reads a value from localStorage safely (handles disabled storage / private mode) */
  function getStorage(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch (err) {
      return fallback;
    }
  }

  /** Writes a value to localStorage safely */
  function setStorage(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (err) {
      return false;
    }
  }

  return {
    debounce,
    throttle,
    qs,
    qsa,
    isInViewport,
    escapeHTML,
    formatNumber,
    getStorage,
    setStorage
  };
})();

window.Helpers = Helpers;
