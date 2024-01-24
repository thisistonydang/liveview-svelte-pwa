type KeyboardEventCallback = (event: KeyboardEvent) => void;

export function onKeydown(element: HTMLElement, callbackFunction: KeyboardEventCallback) {
  function onKeydownHandler(event: KeyboardEvent) {
    callbackFunction(event);
  }

  element.addEventListener("keydown", onKeydownHandler);

  return {
    update(newCallbackFunction: KeyboardEventCallback) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      element.removeEventListener("keydown", onKeydownHandler);
    },
  };
}
