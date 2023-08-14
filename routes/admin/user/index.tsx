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

export default function Home(props: PageProps<Data>) {
  const nav = <Nav current="user" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8">
          {props.data?.users.map((user) => (
            <div class="mb-4">
              <div class="mb-2 text-lg font-bold">
                <a href={`/admin/user/${user.id}`}>
                  {user.name}
                </a>
              </div>
              <div>
                Role: {user.role} Status:{user.status}
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </AdminPage>
  );
}
