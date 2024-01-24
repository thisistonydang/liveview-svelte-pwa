interface Options {
  focusFirstElement?: boolean;
  onEscape?: () => void;
}

/**
 * Type guard to check if an element is an HTMLElement.
 */
function isHTMLElement(element: Element | HTMLElement): element is HTMLElement {
  return element instanceof HTMLElement;
}

/**
 * Focus an element or throw an error if it is not an HTMLElement.
 */
function focusElement(element: Element) {
  if (isHTMLElement(element)) {
    element.focus();
  } else {
    console.error("Element is not an HTMLElement and cannot be focused.", element);
  }
}

/**
 * Svelte action to trap focus inside an element.
 *
 * Focusable elements inside the element must be designated with a
 * `data-focusindex` attribute. This attribute should be a number, and the first
 * element to focus should have a value of 0. Example: `<button data-focusindex="0">`.
 *
 * The focusable elements can be navigated with the up/down arrow keys and tabbing.
 *
 * The escape key can be used to run a custom callback.
 *
 * @param element The element to trap focus inside.
 * @param options.focusFirstElement Whether to focus the first focusable element when created.
 * @param options.onEscape Callback to run when the escape key is pressed.
 */
export function focusTrap(
  element: HTMLElement,
  { focusFirstElement = false, onEscape = undefined }: Options,
) {
  // Get all focusable elements inside the element via the data-focusindex attribute.
  const focusableElements = Array.from(element.querySelectorAll("[data-focusindex]"));

  // Focus the first element if the option is set.
  if (focusFirstElement) {
    const firstElementToFocus = focusableElements.find(
      (el) => el.getAttribute("data-focusindex") === "0",
    );
    focusElement(firstElementToFocus);
  }

  function keydownHandler(event: KeyboardEvent) {
    const indexOfActiveElement = focusableElements.indexOf(document.activeElement);
    const previousElement =
      indexOfActiveElement === 0
        ? focusableElements[focusableElements.length - 1]
        : focusableElements[indexOfActiveElement - 1];
    const nextElement =
      indexOfActiveElement === focusableElements.length - 1
        ? focusableElements[0]
        : focusableElements[indexOfActiveElement + 1];

    switch (event.key) {
      case "Tab":
        event.preventDefault(); // Prevents tabbing out of the element

        if (event.shiftKey) {
          focusElement(previousElement);
        } else {
          focusElement(nextElement);
        }
        break;

      case "ArrowUp":
        focusElement(previousElement);
        break;

      case "ArrowDown":
        focusElement(nextElement);
        break;

      case "Escape":
        if (onEscape) {
          onEscape();
        }
        break;
    }
  }

  element.addEventListener("keydown", keydownHandler);

  return {
    update(newOptions: Options) {
      focusFirstElement = newOptions.focusFirstElement;
      onEscape = newOptions.onEscape;
    },
    destroy() {
      element.removeEventListener("keydown", keydownHandler);
    },
  };
}
