import { OFFLINE_SVELTE_DIV_ID } from "./constants";

/**
 * Check if the Svelte app is mounted.
 */
export function isSvelteMounted() {
  const div = document.getElementById(OFFLINE_SVELTE_DIV_ID);

  if (div && div.dataset.mounted === "true") {
    return true;
  }

  return false;
}
