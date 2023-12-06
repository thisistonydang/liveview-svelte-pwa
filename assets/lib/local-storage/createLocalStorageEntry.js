/**
 * Create a localStorage entry with given key name and version. If an entry with
 * the given name key is already present, that entry is deleted and a new entry
 * is created.
 *
 * @returns JSON parsed value of the created localStorage entry (an object with
 *          a version key).
 */
export function createLocalStorageEntry(
  key: string,
  version: string
): {
  version: string;
} {
  // Remove any existing entry with given key name.
  localStorage.removeItem(key);

  // Create entry with given key name and the set the value to an object with
  // the given version.
  const value = { version };
  localStorage.setItem(key, JSON.stringify(value));

  return value;
}
