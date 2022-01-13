import React from "react";
import { SyfrFormId } from "./types";
declare type ReactFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export declare const useSyfrForm: (id: SyfrFormId) => readonly [({ action, ...props }: ReactFormProps) => JSX.Element, HTMLFormElement | null | undefined, {
    rel: string;
    href: string;
    "data-syfr-validate": boolean;
}];
export {};
