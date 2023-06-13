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
      <header class="text-sm bg-gray-800 text-white p-4 flex">
        <div class="flex-grow flex gap-4">
          <a href="/admin">Admin page</a>
          <a href="/" target="_blank">My website</a>
        </div>
        <Header user={props.user} />
      </header>
      <div>
        {props.children}
      </div>
    </div>
  );
}
