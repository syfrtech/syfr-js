import React from "react";
import { SyfrClass, SyfrClassOptions } from "./class";

type ReactFormProps = Omit<
  React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >,
  "action" | "onSubmit"
>;

type useSyfrFormOptions = SyfrClassOptions &
  Required<Pick<SyfrClassOptions, "id">>;

export const useSyfrForm = (options: useSyfrFormOptions) => {
  let linkProps = {
    rel: "",
    href: `https://syfr.app/validate/${options.id}`,
    ["data-syfr-validate"]: true,
  };

  const SyfrForm = (props: ReactFormProps) => {
    // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
    const action = "#";
    return (
      <form
        ref={(form) => {
          if (!!form) {
            new SyfrClass(form, options);
          }
        }}
        {...props}
        action={action}
      />
    );
  };

  return [SyfrForm, linkProps] as const;
};
