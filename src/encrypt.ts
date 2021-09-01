import { parseJwk } from "jose/jwk/parse";
import { CompactEncrypt } from "jose/jwe/compact/encrypt";
import { SyfrJwk } from ".";

/**
 * Parse the JWK to a CryptoKey and store both in the keychain
 * @see https://github.com/panva/jose/blob/main/docs/functions/jwk_parse.parseJwk.md#readme
 */
export async function keyFromJwk(jwk: SyfrJwk) {
  let key = (await parseJwk(jwk, "RSA-OAEP")) as CryptoKey;
  return key;
}

/**
 * Returns a compactJwe string
 * @see https://www.rfc-editor.org/rfc/rfc7516.html#section-4.1.12
 * @see https://github.com/panva/jose/blob/main/docs/classes/jwe_compact_encrypt.CompactEncrypt.md#readme
 */
export async function makeCompactJwe(
  kid: string,
  key: CryptoKey,
  cty: string,
  byteArr: Uint8Array,
  cids?: string[]
) {
  let protectedHeader = {
    alg: "RSA-OAEP",
    enc: "A256GCM",
    kid,
    cty,
    cids,
  };
  cids ?? delete protectedHeader.cids;
  let jwe = await new CompactEncrypt(byteArr)
    .setProtectedHeader(protectedHeader)
    .encrypt(key);
  return jwe;
}
