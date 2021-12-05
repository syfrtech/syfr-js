import {
  SyfrDebugEvent,
  SyfrValidEvent,
  SyfrRequestEvent,
  SyfrTransmitEvent,
  SyfrInvalidEvent,
} from "./types";

/**
 * Each static function creates a CustomEvent and immediately dispatches
 * These should be called by SyfrForm according to the timing indicated
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * @see SyfrForm
 *
 * @example
 * window.addEventListener("DOMContentLoaded", (event) => {
 *
 * // automatically attempt to use Syfr for all forms on the page
 * Array.from(document.forms).forEach((form) => {
 *
 *   // output debug events so you can see what is happening on the form
 *   form.addEventListener("debug", (event) => {
 *     console.log("debugEvent", event.detail);
 *   });
 *
 *   // output the data being sent to Syfr
 *   form.addEventListener("protect", (event) => {
 *     console.log("protectEvent", event.detail);
 *     // or perhaps activate a lock icon on the form that shows the encryption seal
 *   });
 *
 *   // get the XMLHttpRequest to monitor those events on this form
 *   form.addEventListener("request", (event) => {
 *     for (var key in event.detail) {
 *
 *       // output ALL events emitted from XMLHttpRequest for this form
 *       if (key.search("on") === 0) {
 *         event.detail.addEventListener(key.slice(2), (event) => {
 *           console.log("XHR Event", event);
 *           // or perhaps show the % uploaded in a progress bar
 *           // or perhaps change submit button to a spinner from `loadstart` until `loadend`
 *         });
 *       }
 *     }
 *   });
 *
 *   // output the data being sent to Syfr
 *   form.addEventListener("transmit", (event) => {
 *     console.log("transmitEvent", event.detail);
 *     // generaully this should not be used
 *   });
 * });
 * });
 *
 * @note to set custom validation constraints:
 * @example
 * let myForm = document.getElementById("myForm") // to manage a specific form
 * let lastName = document.getElementById("last-name");
 * if(lastName.value instanceOf number){
 *   lastName.setCustomValidity("Cannot be a number");
 *   myForm.querySelector('[type="submit"]').toggleAttribute("disabled");
 * }
 *
 * @note perhaps disable submit by default and enable when form is in a valid state
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
 */
export class SyfrEvent {
  static debug(form: HTMLFormElement, detail: SyfrDebugEvent["detail"]) {
    form.dispatchEvent(new CustomEvent("debug", { detail }) as SyfrDebugEvent);
  }

  static valid(form: HTMLFormElement, detail?: SyfrValidEvent["detail"]) {
    form.dispatchEvent(new CustomEvent("valid", { detail }) as SyfrValidEvent);
  }

  static invalid(form: HTMLFormElement, detail?: SyfrInvalidEvent["detail"]) {
    form.dispatchEvent(
      new CustomEvent("invalid", { detail }) as SyfrInvalidEvent
    );
  }

  static transmit(form: HTMLFormElement, detail: SyfrTransmitEvent["detail"]) {
    form.dispatchEvent(
      new CustomEvent("transmit", { detail }) as SyfrTransmitEvent
    );
  }

  static request(form: HTMLFormElement, detail: SyfrRequestEvent["detail"]) {
    form.dispatchEvent(
      new CustomEvent("request", { detail }) as SyfrRequestEvent
    );
  }
}
