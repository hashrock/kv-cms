import { Handlers, PageProps } from "$fresh/server.ts";
import { deletePost, getPost, updatePost } from "🛠️/db.ts";

import { Post, State, User } from "🛠️/types.ts";
import { getUserBySession } from "🛠️/db.ts";

import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";
import { EditorForm } from "@/components/EditorForm.tsx";

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

  return redirect("/admin/post");
}

async function remove(
  user: User,
  id: string,
) {
  await deletePost(id);
  return redirect("/admin/post");
}

interface Data {
  post: Post;
  user?: User;
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
  const post = props.data?.post;

  const nav = <Nav current="post" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8">
          <h1 class="text-2xl">Edit post</h1>
          {post && <EditorForm post={post} />}

          <form
            action={`/admin/post/${post.id}`}
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
      </Layout>
    </AdminPage>
  );
}
