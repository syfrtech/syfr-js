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
} & Required<Pick<JWK, "kid" | "alg">>;

/**
 * @see https://github.com/syfrapp/api/issues/101
 */
export async function fetchFromApi(id: string) {
  let response = await fetch(
    "https://develop-api.syfr.app/rest/pub/form/" + id,
    { method: "GET" }
  );
  return (await response.json()) as { publicJwk: SyfrJwk; whiteLabel: boolean };
}

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @see https://github.com/syfrapp/api/issues/103
 */
export async function pushToApi(payload: FormData, form: HTMLFormElement) {
  let request = new XMLHttpRequest();
  form.dispatchEvent(new CustomEvent("request", { detail: request }));
  request.open("POST", "https://develop-api.syfr.app/rest/pub/entry");
  request.send(payload);
}
