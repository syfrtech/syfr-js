import React from "react";
import { SyfrClass } from "./class";

type ReactFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

export const useSyfrForm = (
  id: NonNullable<ConstructorParameters<typeof SyfrClass>[1]>,
  handleForm?: (form: HTMLFormElement) => void
) => {
  let linkProps = {
    rel: "",
    href: `https://syfr.app/validate/${id}`,
    ["data-syfr-validate"]: true,
  };

  const SyfrForm = ({ action, onSubmit, ...props }: ReactFormProps) => {
    // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
    const _action = action ?? "#";
    return (
      <form
        ref={(form) => {
          if (!!form) {
            new SyfrClass(form, id);
            !!handleForm && handleForm(form);
          }
        }}
        action={_action}
        {...props}
      />
    );
  };

  return [SyfrForm, linkProps] as const;
};
