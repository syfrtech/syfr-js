import React from "react";
import { SyfrFormId } from "./types";
declare type ReactFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;
export declare const useSyfrForm: (id: SyfrFormId) => ({ action, ...props }: ReactFormProps) => JSX.Element;
export {};
