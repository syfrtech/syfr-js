/*
 * JWK type is better than JsonWebKey type.
 * ex: JsonWebKey type doesn't recognize `kid` property.
 * @see https://github.com/microsoft/TypeScript/issues/26854
 */
import { JWK } from "jose/webcrypto/types";

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
 * @see JweCid
 */
export type JweMap = { [cid: JweCid]: CompactJwe };

type SyfrDebugDetail = any;
type SyfrTransmitDetail = {
  jwes: JweMap;
  payload: FormData;
};
type SyfrRequestDetail = XMLHttpRequest;
type SyfrProtectionDetail = { id: string; validateUrl: string };

/**
 * Emitted to help developers debug.
 * Code should not depend on the content of the `event.detail` which
 * can be any type and may change at any time.
 */
export type SyfrDebugEvent = CustomEvent<SyfrDebugDetail>;

/**
 * Emitted when Syfr has loaded the form's public `CryptoKey`
 * Confirms that the form submissions will be protected with Syfr
 */
export type SyfrProtectionEvent = CustomEvent<SyfrProtectionDetail>;

/**
 * Emitted immediately before `XMLHttpRequest.send()`
 * Prior to send() to avoid potential exceptions
 * Discouraged: provides a way to create your own webhooks to send the data
 */
export type SyfrTransmitEvent = CustomEvent<SyfrTransmitDetail>;

/**
 * Emitted when an XMLHttpRequest is created
 * Monitor upload, show errors, handle success, and more
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest#events
 */
export type SyfrRequestEvent = CustomEvent<SyfrRequestDetail>;
