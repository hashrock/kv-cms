import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listImage, listPost } from "🛠️/db.ts";

import { JSX } from "preact";
import render from "../utils/markdown.ts";

interface SignedInData {
  user: User | null;
  posts: Post[];
  images: Image[];
}

export async function handler(
  req: Request,
  ctx: HandlerContext<SignedInData, State>,
) {
  let user: User | null = null;
  if (ctx.state.session) {
    user = await getUserBySession(ctx.state.session);
  }

  const posts = await listPost();
  const images = await listImage();
  return ctx.render({ user, posts, images });
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

        <div class="px-4 py-4 mx-auto max-w-screen-lg flex gap-8">
          <Contents
            class="flex-grow"
            user={props.data.user}
            images={props.data.images}
            posts={props.data.posts}
          />
          <div class="flex-none w-64">
            <h2 class="text-4xl">
              About
            </h2>
            <div class="text-lg text-gray-500 mt-8">
              <p>
                This is a sample blog application for KV CMS.
              </p>
            </div>
          </div>
        </div>
      </body>
    </>
  );
}

interface ContentsProps extends JSX.HTMLAttributes<HTMLDivElement> {
  user: User | null;
  images: Image[];
  posts: Post[];
}

function Contents(props: ContentsProps) {
  const user = props.user ?? null;
  const userId = user?.id ?? null;

  return (
    <>
      <div class={props.class}>
        <ul class="space-y-3">
          {props.posts.map((post) => {
            return (
              <li>
                <div class="mb-16 pb-8 border-b-1 border-gray-400">
                  <h2 class="text-4xl">
                    {post?.title}
                  </h2>

                  <div
                    class="text-lg text-gray-500 mt-8"
                    dangerouslySetInnerHTML={{ __html: render(post?.body) }}
                  >
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
