import { HandlerContext, PageProps } from "$fresh/server.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getPost, getUserBySession, listImage, listPost } from "🛠️/db.ts";
import { Contents } from "🧱/Contents.tsx";
import { CmsConfig, getConfig } from "@/utils/config.ts";
import { LoginNav } from "../../components/LoginNav.tsx";

interface SignedInData {
  user: User | null;
  post: Post;
  config: CmsConfig;
}

export async function handler(
  req: Request,
  ctx: HandlerContext<SignedInData, State>,
) {
  let user: User | null = null;
  if (ctx.state.session) {
    user = await getUserBySession(ctx.state.session);
  }

  const post = await getPost(ctx.params.id);
  if (post === null) {
    return new Response("Not Found", { status: 404 });
  }

  const config = await getConfig();

  return ctx.render({ user, post, config });
}

export default function Home(props: PageProps<SignedInData>) {
  return (
    <>
      <body class="bg-gray-100">
        {props.data?.user && <LoginNav user={props.data.user} />}
        <div class="text-4xl px-4 py-16 mx-auto max-w-screen-lg ">
          <a class="hover:underline" href="/">{props.data.config.title}</a>
        </div>

        <div class="px-4 py-4 mx-auto max-w-screen-lg">
          <Contents
            class="flex-grow"
            user={props.data.user}
            posts={[props.data.post]}
            single
          />
        </div>
      </body>
    </>
  );
}
