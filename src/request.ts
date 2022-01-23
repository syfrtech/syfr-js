import { SyfrJwk } from "./types";

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
