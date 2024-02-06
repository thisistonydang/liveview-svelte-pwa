type CallBackFunction = (event: PointerEvent) => void;

export function clickOutside(element: HTMLElement, callbackFunction: CallBackFunction) {
  function clickOutsideHandler(event: PointerEvent) {
    if (!(event.target instanceof Node)) return;

    if (!element.contains(event.target)) {
      callbackFunction(event);
    }
  }

  setTimeout(() => {
    document.documentElement.addEventListener("click", clickOutsideHandler);
  }, 0);

  return {
    update(newCallbackFunction: CallBackFunction) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      document.documentElement.removeEventListener("click", clickOutsideHandler);
    },
  };
}
