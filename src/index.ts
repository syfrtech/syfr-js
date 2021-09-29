import { SyfrForm } from "./form";

/**
 * Check every form for the `data-syfrId` attribute
 * `data-syfrId` attribute will trigger processTheForm() on submit
 *
 * @note data-syfr-id is converted to camelCase: syfrId
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset#name_conversion
 */
export function autoInit(options: SyfrForm["options"]) {
  let formsCollection = document.forms; // https://developer.mozilla.org/en-US/docs/Web/API/Document/forms
  Array.from(formsCollection).forEach((form) => {
    new SyfrForm(form, options);
  });
}

export function init(form: HTMLFormElement, options: SyfrForm["options"]) {
  return new SyfrForm(form, options);
}
