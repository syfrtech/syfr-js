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
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @see https://github.com/syfrapp/api/issues/103
 */
export async function pushToApi(payload: FormData) {
  let request = new XMLHttpRequest();
  request.open("POST", "https://develop-api.syfr.app/rest/pub/entry");
  request.onload = function (oEvent) {
    console.log(request, oEvent);
  };
  request.send(payload);
}
