import React from "react";
import { SyfrClass } from "./class";
declare type ReactFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export declare const useSyfrForm: (id: NonNullable<ConstructorParameters<typeof SyfrClass>[1]>, handleForm?: ((form: HTMLFormElement) => void) | undefined) => readonly [({ action, onSubmit, ...props }: ReactFormProps) => JSX.Element, {
    rel: string;
    href: string;
    "data-syfr-validate": boolean;
}];
export {};
