import { JSX } from "preact";
import { User } from "@/utils/types.ts";
import { LoginNav } from "./LoginNav.tsx";

interface PageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  user?: User;
}

export function AdminPage(props: PageProps) {
  return (
    <div
      {...props}
      class={"" +
        (props.class ? " " + props.class : "")}
    >
      <LoginNav user={props.user} />
      <div>
        {props.children}
      </div>
    </div>
  );
}
