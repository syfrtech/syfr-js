import { fetchJwk, pushToApi } from "./request";
import { registerJwk, makeCompactJwe } from "./encrypt";

/**
 * Check every form for the `data-syfrId` attribute
 * `data-syfrId` attribute will trigger submitForm() on submit
 *
 * @note data-syfr-id is converted to camelCase syfrId
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset#name_conversion
 */
function registerSyfr() {
  let formsCollection = document.getElementsByTagName("form");
  Array.from(formsCollection).forEach((form) => {
    form.dataset.syfrId && registerSyfrForm(form);
  });
}
registerSyfr();

/**
 * Adds event listener on form submission
 * Prefetches and registers the keys for the form
 */
async function registerSyfrForm(form) {
  // run on form submit instead of action
  form.addEventListener("submit", submitForm);

  // prefetch and register keys
  let formId = form.dataset.syfrId;
  let jwk = await fetchJwk(formId);
  await registerJwk(jwk, formId);
}

/**
 * @param {Event} event
 */
async function submitForm(event) {
  event.preventDefault();
  let formId = event.target.dataset.syfrId;
  let formCode = getFormModelFromEvent(event);
  let { formData, files } = await getFormDataAndEncryptedFilesFromEvent(event);
  const data = { data: formData, model: formCode };
  const byteArr = getByteArrayFromData(data);
  const jwe = await makeCompactJwe(formId, byteArr, "text/json+syfr.1.0.0");
  const payload = { data: jwe, files };
  await pushToApi(payload);
}

/**
 * already considered and rejected https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
 */
function getFormModelFromEvent(event) {
  return new XMLSerializer()
    .serializeToString(event.target)
    .replace(/\s{2,}/g, " ");
}

/**
 * ultimately, these may require breaking into chunks
 *  @see https://developer.mozilla.org/en-US/docs/Web/API/File
 */
async function getFormDataAndEncryptedFilesFromEvent(event) {
  let formId = event.target.dataset.syfrId;
  let formData = Object.fromEntries(new FormData(event.target));
  let files = [];
  for (let [index, value] of Object.entries(formData)) {
    if (value instanceof File) {
      if (value.size === 0) {
        formData[index] = "";
        continue;
      }
      let byteArr = await getByteArrayFromFile(value);
      let jwe = await makeCompactJwe(formId, byteArr, value.type);
      setFormDataFieldToFileLike(formData, index, jwe);
      files.push(jwe);
    }
  }
  return { formData, files };
}

/**
 * Creates a serializable object similar to https://developer.mozilla.org/en-US/docs/Web/API/File
 * Adds a `fileId` property, drops file streams (no .text(), no .arrayBuffer(), .etc)
 * `fileId` is Authentication Tag.  We can also filter by kid to locate content
 * @param {Object} formData
 * @param {string} key
 * @param {string} jwe
 */
function setFormDataFieldToFileLike(formData, index, jwe) {
  let { name, lastModified, type } = formData[index];
  formData[index] = {
    file: {
      name,
      lastModified,
      type,
      fileId: jwe.split(".")[4], //the Authentication Tag (should be unique)
    },
  };
}

/**
 * @param {File} file
 */
async function getByteArrayFromFile(file) {
  let buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

/**
 * @param {Object} data
 */
function getByteArrayFromData(data) {
  let stringifiedData = JSON.stringify(data);
  return new TextEncoder().encode(stringifiedData);
}
