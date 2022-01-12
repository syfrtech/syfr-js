import React from "react";
import { SyfrFormId } from "./types";
declare type ReactFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export declare type SyfrFormProps = {
    id: SyfrFormId;
} & ReactFormProps;
export declare function SyfrForm({ id, action, ...props }: SyfrFormProps): JSX.Element;
export {};
