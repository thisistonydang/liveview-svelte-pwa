/**
 * Store current scroll position in local storage.
 *
 * @param {string} scrollPositionKey
 */
export function rememberScrollPosition(scrollPositionKey) {
  localStorage.setItem(scrollPositionKey, JSON.stringify({ x: window.scrollX, y: window.scrollY }));
}
