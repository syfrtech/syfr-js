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

export type FileJweMeta = {
  name: File["name"];
  lastModified: File["lastModified"];
  type: File["type"];
  cids: string[];
};

export type SyfrForm = {
  id: string;
  jwk: SyfrJwk;
  key: CryptoKey;
  code: String;
  data: FormDataMap;
  files: string[];
  cids: string[];
};

export type Keychain = { [syfrId: string]: { jwk: SyfrJwk; key: CryptoKey } };

/** Typescript currently doesn't include native types for the following */

/**
 * Event triggered on form submission
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent
 */
export interface SubmitEvent extends Event {
  target: HTMLFormElement;
}

/**
 * Map of form data, but disallow files (which must be converted to JWE)
 * @see Object.fromEntries
 */
export type FormDataMap = { [k: string]: string };
