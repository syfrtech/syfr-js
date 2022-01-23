import { keyFromJwk, makeCompactJwe } from "./encrypt";
import { SyfrEvent } from "./event";
import { fetchFromApi, pushToApi } from "./request";
/**
 * Automatically initialized when script is included.
 * Use event listeners to enhance user experience
 * @see SyfrEvent
 */
export class SyfrClass {
    constructor(form, syfrId, link) {
        var _a, _b;
        this.jwes = {}; // the JWEs which will be submitted to Syfr
        this.loading = false;
        this.form = form;
        let id = syfrId !== null && syfrId !== void 0 ? syfrId : (_a = form.dataset) === null || _a === void 0 ? void 0 : _a.syfrId;
        if (!id) {
            throw {
                form: this.form,
                error: `Ignoring: no form id`,
            };
        }
        this.id = id;
        this.link =
            (_b = link !== null && link !== void 0 ? link : this.form.querySelector("[data-syfr-validate]")) !== null && _b !== void 0 ? _b : undefined;
        this.autoSubmit();
    }
    linkCheck() {
        let linkEl = this.link;
        if (!linkEl)
            throw {
                form: this.form,
                error: `The form must have a validation link, ex: <a data-syfr-validate ...`,
                seeDocs: "https://syfr.app/docs/validation",
            };
        let href = `https://syfr.app/validate/${this.id}`;
        let issues = Object.assign(Object.assign(Object.assign({}, (!(linkEl instanceof HTMLAnchorElement) && {
            linkHref: { got: linkEl, want: `<a href='${href}' ...` },
        })), (!this.form.contains(linkEl) && {
            linkWithinForm: { got: false, want: true },
        })), (!this.id.match(/^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i) && { syfrId: { got: this.id, want: "a valid uuid from Syfr" } }));
        if (Object.keys(issues).length < 1 && linkEl instanceof HTMLAnchorElement) {
            let cs = getComputedStyle(linkEl);
            let pf = parseFloat;
            let px = pf(cs.paddingLeft) + pf(cs.paddingRight);
            let py = pf(cs.paddingTop) + pf(cs.paddingBottom);
            let bx = pf(cs.borderLeftWidth) + pf(cs.borderRightWidth);
            let by = pf(cs.borderTopWidth) + pf(cs.borderBottomWidth);
            let heightPx = linkEl.offsetHeight - px - bx;
            let widthPx = linkEl.offsetWidth - py - by;
            let areaPx = heightPx * widthPx;
            let fontSizePx = pf(cs.fontSize);
            issues = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, issues), (linkEl.offsetParent === null && {
                validationLinkIsHidden: { got: true, want: false },
            })), (linkEl.href != href && {
                validationLinkHref: { got_: linkEl.href, want: href },
            })), (linkEl.relList.contains("nofollow") && {
                validationLinkIsNofollow: { got: true, want: false },
            })), (linkEl.relList.contains("noreferrer") && {
                validationLinkIsNoreferrer: { got: true, want: false },
            })), (areaPx < 1536 && {
                validationLinkArea: { got: areaPx, want: 1536 },
            })), (fontSizePx < 8 && {
                validationLinkFontSizePx: { got: fontSizePx, want: "8px+" },
            }));
        }
        if (Object.keys(issues).length > 0) {
            throw {
                form: this.form,
                link: linkEl,
                issues,
                error: `We can't protect your form because of the issues listed`,
                seeDocs: "https://syfr.app/docs/validation",
            };
        }
        return true;
    }
    async api() {
        if (this.response)
            return this.response;
        try {
            let response = await fetchFromApi(this.id);
            let publicKey = await keyFromJwk(response.publicJwk);
            if (!response.whiteLabel) {
                this.linkCheck();
            }
            this.response = Object.assign(Object.assign({}, response), { publicKey });
            SyfrEvent.valid(this.form, {
                id: this.id,
                validateUrl: `https://syfr.app/validate/${this.id}`,
            });
            SyfrEvent.debug(this.form, {
                id: this.id,
                formPubKey: this.response.publicKey,
                message: "use addEventListener('protected',(event)=>{...} to notify your users of the protection",
            });
            return this.response;
        }
        catch (e) {
            throw {
                syfrId: this.id,
                error: "Bad data-syfr-id or some other error with API",
            };
        }
    }
    async getJwk() {
        return (await this.api()).publicJwk;
    }
    async getKey() {
        return (await this.api()).publicKey;
    }
    /**
     * Listens for the form submit (the SubmitEvent only fires if it succeeds validation)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
     */
    autoSubmit() {
        SyfrEvent.debug(this.form, {
            message: "Initializing SyfrClass",
            syfrId: this.id,
            form: this.form,
        });
        this.api(); // preload response
        this.form.addEventListener("submit", async (event) => {
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
        await this.api();
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
    async buildRootJwe(stringifiableObj) {
        const pubJwk = await this.getJwk();
        const pubKey = await this.getKey();
        const byteArr = new TextEncoder().encode(JSON.stringify(stringifiableObj));
        const rootJwe = await makeCompactJwe(pubJwk, pubKey, "application/json", byteArr, Object.keys(this.jwes));
        this.jwes[this.jweToCid(rootJwe)] = rootJwe;
    }
    async getParsedFieldArr(fieldArr) {
        let response = [];
        for (let field of fieldArr) {
            response.push(await this.getParsedField(field));
        }
        return response;
    }
    async getParsedField(field) {
        return field instanceof File ? await this.processFile(field) : field;
    }
    async processFile(file) {
        const pubJwk = await this.getJwk();
        const pubKey = await this.getKey();
        if (file.size > 0) {
            let fileJwe = await makeCompactJwe(pubJwk, pubKey, file.type, await this.fileToUint8(file));
            this.jwes[this.jweToCid(fileJwe)] = fileJwe;
            return this.fileToMeta(file, fileJwe);
        }
    }
    async fileToUint8(file) {
        let buf = await file.arrayBuffer();
        return new Uint8Array(buf);
    }
    /**
     * Drops file streams (no .t`ex`t(), no .arrayBuffer(), .etc)
     */
    fileToMeta(file, jwe) {
        let { name, lastModified, type } = file;
        let fileJweMeta = {
            name,
            lastModified,
            type,
            cids: [this.jweToCid(jwe)], // plural for future chunking.
        };
        return fileJweMeta;
    }
    jweToCid(jwe) {
        let response = jwe.split(".")[4];
        if (!response)
            throw "Provided JWE was invalid";
        return response;
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
