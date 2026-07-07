'use strict';

/**
 * Main entry point.
 * All feature modules self-initialize on DOMContentLoaded (see each module file),
 * so this file is intentionally light — it only handles things that don't
 * belong in a dedicated module and must run on every page.
 */
(function Main() {

  function setCurrentYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function setupNewsletterForm() {
    const form = Helpers.qs('#newsletterForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const result = Validators.email(emailInput.value);

      if (!result.valid) {
        emailInput.classList.add('is-invalid');
        return;
      }
      emailInput.classList.remove('is-invalid');

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Joined!';
      btn.disabled = true;
      emailInput.value = '';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 2500);
    });
  }

  function logBuildInfo() {
    // Harmless, helps confirm which deploy is live when debugging via console.
    console.info(
      `%c${APP_CONFIG.SITE_NAME}%c — site loaded`,
      'color:#0a66ff;font-weight:bold;',
      'color:inherit;'
    );
  }

  function init() {
    setCurrentYear();
    setupNewsletterForm();
    logBuildInfo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
