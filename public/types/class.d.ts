import { JweCid, CompactJwe } from "./encrypt";
import { SyfrSendEvent } from "./event";
import { fetchFromApi } from "./request";
export declare type SyfrJweContentItem = string | FileJweMeta | undefined;
/**
 * @param data is a map of form data, but Files must be converted to FileJweMeta
 * @param code is the serialized HTML representing the form
 */
export declare type SyfrJweContent = {
    data: {
        [k: string]: SyfrJweContentItem | SyfrJweContentItem[];
    };
    code: String;
};
/**
 * Similar to File but drops file streams (no .text(), no .arrayBuffer(), .etc)
 */
export declare type FileJweMeta = {
    name: File["name"];
    lastModified: File["lastModified"];
    type: File["type"];
    cids: string[];
};
/**
 * UUID v4
 * @see https://datatracker.ietf.org/doc/html/rfc4122
 */
export declare type Uuid = string;
/**
 * An object containing CompactJWEs indexed according to their `cid`
 */
export declare type JweMap = {
    [cid: JweCid]: CompactJwe;
};
declare type SyfrFormId = Uuid;
declare type SyfrClassOptions = {
    id?: SyfrFormId;
    link?: HTMLAnchorElement;
    debug?: SyfrClass["debug"];
};
/**
 * Automatically initialized when script is included.
 * Use event listeners to enhance user experience
 * @see SyfrEvent
 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
 */
export declare class SyfrClass {
    id: SyfrFormId;
    form: HTMLFormElement;
    response?: Awaited<ReturnType<typeof fetchFromApi>> & {
        publicKey: CryptoKey;
    };
    jwes: JweMap;
    locked: boolean;
    link?: HTMLAnchorElement;
    debug: {
        standard: boolean;
        xhr: boolean;
    };
    constructor(form: SyfrClass["form"], { id, ...opts }?: SyfrClassOptions);
    getId(syfrId?: SyfrFormId): string;
    setOptions({ debug, link }: SyfrClassOptions): void;
    validate(): Promise<void>;
    validateLink(): Promise<boolean>;
    askApi(): Promise<{
        publicJwk: import("./request").SyfrJwk;
        whiteLabel: boolean;
    } & {
        publicKey: CryptoKey;
    }>;
    getJwk(): Promise<import("./request").SyfrJwk>;
    getKey(): Promise<CryptoKey>;
    prepareForm(): Promise<void>;
    addDebugListeners(): void;
    addXhrListener(event: SyfrSendEvent): void;
    /**
     * Listens for the form submit (the SubmitEvent only fires if it succeeds validation)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
     */
    addSubmitListener(): void;
    beforeSubmit(): Promise<void>;
    afterSubmit(): void;
    submit(): Promise<void>;
    buildEntry(): Promise<void>;
    /**
     * Serialize the form HTML to a string
     * already considered and rejected https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
     */
    getCode(): string;
    getData(): Promise<{
        [k: string]: SyfrJweContentItem | SyfrJweContentItem[];
    }>;
    buildRootJwe(stringifiableObj: object): Promise<void>;
    getParsedFieldArr(fieldArr: FormDataEntryValue[]): Promise<(string | FileJweMeta | undefined)[]>;
    getParsedField(field: FormDataEntryValue): Promise<string | FileJweMeta | undefined>;
    processFile(file: File): Promise<FileJweMeta | undefined>;
    fileToUint8(file: File): Promise<Uint8Array>;
    /**
     * Drops file streams (no .t`ex`t(), no .arrayBuffer(), .etc)
     */
    fileToMeta(file: File, jwe: CompactJwe): FileJweMeta;
    jweToCid(jwe: CompactJwe): JweCid;
    sendToSyfr(): Promise<void>;
}
export {};
