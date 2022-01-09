import { JweCid, SyfrJwk } from "./types";
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
