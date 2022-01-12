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
export function useSyfrForm(id) {
    return (_a) => {
        var { action } = _a, props = __rest(_a, ["action"]);
        const ref = React.createRef();
        if (!!ref.current)
            new SyfrClass(ref.current, id);
        // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
        const _action = action !== null && action !== void 0 ? action : "#";
        return React.createElement("form", Object.assign({ ref: ref, action: _action }, props));
    };
}
