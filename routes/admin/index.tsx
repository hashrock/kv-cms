import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listImage, listPost } from "🛠️/db.ts";

import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "../../components/Layout.tsx";

type Data = SignedInData | null;

interface SignedInData {
  user: User;
  posts: Post[];
  images: Image[];
}

export async function handler(req: Request, ctx: HandlerContext<Data, State>) {
  if (!ctx.state.session) return ctx.render(null);

  const user = await getUserBySession(ctx.state.session);
  if (!user) return ctx.render(null);

  const posts = await listPost();
  const images = await listImage();
  return ctx.render({ user, posts, images });
}

export default function Home(props: PageProps<Data>) {
  const nav = <Nav current="index" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8 space-y-8">
          <h1 class="text-4xl">
            Configuration
          </h1>

          <div class="space-y-4">
            <div>
              <label class="text-2xl" htmlFor="configTitle">Page title</label>
            </div>
            <div>
              <input
                id="configTitle"
                type="text"
                class="px-4 py-2 border border-gray-500 rounded"
              />
            </div>
          </div>
        </div>
      </Layout>
    </AdminPage>
  );
}
