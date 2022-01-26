import { SyfrClass } from ".";
import { JweMap } from "./class";
/**
 * Valid `CustomEvent.detail` indicates users can validate your form encryption with Syfr.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
declare type SyfrValidEventDetail = SyfrClass["response"];
/**
 * Emitted when Syfr has loaded the form's public `CryptoKey`
 */
export declare type SyfrValidEvent = CustomEvent<SyfrValidEventDetail>;
/**
 * Transmit `CustomEvent.detail` provides an UNSTABLE a way to create your own webhooks.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
declare type SyfrBeforeSendEventDetail = {
    jwes: JweMap;
    payload: FormData;
};
/**
 * Emitted immediately before `XMLHttpRequest.send()`
 */
export declare type SyfrBeforeSendEvent = CustomEvent<SyfrBeforeSendEventDetail>;
/**
 * Receive `CustomEvent.detail` provides the XMLHttpRequest for the form.
 * Monitor upload, show errors, handle success, and more
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
declare type SyfrSendEventDetail = XMLHttpRequest;
/**
 * Emitted when an XMLHttpRequest is created
 */
export declare type SyfrSendEvent = CustomEvent<SyfrSendEventDetail>;
/**
 * Each static function creates a CustomEvent and immediately dispatched
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * for examples, @see SyfrClass
 */
export declare class SyfrEvent {
    static valid: (form: HTMLFormElement, detail: ({
        publicJwk: import("./request").SyfrJwk;
        whiteLabel: boolean;
    } & {
        publicKey: CryptoKey;
    }) | undefined) => void;
    static beforeSend: (form: HTMLFormElement, detail: SyfrBeforeSendEventDetail) => void;
    static send: (form: HTMLFormElement, detail: XMLHttpRequest) => void;
}
export {};
