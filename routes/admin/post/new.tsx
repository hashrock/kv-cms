import { Handlers, PageProps } from "$fresh/server.ts";
import { addPost, getUserBySession } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";
import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";
import { redirect } from "@/utils/response.ts";
import { EditorForm } from "@/components/EditorForm.tsx";
import IconChevronLeft from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/chevron-left.tsx";

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
    <AdminPage user={user}>
      <Layout left={nav}>
        <div class="p-8">
          <div class="mb-4">
            <a href="/admin/post" class="flex text-blue-500 hover:underline">
              <IconChevronLeft class="w-6 h-6" />

              Back
            </a>
            <h1 class="text-xl">Create new post</h1>
          </div>
          <EditorForm post={{ title: yyyymmdd, body: "" }} />
        </div>
      </Layout>
    </AdminPage>
  );
}
