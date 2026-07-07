'use strict';

/**
 * Dark/Light theme toggle.
 * Respects saved preference, falls back to OS preference (prefers-color-scheme).
 * Applies theme BEFORE paint (see inline script note below) to avoid flash —
 * this module just wires up the toggle button after that initial state is set.
 */
(function ThemeToggle() {

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    Helpers.setStorage(APP_CONFIG.STORAGE_KEYS.theme, theme);
    const btn = Helpers.qs('#themeToggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function getInitialTheme() {
    const saved = Helpers.getStorage(APP_CONFIG.STORAGE_KEYS.theme);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function init() {
    applyTheme(getInitialTheme());

    const btn = Helpers.qs('#themeToggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    // React to OS-level theme change if user hasn't manually chosen one
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      const hasManualChoice = Helpers.getStorage(APP_CONFIG.STORAGE_KEYS.theme);
      if (!hasManualChoice) applyTheme(e.matches ? 'dark' : 'light');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
