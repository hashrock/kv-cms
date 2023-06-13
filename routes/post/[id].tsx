import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getPost, getUserBySession, listImage, listPost } from "🛠️/db.ts";
import { Contents } from "🧱/Contents.tsx";

interface SignedInData {
  user: User | null;
  post: Post;
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
  return ctx.render({ user, post });
}

export default function Home(props: PageProps<SignedInData>) {
  return (
    <>
      <Head>
        <title>KV CMS</title>
      </Head>
      <body class="bg-gray-100">
        {props.data?.user && (
          <div class="bg-gray-900 text-gray-50">
            <a href="/admin">
              Admin Panel
            </a>
          </div>
        )}
        <div class="text-4xl px-4 py-16 mx-auto max-w-screen-lg ">
          <a class="hover:underline" href="/">Title</a>
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
