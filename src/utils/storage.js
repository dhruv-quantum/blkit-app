// Thin wrapper around window.localStorage. Kept in one place so it's easy to
// swap for a real backend later (see README.md, "Adding cloud sync later").

const PREFIX = "brainy-ladder:";

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Could not read "${key}" from storage`, err);
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Could not save "${key}" to storage`, err);
    return false;
  }
}

export function removeKey(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.error(`Could not remove "${key}" from storage`, err);
  }
}
