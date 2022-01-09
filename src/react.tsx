import React from "react";
import { SyfrClass } from "./class";

export function SyfrForm({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const formRef =
    React.useRef<HTMLFormElement>() as React.MutableRefObject<HTMLFormElement>;
  !!formRef.current && new SyfrClass(formRef.current, id);
  return <form ref={formRef}>{children}</form>;
}
