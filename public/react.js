var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from "react";
import { SyfrClass } from "./class";
export const useSyfrForm = (id) => {
    let [form, setForm] = React.useState();
    let linkProps = {
        rel: "",
        href: `https://syfr.app/validate/${id}`,
        ["data-syfr-validate"]: true,
    };
    const SyfrForm = (_a) => {
        var { action } = _a, props = __rest(_a, ["action"]);
        React.useEffect(() => {
            if (!!form)
                new SyfrClass(form, id);
        }, [form]);
        // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
        const _action = action !== null && action !== void 0 ? action : "#";
        if (typeof window === "undefined")
            return React.createElement(React.Fragment, null);
        return (React.createElement("form", Object.assign({ ref: (element) => {
                setForm(element);
            }, action: _action }, props)));
    };
    return [SyfrForm, form, linkProps];
};
