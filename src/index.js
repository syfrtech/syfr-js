import { CompactEncrypt } from "jose/jwe/compact/encrypt";
import { parseJwk } from "jose/jwk/parse";
import { getKeyPair } from "./keygen";

let formsCollection = document.getElementsByTagName("form");
Array.from(formsCollection).forEach((form) => {
  form.addEventListener("submit", submitForm);
});

async function submitForm(event) {
  /**
   * @todo only proceed if it is a syfr form
   * Syfr form should prevent the form from submitting in the standard way
   */
  event.preventDefault();

  /**
   * @todo only proceed if it is a syfr form
   */
  let formCode = new XMLSerializer()
    .serializeToString(event.target)
    .replace(/\s{2,}/g, " ");
  /**
   * @todo formdata needs to have files converted so they may be encrypted
   * ultimately, these may require breaking into chunks
   *  @see https://developer.mozilla.org/en-US/docs/Web/API/File
   */
  let formData = Object.fromEntries(new FormData(event.target));
  let jsonPayload = JSON.stringify({
    formData,
    formCode,
    fileUSV: await formData.avatar.text(),
  });

  const encoder = new TextEncoder();
  const binaryPayload = encoder.encode(jsonPayload);
  const keyPair = await getKeyPair();
  const jwe = await new CompactEncrypt(binaryPayload)
    .setProtectedHeader({ alg: "RSA-OAEP", enc: "A256GCM" })
    .encrypt(keyPair.publicKey);

  console.log("json");
  console.log(jsonPayload);
  console.log("jwe");
  console.log(jwe);
}
