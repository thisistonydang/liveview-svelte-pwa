import { createLocalStorageEntry } from "./createLocalStorageEntry";

/**
 * Get parsed value from localStorage entry given key name and version. If entry
 * does not exist or if the entry version does not match the given version, a
 * fresh new entry is created.
 */
export function getParsedValue(key: string, version: string) {
  const value = localStorage.getItem(key);
  let parsedValue;

  if (value) {
    // If entry exists, parse entry value.
    parsedValue = JSON.parse(value);

    // If entry version does not match the given version, create a new entry.
    if (parsedValue.version !== version) {
      parsedValue = createLocalStorageEntry(key, version);
    }
  } else {
    // If entry does not exist, create a new localStorage entry.
    parsedValue = createLocalStorageEntry(key, version);
  }

  return parsedValue;
}
