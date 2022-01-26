import React from "react";
import { SyfrClass } from "./class";
export const useSyfrForm = (options) => {
    let linkProps = {
        rel: "",
        href: `https://syfr.app/validate/${options.id}`,
        ["data-syfr-validate"]: true,
    };
    const SyfrForm = (props) => {
        // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
        const action = "#";
        return (React.createElement("form", Object.assign({ ref: (form) => {
                if (!!form) {
                    new SyfrClass(form, options);
                }
            } }, props, { action: action })));
    };
    return [SyfrForm, linkProps];
};
