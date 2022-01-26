import { SyfrClass } from ".";
import { JweMap } from "./class";

/**
 * Emitted when Syfr has loaded the form's public `CryptoKey`
 * Valid `CustomEvent.detail` indicates users can validate your form encryption with Syfr.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
export type SyfrValidEvent = CustomEvent<SyfrClass["response"]>;

/**
 * Emitted when the form data has been encrypted
 * Transmit `CustomEvent.detail` provides an UNSTABLE a way to create your own webhooks.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
export type SyfrEncryptedEvent = CustomEvent<JweMap>;

/**
 * Emitted when an XMLHttpRequest is created
 * Receive `CustomEvent.detail` provides the XMLHttpRequest for the form.
 * Monitor upload, show errors, handle success, and more
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
export type SyfrBeforeSendEvent = CustomEvent<XMLHttpRequest>;

/**
 * Emitted after an XMLHttpRequest was sent to Syfr
 */
export type SyfrAfterSendEvent = CustomEvent<XMLHttpRequest>;

export type SyfrEventTypes = {
  valid: SyfrValidEvent;
  encrypted: SyfrEncryptedEvent;
  beforeSend: SyfrBeforeSendEvent;
  afterSend: SyfrAfterSendEvent;
};

export const SyfrEventMap = {
  valid: "syfr_valid" as const,
  encrypted: "syfr_encrypted" as const,
  beforeSend: "syfr_beforeSend" as const,
  afterSend: "syfr_afterSend" as const,
};

/**
 * Each static function creates a CustomEvent and immediately dispatched
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * for examples, @see SyfrClass
 */
export const SyfrEvent = {
  valid: dispatchEventFactory<SyfrEventTypes["valid"]>(SyfrEventMap.valid),
  encrypted: dispatchEventFactory<SyfrEventTypes["encrypted"]>(
    SyfrEventMap.encrypted
  ),
  beforeSend: dispatchEventFactory<SyfrEventTypes["beforeSend"]>(
    SyfrEventMap.beforeSend
  ),
  afterSend: dispatchEventFactory<SyfrEventTypes["afterSend"]>(
    SyfrEventMap.afterSend
  ),
};

function dispatchEventFactory<E extends CustomEvent>(name: string) {
  return (form: HTMLFormElement, detail: E["detail"]) => {
    form.dispatchEvent(new CustomEvent(name, { detail }));
  };
}
