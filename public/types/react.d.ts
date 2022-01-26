import React from "react";
import { SyfrClassOptions } from "./class";
declare type ReactFormProps = Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "action" | "onSubmit">;
declare type useSyfrFormOptions = SyfrClassOptions & Required<Pick<SyfrClassOptions, "id">>;
export declare const useSyfrForm: (options: useSyfrFormOptions) => readonly [(props: ReactFormProps) => JSX.Element, {
    rel: string;
    href: string;
    "data-syfr-validate": boolean;
}];
export {};
