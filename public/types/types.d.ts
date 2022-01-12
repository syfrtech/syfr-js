import { JWK } from "jose";
/**
 * JWK / JsonWebKey extended with Syfr requirements
 *
 * `kid` must use sha256 fingerprinting (except local key): @see https://github.com/syfrapp/api/issues/77
 * `use` and `key_ops` required: @see https://github.com/syfrapp/api/issues/84
 * `jwk` spec: @see https://datatracker.ietf.org/doc/html/rfc7517
 * `kid` spec: @see https://datatracker.ietf.org/doc/html/rfc7638
 */
export declare type SyfrJwk = JWK & {
    use: "enc";
    key_ops: Array<"wrapKey" | "unwrapKey">;
} & Required<Pick<JWK, "kid" | "alg">>;
export declare type SyfrJweContentItem = string | FileJweMeta | undefined;
/**
 * @param data is a map of form data, but Files must be converted to FileJweMeta
 * @param code is the serialized HTML representing the form
 */
export declare type SyfrJweContent = {
    data: {
        [k: string]: SyfrJweContentItem | SyfrJweContentItem[];
    };
    code: String;
};
/**
 * Similar to File but drops file streams (no .text(), no .arrayBuffer(), .etc)
 */
export declare type FileJweMeta = {
    name: File["name"];
    lastModified: File["lastModified"];
    type: File["type"];
    cids: string[];
};
/**
 * UUID v4
 * @see https://datatracker.ietf.org/doc/html/rfc4122
 */
export declare type Uuid = string;
/**
 * A JWE per RFC 7516 with compact serialization
 * @see https://www.rfc-editor.org/rfc/rfc7516.html#section-7.1
 */
export declare type CompactJwe = string;
/**
 * `cid` is Authentication Tag from Jwe.  We can also filter by kid to locate content
 * The Authentication Tag is a secure hash which should be unique (128-bits)
 * it is the last segment of a compact JWE
 * @see https://datatracker.ietf.org/doc/html/rfc7516/appendix-B.7
 *
 * Possibly consider this CID implementation in the future
 * @see https://github.com/multiformats/cid
 */
export declare type JweCid = string;
/**
 * An object containing CompactJWEs indexed according to their `cid`
 */
export declare type JweMap = {
    [cid: JweCid]: CompactJwe;
};
export declare type SyfrFormId = Uuid;
/**
 * Debug `CustomEvent.detail` can be anything, anytime.  Intended to assist
 * developers.  Code should never depend on its contents or timing.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
declare type SyfrDebugEventDetail = any;
/**
 * Emitted to help developers debug (no certain timing)
 */
export declare type SyfrDebugEvent = CustomEvent<SyfrDebugEventDetail>;
/**
 * Valid `CustomEvent.detail` indicates users can validate your form encryption with Syfr.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
declare type SyfrValidEventDetail = {
    id: string;
    validateUrl: string;
};
/**
 * Emitted when Syfr has loaded the form's public `CryptoKey`
 */
export declare type SyfrValidEvent = CustomEvent<SyfrValidEventDetail>;
/**
 * Transmit `CustomEvent.detail` provides an UNSTABLE a way to create your own webhooks.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
declare type SyfrTransmitEventDetail = {
    jwes: JweMap;
    payload: FormData;
};
/**
 * Emitted immediately before `XMLHttpRequest.send()`
 */
export declare type SyfrTransmitEvent = CustomEvent<SyfrTransmitEventDetail>;
/**
 * Request `CustomEvent.detail` provides the XMLHttpRequest for the form.
 * Monitor upload, show errors, handle success, and more
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
declare type SyfrRequestEventDetail = XMLHttpRequest;
/**
 * Emitted when an XMLHttpRequest is created
 */
export declare type SyfrRequestEvent = CustomEvent<SyfrRequestEventDetail>;
export {};
