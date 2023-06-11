import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listImage, listPost } from "🛠️/db.ts";

import { Header } from "🧱/Header.tsx";
import { Page } from "@/components/Page.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";

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
        Posts
      </Layout>
    </Page>
  );
}
