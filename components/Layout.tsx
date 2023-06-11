import { JSX } from "preact";

interface PageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  left?: JSX.Element;
}

export function Layout(props: PageProps) {
  return (
    <div
      class={"flex flex-row min-h-screen" +
        (props.class ? " " + props.class : "")}
      {...props}
    >
      <div class="flex-none">{props.left}</div>
      <div class="flex-1">{props.children}</div>
    </div>
  );
}
