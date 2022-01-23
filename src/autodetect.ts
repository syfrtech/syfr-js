import { SyfrClass } from "./class";

/**
 * Check every form for the `data-syfrId` attribute
 * `data-syfrId` attribute will trigger processTheForm() on submit
 *
 * @note data-syfr-id is converted to camelCase: syfrId
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset#name_conversion
 */
function autoDetectForms() {
  window.addEventListener("DOMContentLoaded", () => {
    let formsCollection = document.forms; // https://developer.mozilla.org/en-US/docs/Web/API/Document/forms
    Array.from(formsCollection).forEach((form) => {
      try {
        new SyfrClass(form);
      } catch (e) {
        console.warn(e);
      }
      return;
    });
  });
}

autoDetectForms();
