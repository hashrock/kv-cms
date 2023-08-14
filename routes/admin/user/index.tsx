import { HandlerContext, PageProps } from "$fresh/server.ts";

import { State, User } from "🛠️/types.ts";
import { getUserBySession, listUser } from "🛠️/db.ts";

import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";

type Data = SignedInData | null;

interface SignedInData {
  user: User;
  users: User[];
}

export async function handler(req: Request, ctx: HandlerContext<Data, State>) {
  if (!ctx.state.session) return ctx.render(null);

  const user = await getUserBySession(ctx.state.session);
  if (!user) return ctx.render(null);

  const users = await listUser();
  return ctx.render({ user, users });
}

function UserRow(props: { user: User }) {
  return (
    <div class="flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-200 rounded-md">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary-600">
        </div>
        <a
          class="flex items-center hover:underline"
          href={`/admin/user/${props.user.id}`}
        >
          <img
            class="w-8 h-8 rounded-full"
            src={props.user.avatarUrl}
            alt=""
          />
          <div class="ml-4">{props.user.name}</div>
        </a>
      </div>
      <div class="flex items-center space-x-2">
        <div class="text-sm font-medium text-gray-900">{props.user.role}</div>
        <div class="text-sm text-gray-500">{props.user.status}</div>
      </div>
    </div>
  );
}

export default function Home(props: PageProps<Data>) {
  const nav = <Nav current="user" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8 space-y-16">
          <div class="space-y-4">
            <h2 class="text-xl">Admin users</h2>

            <p>
              Admin users have access to all admin pages, and can create and
              edit
            </p>

            {props.data?.users.filter((u) => u.role === "admin").map((user) => (
              <UserRow user={user} />
            ))}
          </div>
          <div class="space-y-4">
            <h2 class="text-xl">Editors</h2>

            <p>
              Editors can create and edit pages, but cannot access admin pages.
            </p>

            {props.data?.users.filter((u) => u.role === "user").map((user) => (
              <UserRow user={user} />
            ))}
          </div>

          <div class="space-y-4">
            <h2 class="text-xl">Guests</h2>
            <p>
              Guests cannot view, create or edit pages.
            </p>

            {props.data?.users.filter((u) => u.role === "guest").map((user) => (
              <UserRow user={user} />
            ))}
          </div>
        </div>
      </Layout>
    </AdminPage>
  );
}
