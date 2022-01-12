import React from "react";
import { SyfrClass } from "./class";
import { SyfrFormId } from "./types";

type ReactFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

export const useSyfrForm = (id: SyfrFormId) => {
  return ({ action, ...props }: ReactFormProps) => {
    let [form, setForm] = React.useState<HTMLFormElement | null>();
    React.useEffect(() => {
      if (!!form) new SyfrClass(form, id);
    }, [form]);
    // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
    const _action = action ?? "#";
    if (typeof window === "undefined") return <React.Fragment />;
    return (
      <form
        ref={(element) => {
          setForm(element);
        }}
        action={_action}
        {...props}
      />
    );
  };
};
