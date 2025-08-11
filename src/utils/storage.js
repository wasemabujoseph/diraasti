// Simple wrapper around localStorage for JSON values.

/**
 * Loads a value from localStorage.  If the value is JSON encoded it will
 * be parsed.  If no value exists, returns the provided default.
 *
 * @param {string} key
 * @param {any} defaultValue
 */
export function load(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Could not load key ${key} from storage`, err);
    return defaultValue;
  }
}

/**
 * Saves a value to localStorage.  Objects are stringified.  Errors
 * are silently ignored.
 *
 * @param {string} key
 * @param {any} value
 */
export function save(key, value) {
  try {
    const raw = JSON.stringify(value);
    localStorage.setItem(key, raw);
  } catch (err) {
    console.warn(`Could not save key ${key} to storage`, err);
  }
}

/**
 * Removes a key from localStorage.
 *
 * @param {string} key
 */
export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Could not remove key ${key} from storage`, err);
  }
}