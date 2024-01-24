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
    throw new Error("Element is not an HTMLElement and cannot be focused.");
  }
}

