import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { deletePost, getPost, getUserBySession, updatePost } from "🛠️/db.ts";
import { Post, State, User } from "🛠️/types.ts";

import { Header } from "🧱/Header.tsx";

async function put(user: User, id: string, form: FormData) {
  if (!id) {
    return new Response("Bad Request", { status: 400 });
  }
  const title = form.get("title")?.toString();
  if (!title) {
    return new Response("Bad Request", { status: 400 });
  }
  const body = form.get("body")?.toString();
  if (!body) {
    return new Response("Bad Request", { status: 400 });
  }

  await updatePost(id, title, body);

  return redirect();
}

async function remove(
  user: User,
  id: string,
) {
  await deletePost(id);
  return redirect();
}

interface Data {
  post: Post;
  user: User | null;
}
export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return ctx.renderNotFound();
    const post = await getPost(ctx.params.id);
    if (!post) return ctx.renderNotFound();

    return ctx.render({ post, user });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const method = form.get("_method")?.toString();
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    if (method === "PUT") {
      return put(user, ctx.params.id, form);
    }
    if (method === "DELETE") {
      return remove(user, ctx.params.id);
    }

    return new Response("Bad Request", { status: 400 });
  },
};

function redirect(location = "/") {
  const headers = new Headers();
  headers.set("location", location);
  return new Response(null, {
    status: 303,
    headers,
  });
}

export default function Home(props: PageProps<Data>) {
  const { post, user } = props.data;
  return (
    <>
      <Head>
        <title>
          {post.title} | KvMemo
        </title>
      </Head>
      <body class="bg-gray-100">
        <div class="px-4 py-8 mx-auto max-w-screen-md">
          <Header user={user} />

          <form
            class="mt-16 flex flex-col"
            action={`/post/${post.id}`}
            method="POST"
          >
            <div>
              <input
                class="w-full  px-3 py-2  border-1 rounded"
                type="text"
                name="title"
                value={post.title}
              />
            </div>
            <div>
              <textarea
                name="body"
                class="px-3 py-2 h-[32rem] w-full border-1 rounded"
              >
                {post.body}
              </textarea>
            </div>
            <input type="hidden" name="_method" value="PUT" />
            <input type="hidden" value={post.id} />
            <input
              type="submit"
              value="Update"
              class="mt-1 inline-block cursor-pointer px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
            />
          </form>

          <form
            action={`/post/${post.id}`}
            method="POST"
            class="flex justify-center"
          >
            <input type="hidden" name="_method" value="DELETE" />
            <input type="hidden" value={post.id} />
            <input
              class="inline-block mt-8 cursor-pointer px-3 py-2 border-red-800 text-red-800 bg-transparent rounded"
              type="submit"
              value="Delete This Note"
            />
          </form>
        </div>
      </body>
    </>
  );
}
