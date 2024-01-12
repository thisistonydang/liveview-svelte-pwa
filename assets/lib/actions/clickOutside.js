export function clickOutside(element, callbackFunction) {
  function clickOutsideHandler(event) {
    if (!element.contains(event.target)) {
      callbackFunction(event);
    }
  }

  setTimeout(() => {
    document.documentElement.addEventListener("click", clickOutsideHandler);
  }, 0);

  return {
    update(newCallbackFunction) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      document.documentElement.removeEventListener("click", clickOutsideHandler);
    },
  };
}
