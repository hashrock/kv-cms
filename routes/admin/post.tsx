import { HandlerContext, PageProps } from "$fresh/server.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listImage, listPost } from "🛠️/db.ts";

import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";
import PostList from "../../islands/PostList.tsx";

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
  const nav = <Nav current="post" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8">
          <PostList collection="post" />
        </div>
      </Layout>
    </AdminPage>
  );
}
