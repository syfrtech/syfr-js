import { SyfrClass } from ".";
import { JweMap } from "./class";
/**
 * Emitted when Syfr has loaded the form's public `CryptoKey`
 * Valid `CustomEvent.detail` indicates users can validate your form encryption with Syfr.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
export declare type SyfrValidEvent = CustomEvent<SyfrClass["response"]>;
/**
 * Emitted when the form data has been encrypted
 * Transmit `CustomEvent.detail` provides an UNSTABLE a way to create your own webhooks.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
export declare type SyfrEncryptedEvent = CustomEvent<JweMap>;
/**
 * Emitted when an XMLHttpRequest is created
 * Receive `CustomEvent.detail` provides the XMLHttpRequest for the form.
 * Monitor upload, show errors, handle success, and more
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
export declare type SyfrBeforeSendEvent = CustomEvent<XMLHttpRequest>;
/**
 * Emitted after an XMLHttpRequest was sent to Syfr
 */
export declare type SyfrAfterSendEvent = CustomEvent<XMLHttpRequest>;
export declare type SyfrEventTypes = {
    valid: SyfrValidEvent;
    encrypted: SyfrEncryptedEvent;
    beforeSend: SyfrBeforeSendEvent;
    afterSend: SyfrAfterSendEvent;
};
export declare const SyfrEventMap: {
    valid: "syfr_valid";
    encrypted: "syfr_encrypted";
    beforeSend: "syfr_beforeSend";
    afterSend: "syfr_afterSend";
};
/**
 * Each static function creates a CustomEvent and immediately dispatched
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * for examples, @see SyfrClass
 */
export declare const SyfrEvent: {
    valid: (form: HTMLFormElement, detail: ({
        publicJwk: import("./request").SyfrJwk;
        whiteLabel: boolean;
    } & {
        publicKey: CryptoKey;
    }) | undefined) => void;
    encrypted: (form: HTMLFormElement, detail: JweMap) => void;
    beforeSend: (form: HTMLFormElement, detail: XMLHttpRequest) => void;
    afterSend: (form: HTMLFormElement, detail: XMLHttpRequest) => void;
};
