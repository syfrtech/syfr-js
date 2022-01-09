import { SyfrClass } from "./class";

export function SyfrForm({ id, Form }: { id: string; Form: HTMLFormElement }) {
  new SyfrClass(Form, id);
  return Form;
}
