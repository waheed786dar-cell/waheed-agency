'use strict';

/**
 * Form field validators. Each function returns:
 * { valid: boolean, message: string }
 */
const Validators = (() => {

  function required(value, fieldName = 'This field') {
    const valid = value !== null && value !== undefined && value.trim().length > 0;
    return { valid, message: valid ? '' : `${fieldName} is required.` };
  }

  function email(value) {
    const valid = APP_CONFIG.FORM.emailRegex.test(value.trim());
    return { valid, message: valid ? '' : 'Please enter a valid email address.' };
  }

  function minLength(value, min, fieldName = 'This field') {
    const valid = value.trim().length >= min;
    return { valid, message: valid ? '' : `${fieldName} must be at least ${min} characters.` };
  }

  function maxLength(value, max, fieldName = 'This field') {
    const valid = value.trim().length <= max;
    return { valid, message: valid ? '' : `${fieldName} must be under ${max} characters.` };
  }

  /** Honeypot check: if this hidden field has any value, it's very likely a bot */
  function honeypot(value) {
    const valid = !value || value.trim().length === 0;
    return { valid, message: valid ? '' : 'Spam detected.' };
  }

  return { required, email, minLength, maxLength, honeypot };
})();

window.Validators = Validators;
