import { SyfrClass } from "./class";

export function SyfrForm({
  syfrId,
  Form,
}: {
  syfrId: string;
  Form: HTMLFormElement;
}) {
  new SyfrClass(Form, syfrId);
  return Form;
}
