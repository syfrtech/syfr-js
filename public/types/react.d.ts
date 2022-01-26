import React from "react";
import { SyfrClass } from "./class";
declare type ReactFormProps = Omit<React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>, "action" | "onSubmit"> & {
    beforeSubmit: () => void;
    afterSubmit: () => void;
};
export declare const useSyfrForm: (id: NonNullable<ConstructorParameters<typeof SyfrClass>[1]>) => readonly [(props: ReactFormProps) => JSX.Element, {
    rel: string;
    href: string;
    "data-syfr-validate": boolean;
}];
export {};
