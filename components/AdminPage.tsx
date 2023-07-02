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
      {props.user
        ? (
          <div>
            {props.children}
          </div>
        )
        : (
          <div class="flex justify-center mt-16">
            <a
              class="inline-block px-3 py-2 bg-blue-800 text-white hover:bg-blue-700 rounded"
              href="/auth/signin"
            >
              Log in
            </a>
          </div>
        )}
    </div>
  );
}
