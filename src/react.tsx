import React from "react";
import { SyfrClass } from "./class";
import { SyfrFormId } from "./types";

type ReactFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;
export type SyfrFormProps = { id: SyfrFormId } & ReactFormProps;

export function SyfrForm({ id, action, ...props }: SyfrFormProps) {
  const ref = React.useRef<HTMLFormElement>(null);
  if (!!ref.current) new SyfrClass(ref.current, id);
  // iOS needs an "action" attribute for nice input: https://stackoverflow.com/a/39485162/406725
  const _action = action ?? "#";
  return <form ref={ref} action={_action} {...props} />;
}
