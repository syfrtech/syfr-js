import { SyfrForm } from "./form";

/**
 * Released according to Semantic Version
 * @see https://semver.org/
 *
 * Adheres to Conventional Commits
 * @see https://www.conventionalcommits.org/en/v1.0.0/
 *
 * Check every form for the `data-syfrId` attribute
 * `data-syfrId` attribute will trigger processTheForm() on submit
 *
 * @note data-syfr-id is converted to camelCase: syfrId
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset#name_conversion
 */
window.addEventListener("DOMContentLoaded", () => {
  let formsCollection = document.forms; // https://developer.mozilla.org/en-US/docs/Web/API/Document/forms
  Array.from(formsCollection).forEach((form) => {
    new SyfrForm(form);
    return;
  });
});

export { SyfrForm as Form };
