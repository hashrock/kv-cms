import { User } from "@/utils/types.ts";
export function LoginNav(props: { user?: User }) {
  return (
    <header class="text-sm bg-gray-800 text-white p-4 flex">
      <div class="flex-grow flex gap-4">
        <a href="/admin">Admin page</a>
        <a href="/" target="_blank">My website</a>
      </div>
      <Header user={props.user} />
    </header>
  );
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
