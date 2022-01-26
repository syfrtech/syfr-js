import { SyfrClass } from ".";
import { JweMap } from "./class";

/**
 * Valid `CustomEvent.detail` indicates users can validate your form encryption with Syfr.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
type SyfrValidEventDetail = SyfrClass["response"];

/**
 * Emitted when Syfr has loaded the form's public `CryptoKey`
 */
export type SyfrValidEvent = CustomEvent<SyfrValidEventDetail>;

/**
 * Transmit `CustomEvent.detail` provides an UNSTABLE a way to create your own webhooks.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
type SyfrBeforeSendEventDetail = {
  jwes: JweMap;
  payload: FormData;
};

/**
 * Emitted immediately before `XMLHttpRequest.send()`
 */
export type SyfrBeforeSendEvent = CustomEvent<SyfrBeforeSendEventDetail>;

/**
 * Receive `CustomEvent.detail` provides the XMLHttpRequest for the form.
 * Monitor upload, show errors, handle success, and more
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
type SyfrSendEventDetail = XMLHttpRequest;

/**
 * Emitted when an XMLHttpRequest is created
 */
export type SyfrSendEvent = CustomEvent<SyfrSendEventDetail>;

/**
 * Each static function creates a CustomEvent and immediately dispatched
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * for examples, @see SyfrClass
 */
export class SyfrEvent {
  static valid = dispatchEventFactory<SyfrValidEvent>("syfr_valid");

  static beforeSend =
    dispatchEventFactory<SyfrBeforeSendEvent>("syfr_beforeSend");

  static send = dispatchEventFactory<SyfrSendEvent>("syfr_beforeSend");
}

function dispatchEventFactory<E extends CustomEvent>(name: string) {
  return (form: HTMLFormElement, detail: E["detail"]) => {
    form.dispatchEvent(new CustomEvent(name, { detail }) as E);
  };
}
