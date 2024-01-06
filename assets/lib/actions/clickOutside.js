export function clickOutside(element, callbackFunction) {
  function clickOutsideHandler(event) {
    if (!element.contains(event.target)) {
      callbackFunction(event);
    }
  }

  setTimeout(() => {
    document.body.addEventListener("click", clickOutsideHandler);
  }, 0);

  return {
    update(newCallbackFunction) {
      callbackFunction = newCallbackFunction;
    },
    destroy() {
      document.body.removeEventListener("click", clickOutsideHandler);
    },
  };
}
