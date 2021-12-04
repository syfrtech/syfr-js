import { keyFromJwk, makeCompactJwe } from "./encrypt";
import { SyfrEvent } from "./event";
import { fetchJwk, pushToApi } from "./request";
import {
  CompactJwe,
  FileJweMeta,
  JweCid,
  JweMap,
  SyfrJwk,
  Uuid,
} from "./types";

/**
 * Automatically initialized when script is included.
 * Use event listeners to enhance user experience
 * @see SyfrEvent
 */
export class SyfrForm {
  id: Uuid; // the UUID of the form in Syfr
  form: HTMLFormElement; // the DOM representation of the form
  pubKey: CryptoKey; // the CryptoKey from the JWK to encrypt the formdata
  pubJwk: SyfrJwk; // the JWK from Syfr to encrypt the formdata
  jwes: JweMap = {}; // the JWEs which will be submitted to Syfr
  loading: boolean = false;

  constructor(form: SyfrForm["form"]) {
    this.form = form;
    this.idCheck() && this.linkCheck() && this.autoSubmit();
  }

  idCheck() {
    this.id = this.form.dataset.syfrId;
    if (this.id === undefined) {
      SyfrEvent.debug(this.form, {
        form: this.form,
        message: "Ignored a form which didn't have a data-syfr-id attribute.",
      });
      return false;
    }
    return true;
  }

  linkCheck() {
    let linkId = `link-${this.id}`;
    let href = `https://syfr.app/validate/${this.id}`;
    let linkEl = document.getElementById(linkId);
    let issues = {
      ...(!linkEl && {
        linkId: { got: linkEl, want: `<a id='${linkId}' ...` },
      }),
      ...(!(linkEl instanceof HTMLAnchorElement) && {
        linkHref: { got: linkEl, want: `<a href='${href}' ...` },
      }),
    };
    if (Object.keys(issues).length < 1 && linkEl instanceof HTMLAnchorElement) {
      let area = linkEl.offsetWidth * linkEl.offsetHeight;
      issues = {
        ...issues,
        ...(linkEl.offsetParent === null && {
          isHidden: { got: true, want: false },
        }),
        ...(linkEl.href != href && {
          href: { have: linkEl.href, need: href },
        }),
        ...(linkEl.relList.contains("nofollow") && {
          isNoFollow: { got: true, want: false },
        }),
        ...(linkEl.relList.contains("noreferrer") && {
          isNoReferrer: { got: true, want: false },
        }),
        ...(area < 1500 && {
          area: { got: area, want: 1500 },
        }),
      };
    }
    if (Object.keys(issues).length > 0) {
      throw {
        syfrId: this.id,
        form: this.form,
        issues,
        error: `Form needs a correct validation link`,
        see: "https://syfr.app/docs/validation",
      };
    }
    return true;
  }

  async getKey() {
    if (this.pubKey) {
      return this.pubKey;
    }
    try {
      this.pubJwk = await fetchJwk(this.id);
      this.pubKey = await keyFromJwk(this.pubJwk);
    } catch (e) {
      throw {
        syfrId: this.id,
        error: "Bad data-syfr-id or couldn't get pubKey",
      };
    }
    SyfrEvent.protect(this.form, {
      id: this.id,
      validateUrl: `https://syfr.app/validate/${this.id}`,
    });
    SyfrEvent.debug(this.form, {
      id: this.id,
      formPubKey: this.pubKey,
      message:
        "use addEventListener('protected',(event)=>{...} to notify your users of the protection",
    });
    return this.pubKey;
  }

  /**
   * Listens for the form submit (the SubmitEvent only fires if it succeeds validation)
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
   */
  autoSubmit() {
    SyfrEvent.debug(this.form, {
      message: "Initializing SyfrForm",
      syfrId: this.id,
      form: this.form,
    });
    this.getKey();
    this.form.addEventListener("submit", async (event: SubmitEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      event.stopPropagation();
      if (this.loading) {
        SyfrEvent.debug(this.form, "Ignored duplicate submission.");
        return;
      }
      this.loading = true;
      await this.submit();
      this.form.reset();
      this.jwes = {};
      this.loading = false;
    });
  }

  async submit() {
    this.pubKey || (await this.getKey());
    await this.buildEntry();
    await this.sendToSyfr();
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
    let srcFormData = new FormData(this.form);
    let result = {};
    for (let fieldName of srcFormData.keys()) {
      if (fieldName in result) {
        continue; //skip duplicate key (ex: a field can have multiple files using same key)
      }
      let fieldArr = srcFormData.getAll(fieldName);
      let parsed = await this.getParsedFieldArr(fieldArr);
      // use srcFormData to determine if output should be an array
      result[fieldName] = fieldArr.length > 1 ? parsed : parsed[0];
    }
    return result;
  }

  async buildRootJwe(stringifiableObj: object) {
    const byteArr = new TextEncoder().encode(JSON.stringify(stringifiableObj));
    const rootJwe = await makeCompactJwe(
      this.pubJwk,
      this.pubKey,
      "application/json",
      byteArr,
      Object.keys(this.jwes)
    );
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
        this.pubJwk,
        this.pubKey,
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
  fileToMeta(file: File, jwe: CompactJwe) {
    let { name, lastModified, type } = file;
    let fileJweMeta: FileJweMeta = {
      name,
      lastModified,
      type,
      cids: [this.jweToCid(jwe)], // plural for future chunking.
    };
    return fileJweMeta;
  }

  jweToCid(jwe: CompactJwe): JweCid {
    return jwe.split(".")[4];
  }

  async sendToSyfr() {
    let payload = new FormData();
    Object.values(this.jwes).forEach((jwe) => {
      payload.append("compactJwe", jwe);
    });
    SyfrEvent.transmit(this.form, { jwes: this.jwes, payload });
    SyfrEvent.debug(this.form, {
      message: "Sending to Syfr:",
      jwes: this.jwes,
      payload,
    });
    await pushToApi(payload, this.form);
  }
}
