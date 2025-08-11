// Date helpers used across the application.  Functions here avoid
// repeatedly creating new Date objects in components.  All dates are
// interpreted relative to the local timezone.

/**
 * Returns the number of days from today until the given date.
 * If the date is in the past, the result may be negative.  The input
 * should be a YYYY‑MM‑DD string.
 *
 * @param {string} dateStr
 * @returns {number}
 */
export function daysUntil(dateStr) {
  const target = new Date(dateStr);
  const today = new Date();
  // Clear time portions to calculate whole days
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.ceil(diff / (24 * 60 * 60 * 1000));
}

/**
 * Returns a formatted time string in 12‑hour or 24‑hour format based on
 * locale.  Used in the dashboard clock.
 *
 * @param {string} lang – ISO locale, e.g. 'en-US' or 'ar-SA'.
 */
export function getCurrentTime(lang = 'en-US') {
  return new Date().toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}