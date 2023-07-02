import { JSX } from "preact";
import { User } from "@/utils/types.ts";
import { LoginNav } from "./LoginNav.tsx";

interface PageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  user?: User;
}

export function Page(props: PageProps) {
  return (
    <div
      {...props}
      class={"max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8" +
        (props.class ? " " + props.class : "")}
    >
      <LoginNav user={props.user} />

      <div>
        {props.children}
      </div>
    </div>
  );
}
