export function onEscape(element: HTMLElement, callbackFunction: () => void) {
  function onEscapeHandler(event: KeyboardEvent) {
    if (event.key === "Escape") {
      callbackFunction();
    }
  }

  element.addEventListener("keydown", onEscapeHandler);

  return {
    update(newCallbackFunction: () => void) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      element.removeEventListener("keydown", onEscapeHandler);
    },
  };
}
