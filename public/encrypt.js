import { importJWK, CompactEncrypt } from "jose";
/**
 * Parse the JWK to a CryptoKey and store both in the keychain
 * @see https://github.com/panva/jose/blob/main/docs/functions/key_import.importJWK.md#readme
 */
export async function keyFromJwk(jwk) {
    let key = (await importJWK(jwk, jwk.alg));
    return key;
}
/**
 * Returns a compactJwe string
 * @see https://www.rfc-editor.org/rfc/rfc7516.html#section-4.1.12
 * @see https://github.com/panva/jose/blob/main/docs/classes/jwe_compact_encrypt.CompactEncrypt.md#readme
 */
export async function makeCompactJwe(jwk, key, cty, byteArr, cids) {
    let protectedHeader = {
        alg: jwk.alg,
        enc: "A256GCM",
        kid: jwk.kid,
        cty,
        cids,
    };
    cids !== null && cids !== void 0 ? cids : delete protectedHeader.cids;
    let jwe = await new CompactEncrypt(byteArr)
        .setProtectedHeader(protectedHeader)
        .encrypt(key);
    return jwe;
}
