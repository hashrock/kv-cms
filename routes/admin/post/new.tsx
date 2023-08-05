import { Handlers, PageProps } from "$fresh/server.ts";
import { addPost, getUserBySession } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";
import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";
import TextArea from "@/islands/TextArea.tsx";
import { redirect } from "@/utils/response.ts";

interface Data {
  user?: User;
}
export const handler: Handlers<Data, State> = {
  async GET(_, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return ctx.renderNotFound();
    return ctx.render({ user });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }

    const title = form.get("title")?.toString();
    if (!title) {
      return new Response("Bad Request", { status: 400 });
    }
    const body = form.get("body")?.toString() ?? "";

    await addPost(title, body, user.id);

    return redirect("/admin/post");
  },
};

export default function Home(props: PageProps<Data>) {
  const { user } = props.data;

  const yyyymmdd = new Date().toISOString().slice(0, 10);
  const nav = <Nav current="post" />;
  return (
    <>
      <AdminPage user={user}>
        <Layout left={nav}>
          <div class="p-8">
            <h1 class="text-2xl">Create new post</h1>
            <form
              action={`/admin/post/new`}
              method="POST"
              class="flex flex-col mt-8"
            >
              <div>
                <input
                  class="w-full  px-3 py-2  border-1 rounded"
                  type="text"
                  name="title"
                  value={yyyymmdd}
                />
              </div>
              <div>
                <TextArea />
              </div>
              <input
                type="submit"
                value="Create"
                class="mt-1 inline-block cursor-pointer px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
              />
            </form>
          </div>
        </Layout>
      </AdminPage>
    </>
  );
}
