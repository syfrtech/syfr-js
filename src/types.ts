/*
 * JWK type is better than JsonWebKey type.
 * ex: JsonWebKey type doesn't recognize `kid` property.
 * @see https://github.com/microsoft/TypeScript/issues/26854
 */
import { JWK } from "jose";

/**
 * JWK / JsonWebKey extended with Syfr requirements
 *
 * `kid` must use sha256 fingerprinting (except local key): @see https://github.com/syfrapp/api/issues/77
 * `use` and `key_ops` required: @see https://github.com/syfrapp/api/issues/84
 * `jwk` spec: @see https://datatracker.ietf.org/doc/html/rfc7517
 * `kid` spec: @see https://datatracker.ietf.org/doc/html/rfc7638
 */
export type SyfrJwk = JWK & {
  use: "enc";
  key_ops: Array<"wrapKey" | "unwrapKey">;
  kid: string;
};

/**
 * @param data is a map of form data, but Files must be converted to FileJweMeta
 * @param code is the serialized HTML representing the form
 */
export type SyfrJweContent = {
  data: { [k: string]: string };
  code: String;
};

/**
 * Similar to File but drops file streams (no .text(), no .arrayBuffer(), .etc)
 */
export type FileJweMeta = {
  name: File["name"];
  lastModified: File["lastModified"];
  type: File["type"];
  cids: string[];
};

/**
 * UUID v4
 * @see https://datatracker.ietf.org/doc/html/rfc4122
 */
export type Uuid = string;

/**
 * A JWE per RFC 7516 with compact serialization
 * @see https://www.rfc-editor.org/rfc/rfc7516.html#section-7.1
 */
export type CompactJwe = string;

/**
 * `cid` is Authentication Tag from Jwe.  We can also filter by kid to locate content
 * The Authentication Tag is a secure hash which should be unique (128-bits)
 * it is the last segment of a compact JWE
 * @see https://datatracker.ietf.org/doc/html/rfc7516/appendix-B.7
 *
 * Possibly consider this CID implementation in the future
 * @see https://github.com/multiformats/cid
 */
export type JweCid = string;

/**
 * An object containing CompactJWEs indexed according to their `cid`
 */
export type JweMap = { [cid: JweCid]: CompactJwe };

/**
 * Debug `CustomEvent.detail` can be anything, anytime.  Intended to assist
 * developers.  Code should never depend on its contents or timing.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
type SyfrDebugEventDetail = any;

/**
 * Emitted to help developers debug (no certain timing)
 */
export type SyfrDebugEvent = CustomEvent<SyfrDebugEventDetail>;

/**
 * Protect`CustomEvent.detail` confirms that the form submissions will be protected by Syfr.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
type SyfrProtectEventDetail = { id: string; validateUrl: string };

/**
 * Emitted when Syfr has loaded the form's public `CryptoKey`
 */
export type SyfrProtectEvent = CustomEvent<SyfrProtectEventDetail>;

/**
 * Transmit `CustomEvent.detail` provides an UNSTABLE a way to create your own webhooks.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
type SyfrTransmitEventDetail = {
  jwes: JweMap;
  payload: FormData;
};

/**
 * Emitted immediately before `XMLHttpRequest.send()`
 */
export type SyfrTransmitEvent = CustomEvent<SyfrTransmitEventDetail>;

/**
 * Request `CustomEvent.detail` provides the XMLHttpRequest for the form.
 * Monitor upload, show errors, handle success, and more
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 * @see https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent
 */
type SyfrRequestEventDetail = XMLHttpRequest;

/**
 * Emitted when an XMLHttpRequest is created
 */
export type SyfrRequestEvent = CustomEvent<SyfrRequestEventDetail>;
