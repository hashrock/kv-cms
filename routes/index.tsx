import { HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listImage, listPost } from "🛠️/db.ts";

import { Header } from "🧱/Header.tsx";
import { JSX } from "preact";
import render from "../utils/markdown.ts";

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
  const images = await listImage(user.id);
  return ctx.render({ user, posts, images });
}

export default function Home(props: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>KV CMS</title>
      </Head>
      <body class="bg-gray-100">
        <div class="px-4 py-8 mx-auto max-w-screen-md">
          <Header user={props.data?.user ?? null} />
          {props.data ? <SignedIn {...props.data} /> : <SignedOut />}
        </div>
      </body>
    </>
  );
}

function SignedIn(props: SignedInData) {
  const user = props.user ?? null;
  const userId = user?.id ?? null;

  return (
    <>
      <div class="">
        <div class="mt-16 flex justify-end">
          <a href="/new">
            Create New
          </a>
        </div>
        <ul class="space-y-3 mt-8">
          {props.posts.map((post) => {
            return (
              <li>
                <a
                  class="block bg-white py-6 px-8 shadow rounded hover:shadow-lg transition duration-200 border-l-8 border-gray-400"
                  href={`/post/${post?.id}`}
                >
                  <h2 class="text-lg">
                    {post?.title}
                  </h2>

                  <p
                    class="text-sm text-gray-500"
                    dangerouslySetInnerHTML={{ __html: render(post?.body) }}
                  >
                  </p>
                </a>
              </li>
            );
          })}
        </ul>
        <div class="mt-8">
          <a href={`/image/${userId}`} class="text-blue-500 hover:underline">
            Uploaded Images
          </a>
        </div>
      </div>
    </>
  );
}

function SignedOut() {
  return (
    <>
      <p class="my-6">
        <ButtonLink href="/auth/signin">
          Log in with GitHub
        </ButtonLink>
      </p>
    </>
  );
}
