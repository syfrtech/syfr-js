import { publicJwk as staticJwk } from "../tests/js/keygen"; //temporary for development
import { SyfrFormPayload } from "./types";

/**
 * stub needs to be replaced with actual fetch from syfr api
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 */
export async function fetchJwk(id: string) {
  return staticJwk;
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
