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
