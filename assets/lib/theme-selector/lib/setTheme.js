import { currentTheme } from "./currentTheme.js";

/**
 * Set the theme.
 *
 * @param {"system" | "light" | "dark"} theme
 * @returns {void}
 */
export function setTheme(theme) {
  currentTheme.set(theme);

  if (theme === "system") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("theme");
    return;
  }

  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", JSON.stringify(theme));
}
