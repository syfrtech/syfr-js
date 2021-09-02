import { fetchJwk, pushToApi } from "./request";
import { keyFromJwk, makeCompactJwe } from "./encrypt";
import {
  SyfrForm,
  Keychain,
  SubmitEvent,
  FileJweMeta,
  SyfrJweContent,
} from "./types";

/** a map of syfr form ids and their keys */
let keychain: Keychain = {};

/**
 * Check every form for the `data-syfrId` attribute
 * `data-syfrId` attribute will trigger processTheForm() on submit
 *
 * @note data-syfr-id is converted to camelCase: syfrId
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset#name_conversion
 */
function initializeSyfr() {
  let formsCollection = document.forms; // https://developer.mozilla.org/en-US/docs/Web/API/Document/forms
  Array.from(formsCollection).forEach((form) => {
    form.dataset.syfrId && initializeSyfrForm(form);
  });
}
initializeSyfr();

/**
 * Adds event listener on form submission
 * Prefetches and registers the keys for the form
 */
async function initializeSyfrForm(form: HTMLFormElement) {
  form.addEventListener("submit", processTheForm); // process on form submit
  fetchKey(form.dataset.syfrId); //prefetch
}

async function processTheForm(event: SubmitEvent) {
  event.preventDefault();
  disableFormSubmit(event.target, true);
  await fetchKey(event.target.dataset.syfrId);
  let syfrForm = await constructSyfrForm(event);
  console.log(JSON.stringify(syfrForm));
  let payload = await buildJwePayload(syfrForm);
  await pushToApi(payload);
  disableFormSubmit(event.target, false);
}

async function fetchKey(syfrFormId: SyfrForm["id"]) {
  if (keychain[syfrFormId]) return;
  let jwk = await fetchJwk(syfrFormId);
  let key = await keyFromJwk(jwk);
  keychain[syfrFormId] = { jwk, key };
}

/**
 * Gather all info from form submission
 * ultimately, these may require breaking into chunks
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent
 */
async function constructSyfrForm(event: SubmitEvent) {
  let id = event.target.dataset.syfrId;
  let { key, jwk } = keychain[id];
  let code = getFormCode(event);
  let entries = new FormData(event.target);
  let fileMap = {};
  let files: string[] = [];
  let cids: string[] = [];
  for (let [index, value] of entries) {
    if (value instanceof File) {
      if (value.size === 0) {
        fileMap[index] = null;
        continue;
      }
      let byteArr = await getByteArrayFromFile(value);
      let jwe = await makeCompactJwe(jwk.kid, key, value.type, byteArr);
      fileMap[index] = fileToFileJweMeta(value, jwe);
      files.push(jwe);
      cids.push(getUniqueIdFromJwe(jwe));
    }
  }
  let data: SyfrJweContent["data"] = {
    ...Object.fromEntries(entries),
    ...fileMap,
  };
  return { id, key, jwk, code, files, cids, data } as SyfrForm;
}

/**
 * Render form submission into JWEs
 */
async function buildJwePayload(syfrForm: SyfrForm) {
  const { data, code, files } = syfrForm;
  const plainText = { data, code };
  const byteArr = getByteArrayFrom(plainText);
  const jwe = await makeCompactJwe(
    syfrForm.jwk.kid,
    syfrForm.key,
    "application/json",
    byteArr,
    syfrForm.cids
  );
  const payload = { jwe, files };
  return payload;
}

/**
 * Serialize the form HTML to a string
 * already considered and rejected https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */
function getFormCode(event: SubmitEvent): SyfrJweContent["code"] {
  return new XMLSerializer()
    .serializeToString(event.target)
    .replace(/\s{2,}/g, " ");
}

/**
 * Adds a `cids` property
 * Drops file streams (no .text(), no .arrayBuffer(), .etc)
 * `fileId` is Authentication Tag from Jwe.  We can also filter by kid to locate content
 */
function fileToFileJweMeta(formDataEntry: File, jwe: string) {
  let { name, lastModified, type } = formDataEntry;
  let fileJweMeta: FileJweMeta = {
    name,
    lastModified,
    type,
    cids: [getUniqueIdFromJwe(jwe)], //the Authentication Tag is the fileId (should be unique)
  };
  return fileJweMeta;
}

/**
 * The Authentication Tag is a secure hash which should be unique (128-bits)
 * it is the last segment of a compact JWE
 * @see https://datatracker.ietf.org/doc/html/rfc7516/#appendix-B.7
 *
 * Possibly consider this CID implementation in the future
 * @see https://github.com/multiformats/cid
 */
function getUniqueIdFromJwe(jwe: string) {
  return jwe.split(".")[4];
}

async function getByteArrayFromFile(file: File) {
  let buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

function getByteArrayFrom(obj: Object) {
  let stringifiedData = JSON.stringify(obj);
  return new TextEncoder().encode(stringifiedData);
}

function disableFormSubmit(form: HTMLFormElement, status: boolean) {
  let submitButton = form.querySelector('[type="submit"]') as HTMLFormElement;
  submitButton.disabled = status;
}
