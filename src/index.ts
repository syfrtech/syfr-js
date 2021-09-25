import { fetchJwk, pushToApi } from "./request";
import { keyFromJwk, makeCompactJwe } from "./encrypt";
import {
  SyfrEntry,
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
export function initialize() {
  let formsCollection = document.forms; // https://developer.mozilla.org/en-US/docs/Web/API/Document/forms
  Array.from(formsCollection).forEach((form) => {
    let syfrFormId = form.dataset.syfrId;
    syfrFormId && initializeSyfrEntry(form, syfrFormId);
  });
}

/**
 * Adds event listener on form submission
 * Prefetches and registers the keys for the form
 */
async function initializeSyfrEntry(
  form: HTMLFormElement,
  syfrFormId: SyfrEntry["id"]
) {
  form.addEventListener("submit", (event: SubmitEvent) => {
    processTheForm(event, syfrFormId);
  }); // process on form submit
  fetchAndStoreKey(form.dataset.syfrId); //prefetch
}

export async function processTheForm(
  event: SubmitEvent,
  syfrFormId: SyfrEntry["id"]
) {
  event.preventDefault();
  disableFormSubmit(event.target, true);
  await fetchAndStoreKey(syfrFormId);
  let syfrEntry = await buildSyfrEntry(event, syfrFormId);
  await pushToApi(syfrEntry);
  disableFormSubmit(event.target, false);
}

async function fetchAndStoreKey(syfrFormId: SyfrEntry["id"]) {
  if (keychain[syfrFormId]) return;
  let jwk = await fetchJwk(syfrFormId);
  let wrappingKey = await keyFromJwk(jwk);
  keychain[syfrFormId] = { jwk, wrappingKey };
}

/**
 * Gather all info from form submission
 * ultimately, these may require breaking into chunks
 * deals with duplicate names.  @see https://stackoverflow.com/a/46774073/4481226
 */
async function buildSyfrEntry(event: SubmitEvent, syfrFormId: SyfrEntry["id"]) {
  let { wrappingKey, jwk } = keychain[syfrFormId];
  let rawFormData = new FormData(event.target);
  let jwes: SyfrEntry["jwes"] = new FormData();
  let cids: SyfrEntry["cids"] = [];

  let code: SyfrJweContent["code"] = getFormCode(event);
  let parsedData: SyfrJweContent["data"] = {};
  for (let fieldName of rawFormData.keys()) {
    if (fieldName in parsedData) {
      continue; //skip duplicate key (ex: a field can have multiple files using same key)
    }
    let rawFieldData = rawFormData.getAll(fieldName);
    let parsedFieldData = [];
    for (let fieldDatum of rawFieldData) {
      fieldDatum instanceof File
        ? await processFile(
            fieldDatum,
            wrappingKey,
            jwk.kid,
            jwes,
            parsedFieldData,
            cids
          )
        : parsedFieldData.push(fieldDatum);
    }
    // keep the array when the field has multiple entries for that key.  otherwise drop the array
    parsedData[fieldName] =
      rawFieldData.length > 1 ? parsedFieldData : parsedFieldData[0];
  }
  console.log(parsedData);
  let rootJwe = await buildRootJwe(
    { code, data: parsedData },
    jwk.kid,
    wrappingKey,
    cids
  );
  // jwes.set(getUniqueIdFromJwe(rootJwe), rootJwe);
  jwes.append("compactJWE", rootJwe);
  return jwes;
}

async function processFile(
  file: File,
  wrappingKey: CryptoKey,
  kid: SyfrEntry["jwk"]["kid"],
  jwes: SyfrEntry["jwes"],
  parsedFieldData: FormDataEntryValue[],
  cids: SyfrEntry["cids"]
) {
  // set defaults for non-existent file
  let fileJwe = null;
  let fileModel = null;
  if (file.size > 0) {
    fileJwe = await makeCompactJwe(
      kid,
      wrappingKey,
      file.type,
      await getByteArrayFromFile(file)
    );
    fileModel = fileToFileModel(file, fileJwe);
    // jwes.set(getUniqueIdFromJwe(fileJwe), fileJwe);
    jwes.append("compactJWE", fileJwe);
    parsedFieldData.push(fileModel);
    cids.push(getUniqueIdFromJwe(fileJwe));
  }
}

/**
 * Render form submission into JWEs
 */
async function buildRootJwe(
  plainText,
  kid: SyfrEntry["jwk"]["kid"],
  wrappingKey: CryptoKey,
  cids: string[]
) {
  const byteArr = getByteArrayFrom(plainText);
  const jwe = await makeCompactJwe(
    kid,
    wrappingKey,
    "application/json",
    byteArr,
    cids
  );
  return jwe;
}

/**
 * Serialize the form HTML to a string
 * already considered and rejected https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */
function getFormCode(event: SubmitEvent): SyfrJweContent["code"] {
  return new XMLSerializer()
    .serializeToString(event.target)
    .replace(/\s{2,}/g, " "); //remove extra spacing
}

/**
 * Adds a `cids` property
 * Drops file streams (no .text(), no .arrayBuffer(), .etc)
 * `fileId` is Authentication Tag from Jwe.  We can also filter by kid to locate content
 */
function fileToFileModel(file: File, jwe: string) {
  let { name, lastModified, type } = file;
  let fileJweMeta: FileJweMeta = {
    name,
    lastModified,
    type,
    cids: [getUniqueIdFromJwe(jwe)], //the Authentication Tag is the fileId (should be unique).  plural for future chunking.
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
