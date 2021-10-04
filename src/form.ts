import { keyFromJwk, makeCompactJwe } from "./encrypt";
import { fetchJwk, pushToApi } from "./request";
import { FileJweMeta, SyfrJwk } from "./types";

export class SyfrForm {
  id: string; // the UUID of the form in Syfr
  form: HTMLFormElement; // the DOM representation of the form
  key: CryptoKey; // the CryptoKey from the JWK to encrypt the formdata
  jwk: SyfrJwk; // the JWK from Syfr to encrypt the formdata
  jwes: object = {}; // the JWEs which will be submitted to Syfr
  options: {
    autoSubmit: boolean;
    debug: boolean;
    onSuccess: () => void;
  };

  constructor(
    form: SyfrForm["form"],
    options: Partial<SyfrForm["options"]> = {}
  ) {
    this.form = form;
    this.id = form.dataset.syfrId;
    this.options = {
      ...{ autoSubmit: true, debug: false, onSuccess: () => {} },
      ...options,
    };
    if (!this.id) {
      this.debug(
        `Ignored "${form.name}#${form.id}". data-syfr-id attribute is required.`
      );
      return;
    }
    this.getKey();
    // this.form
    //   .querySelector('[type="submit"]')
    //   .setAttribute("title", "◉ Syfr Certified E2EE");

    this.options.autoSubmit && this.autoSubmit();
    this.debug(`Initialized SyfrId ${this.id}`);
  }

  async getKey() {
    if (this.key) {
      return this.key;
    }
    this.jwk = await fetchJwk(this.id);
    this.key = await keyFromJwk(this.jwk);
    this.key &&
      this.form.insertAdjacentHTML(
        "afterend",
        `<small><a href="https://syfr.app/certification/${
          this.id
        }" title="Certified E2EE by ◉ Syfr ${new Date()}&#10;ID:${
          this.id
        }&#10;&#10;${this.jwk.alg}&#10;kid:${
          this.jwk.kid
        }" class="syfr" target="_blank">◉ Syfr Certified Encrypted Web Form</a></small>`
      );
    this.debug(this.jwk);
    return this.key;
  }

  autoSubmit() {
    this.form.addEventListener("submit", async (event) => {
      event.preventDefault();
      let submitBtn = this.form.querySelector('[type="submit"]');
      submitBtn.toggleAttribute("disabled");
      submitBtn.innerHTML = "Encrypting...";
      await this.submit();

      //reset the form after submissions
      // submitBtn.toggleAttribute("disabled");
      submitBtn.innerHTML = "Encrypted and submitted ↺";
      submitBtn.addEventListener("onmousedown", (event) => {
        this.form.reset();
        // submitBtn.removeEventListener("onmousedown")
      });
      // this.form.reset();
      this.jwes = {};
      // this.form.style.display = "none";
    });
  }

  async submit() {
    this.key || (await this.getKey());
    await this.buildEntry();
    await this.sendToSyfr();
    this.options.onSuccess();
  }

  async buildEntry() {
    let code = this.getCode();
    let data = await this.getData();
    await this.buildRootJwe({ code, data });
  }

  /**
   * Serialize the form HTML to a string
   * already considered and rejected https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
   */
  getCode() {
    return new XMLSerializer()
      .serializeToString(this.form)
      .replace(/\s{2,}/g, " "); //remove extra spacing
  }

  async getData() {
    let src = new FormData(this.form);
    let result = {};
    for (let fieldName of src.keys()) {
      if (fieldName in result) {
        continue; //skip duplicate key (ex: a field can have multiple files using same key)
      }
      let parsed = await this.getParsedFieldArr(src.getAll(fieldName));
      // use src to determine if output should be an array
      result[fieldName] = Array.isArray(src[fieldName]) ? parsed : parsed[0];
    }
    return result;
  }

  async buildRootJwe(obj: object) {
    let rootJwe = await this.objToJwe(obj);
    this.jwes[this.jweToCid(rootJwe)] = rootJwe;
  }

  async getParsedFieldArr(fieldArr: FormDataEntryValue[]) {
    let response = [];
    for (let field of fieldArr) {
      response.push(await this.getParsedField(field));
    }
    return response;
  }

  async getParsedField(field: FormDataEntryValue) {
    return field instanceof File ? await this.processFile(field) : field;
  }

  async processFile(file: File) {
    if (file.size > 0) {
      let fileJwe = await makeCompactJwe(
        this.jwk,
        this.key,
        file.type,
        await this.fileToUint8(file)
      );
      this.jwes[this.jweToCid(fileJwe)] = fileJwe;
      return this.fileToMeta(file, fileJwe);
    }
  }

  async fileToUint8(file: File) {
    let buf = await file.arrayBuffer();
    return new Uint8Array(buf);
  }

  /**
   * Drops file streams (no .text(), no .arrayBuffer(), .etc)
   */
  fileToMeta(file: File, jwe: string) {
    let { name, lastModified, type } = file;
    let fileJweMeta: FileJweMeta = {
      name,
      lastModified,
      type,
      cids: [this.jweToCid(jwe)], // plural for future chunking.
    };
    return fileJweMeta;
  }

  /**
   * `cid` is Authentication Tag from Jwe.  We can also filter by kid to locate content
   * The Authentication Tag is a secure hash which should be unique (128-bits)
   * it is the last segment of a compact JWE
   * @see https://datatracker.ietf.org/doc/html/rfc7516/appendix-B.7
   *
   * Possibly consider this CID implementation in the future
   * @see https://github.com/multiformats/cid
   */
  jweToCid(jwe: string) {
    return jwe.split(".")[4];
  }

  async objToJwe(stringifiableObj: object) {
    const byteArr = new TextEncoder().encode(JSON.stringify(stringifiableObj));
    const jwe = await makeCompactJwe(
      this.jwk,
      this.key,
      "application/json",
      byteArr,
      Object.keys(this.jwes)
    );
    this.debug(stringifiableObj);
    return jwe;
  }

  async sendToSyfr() {
    let payload = new FormData();
    Object.values(this.jwes).forEach((jwe) => {
      payload.append("compactJwe", jwe);
    });
    await pushToApi(payload);
    this.debug(this.jwes);
  }

  debug(message: any) {
    this.options.debug && console.log(message);
  }
}
