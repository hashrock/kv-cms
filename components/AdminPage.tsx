import { JSX } from "preact";
import { User } from "@/utils/types.ts";

interface PageProps extends JSX.HTMLAttributes<HTMLDivElement> {
  user?: User;
}

function Header(props: { user?: User }) {
  return (
    <>
      {props.user
        ? (
          <div class="flex gap-2 justify-end">
            <span class="text-gray-900 font-medium">
              {props.user.name}
            </span>

            <a class="text-blue-300 hover:text-blue-400" href="/auth/signout">
              Log out
            </a>
          </div>
        )
        : (
          <>
            <a class="text-blue-300 hover:text-blue-400" href="/auth/signin">
              Log in
            </a>
          </>
        )}
    </>
  );
}

export function AdminPage(props: PageProps) {
  return (
    <div
      {...props}
      class={"" +
        (props.class ? " " + props.class : "")}
    >
      <header class="text-right bg-gray-800 text-white p-2">
        <Header user={props.user} />
      </header>
      <div>
        {props.children}
      </div>
    </div>
  );
}
