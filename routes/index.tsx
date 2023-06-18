import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listPost } from "🛠️/db.ts";
import { Contents } from "../components/Contents.tsx";
import { CmsConfig, getConfig } from "../utils/config.ts";
import markdown from "../utils/markdown.ts";

interface SignedInData {
  user: User | null;
  posts: Post[];
  title: string;
  about: string;
}

export async function handler(
  req: Request,
  ctx: HandlerContext<SignedInData, State>,
) {
  let user: User | null = null;
  if (ctx.state.session) {
    user = await getUserBySession(ctx.state.session);
  }

  const config = await getConfig();
  const posts = await listPost();

  const title = config.title;
  const about = markdown(config.about);
  return ctx.render({ user, posts, title, about });
}

export default function Home(props: PageProps<SignedInData>) {
  return (
    <>
      <body class="bg-gray-100">
        {props.data?.user && (
          <div class="bg-gray-900 text-gray-50">
            <a href="/admin">
              Admin Panel
            </a>
          </div>
        )}
        <div class="text-4xl px-4 py-16 mx-auto max-w-screen-lg ">
          <a class="hover:underline" href="/">{props.data.title}</a>
        </div>

        <div class="px-4 py-4 mx-auto max-w-screen-lg flex gap-8">
          <Contents
            class="flex-grow"
            user={props.data.user}
            posts={props.data.posts}
          />
          <div class="flex-none w-64">
            <h2 class="text-4xl">
              About
            </h2>
            <div class="text-lg text-gray-500 mt-8">
              <p dangerouslySetInnerHTML={{ __html: props.data.about }}>
              </p>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}
