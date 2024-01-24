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

