import { SyfrForm as Syfr } from "./form";

export function SyfrForm({
  syfrId,
  Form,
}: {
  syfrId: string;
  Form: HTMLFormElement;
}) {
  new Syfr(Form, syfrId);
  return Form;
}
