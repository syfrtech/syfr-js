import { importJWK, CompactEncrypt } from "jose";
import { SyfrJwk } from "./request";

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
 * Parse the JWK to a CryptoKey and store both in the keychain
 * @see https://github.com/panva/jose/blob/main/docs/functions/key_import.importJWK.md#readme
 */
export async function keyFromJwk(jwk: SyfrJwk) {
  let key = (await importJWK(jwk, jwk.alg)) as CryptoKey;
  return key;
}

/**
 * Returns a compactJwe string
 * @see https://www.rfc-editor.org/rfc/rfc7516.html#section-4.1.12
 * @see https://github.com/panva/jose/blob/main/docs/classes/jwe_compact_encrypt.CompactEncrypt.md#readme
 */
export async function makeCompactJwe(
  jwk: SyfrJwk,
  key: CryptoKey,
  cty: string,
  byteArr: Uint8Array,
  cids?: JweCid[]
) {
  let protectedHeader = {
    alg: jwk.alg,
    enc: "A256GCM",
    kid: jwk.kid,
    cty,
    cids,
  };
  cids ?? delete protectedHeader.cids;
  let jwe = await new CompactEncrypt(byteArr)
    .setProtectedHeader(protectedHeader)
    .encrypt(key);
  return jwe as CompactJwe;
}
