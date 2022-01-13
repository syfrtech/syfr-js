import React from "react";
import { SyfrFormId } from "./types";
declare type ReactFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export declare const useSyfrForm: (id: SyfrFormId) => (HTMLFormElement | (({ action, ...props }: ReactFormProps) => JSX.Element) | {
    rel: string;
    href: string;
    "data-syfr-validate": boolean;
} | null | undefined)[];
export {};
