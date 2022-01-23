import { fetchFromApi } from "./request";
import { CompactJwe, FileJweMeta, JweCid, JweMap, SyfrFormId } from "./types";
/**
 * Automatically initialized when script is included.
 * Use event listeners to enhance user experience
 * @see SyfrEvent
 */
export declare class SyfrClass {
    id: SyfrFormId;
    form: HTMLFormElement;
    response?: Awaited<ReturnType<typeof fetchFromApi>> & {
        publicKey: CryptoKey;
    };
    jwes: JweMap;
    loading: boolean;
    link?: HTMLAnchorElement;
    constructor(form: SyfrClass["form"], syfrId?: SyfrFormId, link?: HTMLAnchorElement);
    linkCheck(): boolean;
    api(): Promise<{
        publicJwk: import("./types").SyfrJwk;
        whiteLabel: boolean;
    } & {
        publicKey: CryptoKey;
    }>;
    getJwk(): Promise<import("./types").SyfrJwk>;
    getKey(): Promise<CryptoKey>;
    /**
     * Listens for the form submit (the SubmitEvent only fires if it succeeds validation)
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event
     */
    autoSubmit(): void;
    submit(): Promise<void>;
    buildEntry(): Promise<void>;
    /**
     * Serialize the form HTML to a string
     * already considered and rejected https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
     */
    getCode(): string;
    getData(): Promise<{
        [k: string]: import("./types").SyfrJweContentItem | import("./types").SyfrJweContentItem[];
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
