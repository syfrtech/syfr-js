import { SyfrClass } from "./class";

export function SyfrForm({
  id,
  children,
}: {
  id: string;
  children: HTMLFormElement;
}) {
  new SyfrClass(children, id);
  return children;
}
