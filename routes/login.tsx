import { Handlers, PageProps } from "$fresh/server.ts";
import { JSX } from "preact";
import { getUserBySession } from "🛠️/db.ts";
import { Image, Post, State, User } from "🛠️/types.ts";
import { redirect } from "@/utils/response.ts";
import LinkButton from "🧱/LinkButton.tsx";
import { canAccessAdminPage } from "🛠️/role.ts";

export const handler: Handlers<string, State> = {
  async GET(_, ctx) {
    if (!ctx.state.session) return ctx.render("");
    const user = await getUserBySession(ctx.state.session);

    if (user) {
      const [canAccess, reason] = await canAccessAdminPage(user);

      if (canAccess) {
        return redirect("/admin");
      }
      return ctx.render(reason);
    }
    return ctx.render("");
  },
};

export default function Home(props: PageProps<string>) {
  return (
    <div class="max-w-sm mx-auto flex flex-col gap-16 items-center mt-32">
      <div class="flex flex-col gap-4 items-center">
        <h1 class="text-4xl">KV CMS</h1>

        <p class="text-center">
          {props.data}
        </p>
      </div>

      <LinkButton href="/auth/signin" theme="primary">
        Log in with GitHub
      </LinkButton>
    </div>
  );
}
