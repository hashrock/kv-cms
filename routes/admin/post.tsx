import { HandlerContext, PageProps } from "$fresh/server.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listImage, listPost } from "🛠️/db.ts";

import { Page } from "@/components/Page.tsx";
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
  const nav = <Nav current="index" />;
  return (
    <Page user={props.data?.user}>
      <Layout left={nav}>
        <PostList collection="post" />
      </Layout>
    </Page>
  );
}
