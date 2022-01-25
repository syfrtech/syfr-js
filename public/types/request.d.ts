import { JWK } from "jose";
/**
 * JWK / JsonWebKey extended with Syfr requirements
 *
 * `kid` must use sha256 fingerprinting (except local key): @see https://github.com/syfrapp/api/issues/77
 * `use` and `key_ops` required: @see https://github.com/syfrapp/api/issues/84
 * `jwk` spec: @see https://datatracker.ietf.org/doc/html/rfc7517
 * `kid` spec: @see https://datatracker.ietf.org/doc/html/rfc7638
 */
export declare type SyfrJwk = JWK & {
    use: "enc";
    key_ops: Array<"wrapKey" | "unwrapKey">;
} & Required<Pick<JWK, "kid" | "alg">>;
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
