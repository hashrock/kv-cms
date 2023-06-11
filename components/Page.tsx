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

            <a class="text-blue-500 hover:text-blue-400" href="/auth/signout">
              Log out
            </a>
          </div>
        )
        : (
          <>
            <a class="text-blue-500 hover:text-blue-400" href="/auth/signin">
              Log in
            </a>
          </>
        )}
    </>
  );
}

export function Page(props: PageProps) {
  return (
    <div
      {...props}
      class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <header class="text-right">
        <Header user={props.user} />
      </header>
      <div>
        {props.children}
      </div>
    </div>
  );
}
