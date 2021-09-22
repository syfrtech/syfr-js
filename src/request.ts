import { SyfrFormPayload } from "./types";

/**
 * @see https://github.com/syfrapp/api/issues/101
 */
export async function fetchJwk(id: string) {
  try {
    let response = await fetch(
      "https://develop-api.syfr.app/rest/pub/form/" + id,
      { method: "GET" }
    );
    let result = await response.json();
    return result.publicJwk;
  } catch (e) {
    console.error(e);
  }
}

/**
 * stub needs to send to syfr api
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 *
 * @param {Object} payload the data going to Syfr
 * @property {string} payload.data the jwe of the form and its contents
 * @property {string[]} payload.files an array of jwes (one for each file)
 */
export async function pushToApi(payload: SyfrFormPayload) {
  console.log("payload", payload);
}
