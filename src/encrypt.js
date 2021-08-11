import { parseJwk } from "jose/jwk/parse";
import { CompactEncrypt } from "jose/jwe/compact/encrypt";

/**
 * @type {{string:{jwk:JsonWebKey,key:CryptoKey}}} keychain a map of form ids and their keys
 * each value is an object with the jwk and CryptoKey {jwk,key}
 */
let keychain = {};

/**
 * Parse the JWK to a CryptoKey and store both in the keychain
 * @see https://github.com/panva/jose/blob/main/docs/functions/jwk_parse.parseJwk.md#readme
 *
 * @param {*} jwk json web key
 * @param {*} id the Syfr form id
 */
export async function registerJwk(jwk, id) {
  let key = await parseJwk(jwk, "RSA-OAEP");
  keychain[id] = { jwk, key };
}

/**
 * Returns a compactJwe string
 * @see https://www.rfc-editor.org/rfc/rfc7516.html#section-4.1.12
 * @see https://github.com/panva/jose/blob/main/docs/classes/jwe_compact_encrypt.CompactEncrypt.md#readme
 *
 * @param {string} id the Syfr form id
 * @param {Uint8Array} byteArr
 * @param {string} cty the content type @see https://www.iana.org/assignments/media-types/media-types.xhtml
 */
export async function makeCompactJwe(id, byteArr, cty) {
  let jwe = await new CompactEncrypt(byteArr)
    .setProtectedHeader({
      alg: "RSA-OAEP",
      enc: "A256GCM",
      kid: keychain[id].jwk.kid,
      cty,
    })
    .encrypt(keychain[id].key);
  return jwe;
}
