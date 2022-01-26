var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { keyFromJwk, makeCompactJwe } from "./encrypt";
import { SyfrEvent } from "./event";
import { fetchFromApi, pushToApi } from "./request";
/**
 * Automatically initialized when script is included.
 * Use event listeners to enhance user experience
 * @see SyfrEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
 */
export class SyfrClass {
    constructor(form, _a = {}) {
        var { id } = _a, opts = __rest(_a, ["id"]);
        this.jwes = {}; // the JWEs which will be submitted to Syfr
        this.locked = false; // blocks submissions from being submitted when true
        this.debug = { standard: false, xhr: false };
        this.form = form;
        this.id = this.getId(id);
        this.setOptions(opts);
        this.prepareForm();
    }
    getId(syfrId) {
        var _a;
        let id = syfrId !== null && syfrId !== void 0 ? syfrId : (_a = this.form.dataset) === null || _a === void 0 ? void 0 : _a.syfrId;
        if (!id) {
            // don't lock when missing id; just ignore it
            throw {
                form: this.form,
                error: `Ignoring: no form id`,
            };
        }
        return id;
    }
    setOptions({ debug, link }) {
        var _a, _b, _c, _d, _e;
        this.debug = debug !== null && debug !== void 0 ? debug : {
            standard: (_b = ((_a = this.form.dataset) === null || _a === void 0 ? void 0 : _a.syfrDebug) != undefined) !== null && _b !== void 0 ? _b : false,
            xhr: (_d = ((_c = this.form.dataset) === null || _c === void 0 ? void 0 : _c.syfrDebugXhr) != undefined) !== null && _d !== void 0 ? _d : false,
        };
        this.link =
            (_e = link !== null && link !== void 0 ? link : this.form.querySelector("[data-syfr-validate]")) !== null && _e !== void 0 ? _e : undefined;
    }
    async validate() {
        let response = await this.askApi();
        if (!response.whiteLabel) {
            this.validateLink(); // validation link required unless whiteLabel
        }
        SyfrEvent.valid(this.form, response);
    }
    async validateLink() {
        let linkEl = this.link;
        if (!linkEl) {
            this.locked = true;
            throw {
                form: this.form,
                error: `The form must have a validation link, ex: <a data-syfr-validate ...`,
                seeDocs: "https://syfr.app/docs/validation",
            };
        }
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
            this.locked = true;
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
    async askApi() {
        if (this.response)
            return this.response;
        try {
            let response = await fetchFromApi(this.id);
            let publicKey = await keyFromJwk(response.publicJwk);
            this.response = Object.assign(Object.assign({}, response), { publicKey });
            return this.response;
        }
        catch (e) {
            this.locked = true;
            throw {
                syfrId: this.id,
                error: "Bad data-syfr-id or some other error with API",
            };
        }
    }
    async getJwk() {
        return (await this.askApi()).publicJwk;
    }
    async getKey() {
        return (await this.askApi()).publicKey;
    }
    async prepareForm() {
        this.addSubmitListener();
        this.debug.standard && this.addDebugListeners();
        await this.validate(); // pre-validate form
    }
    addDebugListeners() {
        ["syfr_valid", "syfr_send", "syfr_beforeSend"].forEach((eventType) => {
            this.form.addEventListener(eventType, (e) => {
                console.log(e);
                if (eventType === "syfr_beforeSend" && this.debug.xhr) {
                    this.addXhrListener(e);
                }
            });
        });
    }
    addXhrListener(event) {
        for (var key in event.detail) {
            if (key.search("on") === 0) {
                event.detail.addEventListener(key.slice(2), (e) => {
                    console.log(e);
                });
            }
        }
    }
    /**
     * Listens for the form submit (the SubmitEvent only fires if it succeeds validation)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
     */
    addSubmitListener() {
        this.form.addEventListener("submit", async (event) => {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
            await this.beforeSubmit();
            await this.submit();
            this.afterSubmit();
        });
    }
    async beforeSubmit() {
        if (this.locked)
            throw "Ignored submission; the form is locked.";
        await this.validate();
        this.locked = true;
    }
    afterSubmit() {
        this.jwes = {};
        this.locked = false;
    }
    async submit() {
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
        let cid = jwe.split(".")[4];
        if (!cid) {
            this.locked = true;
            throw "Provided JWE was invalid";
        }
        return cid;
    }
    async sendToSyfr() {
        let payload = new FormData();
        Object.values(this.jwes).forEach((jwe) => {
            payload.append("compactJwe", jwe);
        });
        SyfrEvent.beforeSend(this.form, { jwes: this.jwes, payload });
        await pushToApi(payload, this.form);
    }
}
