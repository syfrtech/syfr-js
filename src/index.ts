import { fetchJwk, pushToApi } from "./request";
import { keyFromJwk, makeCompactJwe } from "./encrypt";
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

interface SubmitEvent extends Event {
  target: HTMLFormElement;
}

export type FileJweMeta = {
  name: File["name"];
  lastModified: File["lastModified"];
  type: File["type"];
  fileIds: string[];
};

type FormData = { [k: string]: FormDataEntryValue };

export type SyfrForm = {
  id: string;
  jwk: SyfrJwk;
  key: CryptoKey;
  code: String;
  data: FormData;
  files: string[];
  fileIds: string[];
};

/** a map of syfr form ids and their keys */
let keychain: { [syfrId: string]: { jwk: SyfrJwk; key: CryptoKey } } = {};

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
  // run on form submit instead of action
  form.addEventListener("submit", processTheForm);

  // prefetch keys
  let syfrFormId = form.dataset.syfrId;
  let jwk = await fetchJwk(syfrFormId);
  let key = await keyFromJwk(jwk);
  keychain[syfrFormId] = { jwk, key };
}

async function processTheForm(event: SubmitEvent) {
  event.preventDefault();
  let syfrForm = await constructSyfrForm(event);
  console.log(JSON.stringify(syfrForm));
  let payload = await constructPayload(syfrForm);
  await pushToApi(payload);
}

/**
 * ultimately, these may require breaking into chunks
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/SubmitEvent
 */
async function constructSyfrForm(event: SubmitEvent) {
  let id = event.target.dataset.syfrId;
  let { key, jwk } = keychain[id];
  let code = getFormCode(event);
  let files: string[] = [];
  let entries = new FormData(event.target);
  let fileEntries = {};
  let fileIds: string[] = [];
  for (let [index, value] of entries) {
    if (value instanceof File) {
      if (value.size === 0) {
        fileEntries[index] = null;
        continue;
      }
      let byteArr = await getByteArrayFromFile(value);
      let jwe = await makeCompactJwe(jwk.kid, key, value.type, byteArr);
      fileEntries[index] = fileToFileJweMeta(value, jwe);
      files.push(jwe);
      fileIds.push(getUniqueIdFromJwe(jwe));
    }
  }
  let data = { ...Object.fromEntries(entries), ...fileEntries };
  return { id, key, jwk, code, files, fileIds, data } as SyfrForm;
}

async function constructPayload(syfrForm: SyfrForm) {
  const { data, code, files } = syfrForm;
  const plainText = { data, code };
  const byteArr = getByteArrayFrom(plainText);
  const jwe = await makeCompactJwe(
    syfrForm.jwk.kid,
    syfrForm.key,
    "text/json+syfr.1.0.0",
    byteArr,
    syfrForm.fileIds
  );
  const payload = { jwe, files };
  return payload;
}

/**
 * Serialize the form HTML to a string
 * already considered and rejected https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */
function getFormCode(event: SubmitEvent) {
  return new XMLSerializer()
    .serializeToString(event.target)
    .replace(/\s{2,}/g, " ");
}

/**
 * Adds a `fileIds` property
 * Drops file streams (no .text(), no .arrayBuffer(), .etc)
 * `fileId` is Authentication Tag from Jwe.  We can also filter by kid to locate content
 */
function fileToFileJweMeta(formDataEntry: File, jwe: string) {
  let { name, lastModified, type } = formDataEntry;
  let fileJweMeta: FileJweMeta = {
    name,
    lastModified,
    type,
    fileIds: [getUniqueIdFromJwe(jwe)], //the Authentication Tag is the fileId (should be unique)
  };
  return fileJweMeta;
}

/**
 * The Authentication Tag is a secure hash which should be unique (128-bits)
 * it is the last segment of a compact JWE
 * @see https://datatracker.ietf.org/doc/html/rfc7516/#appendix-B.7
 *
 * consider CID for fileId
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
