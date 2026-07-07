'use strict';

/**
 * Generic contact-form handler.
 * Validates client-side, shows inline errors, and submits via fetch
 * to a backend endpoint (Firebase Cloud Function / Firestore) once configured.
 * Includes a honeypot field check for basic bot protection.
 */
(function FormHandler() {

  function showError(input, message) {
    input.classList.add('is-invalid');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('is-invalid');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.textContent = '';
  }

  function validateField(input) {
    const value = input.value;
    const name = input.name;
    let result = { valid: true, message: '' };

    if (input.hasAttribute('required')) {
      result = Validators.required(value, input.dataset.label || name);
      if (!result.valid) { showError(input, result.message); return false; }
    }

    if (input.type === 'email' && value.trim()) {
      result = Validators.email(value);
      if (!result.valid) { showError(input, result.message); return false; }
    }

    if (name === 'message' && value.trim()) {
      result = Validators.maxLength(value, APP_CONFIG.FORM.maxMessageLength, 'Message');
      if (!result.valid) { showError(input, result.message); return false; }
    }

    clearError(input);
    return true;
  }

  function validateForm(form) {
    const fields = Helpers.qsa('input, textarea, select', form)
      .filter(el => el.name && el.type !== 'submit' && !el.classList.contains('form-honeypot'));

    let isValid = true;
    fields.forEach(field => {
      if (!validateField(field)) isValid = false;
    });

    // Honeypot check (silent — don't reveal to bots that they were caught)
    const honeypotField = form.querySelector('.form-honeypot input, input[name="website"]');
    if (honeypotField) {
      const hp = Validators.honeypot(honeypotField.value);
      if (!hp.valid) isValid = false;
    }

    return isValid;
  }

  async function submitForm(form) {
    const submitBtn = form.querySelector('[type="submit"]');
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    if (submitBtn) {
      submitBtn.classList.add('btn-loading');
      submitBtn.disabled = true;
    }

    try {
      // Placeholder endpoint — replace with real Firebase Function URL once deployed.
      const endpoint = form.dataset.endpoint || '/api/contact';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Submission failed');

      showSuccessMessage(form);
      form.reset();
    } catch (err) {
      showFormLevelError(form, 'Something went wrong. Please try again or email us directly.');
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove('btn-loading');
        submitBtn.disabled = false;
      }
    }
  }

  function showSuccessMessage(form) {
    let successBox = form.querySelector('.form-success-box');
    if (!successBox) {
      successBox = document.createElement('div');
      successBox.className = 'form-success-box mt-4';
      form.appendChild(successBox);
    }
    successBox.textContent = '✓ Message sent successfully. We\'ll get back to you soon.';
    successBox.style.display = 'flex';
  }

  function showFormLevelError(form, message) {
    let errorBox = form.querySelector('.form-level-error');
    if (!errorBox) {
      errorBox = document.createElement('div');
      errorBox.className = 'form-level-error text-sm mt-4';
      errorBox.style.color = 'var(--color-error)';
      form.appendChild(errorBox);
    }
    errorBox.textContent = message;
  }

  function attachForm(form) {
    // Real-time validation on blur
    Helpers.qsa('input, textarea, select', form).forEach(field => {
      field.addEventListener('blur', () => {
        if (field.name && !field.classList.contains('form-honeypot')) validateField(field);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        submitForm(form);
      }
    });
  }

  function init() {
    Helpers.qsa('form[data-validate]').forEach(attachForm);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
