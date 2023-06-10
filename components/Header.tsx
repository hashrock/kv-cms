import { User } from "🛠️/types.ts";

const linkClass = "text-sm text-blue-500 hover:underline";

export function Header(props: { user: User | null }) {
  return (
    <>
      <div class="flex justify-between items-center">
        <a href="/">
          <h1 class="text-4xl font-bold">KV CMS</h1>
        </a>
      </div>

      <div class="flex gap-2 justify-end">
        {props.user
          ? (
            <>
              <span class="text-sm text-gray-600">
                {props.user.name}
              </span>
              <a class={linkClass} href="/auth/signout">
                Log out
              </a>
            </>
          )
          : (
            <>
              <a class={linkClass} href="/auth/signin">
                Log in
              </a>
            </>
          )}
      </div>
    </>
  );
}
