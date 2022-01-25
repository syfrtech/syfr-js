import { SyfrJwk } from "./request";
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
 * Parse the JWK to a CryptoKey and store both in the keychain
 * @see https://github.com/panva/jose/blob/main/docs/functions/key_import.importJWK.md#readme
 */
export declare function keyFromJwk(jwk: SyfrJwk): Promise<CryptoKey>;
/**
 * Returns a compactJwe string
 * @see https://www.rfc-editor.org/rfc/rfc7516.html#section-4.1.12
 * @see https://github.com/panva/jose/blob/main/docs/classes/jwe_compact_encrypt.CompactEncrypt.md#readme
 */
export declare function makeCompactJwe(jwk: SyfrJwk, key: CryptoKey, cty: string, byteArr: Uint8Array, cids?: JweCid[]): Promise<string>;
