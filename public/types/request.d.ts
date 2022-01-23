import { SyfrJwk } from "./types";
/**
 * @see https://github.com/syfrapp/api/issues/101
 */
export declare function fetchFromApi(id: string): Promise<{
    publicJwk: SyfrJwk;
    whiteLabel: boolean;
}>;
/**
 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * @see https://github.com/syfrapp/api/issues/103
 */
export declare function pushToApi(payload: FormData, form: HTMLFormElement): Promise<void>;
