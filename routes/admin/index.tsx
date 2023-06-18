import { HandlerContext, Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

import { Image, Post, State, User } from "🛠️/types.ts";
import { getUserBySession, listImage, listPost } from "🛠️/db.ts";

import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";
import { redirect } from "@/utils/response.ts";
import { CmsConfig, getConfig, setConfig } from "@/utils/config.ts";

type Data = SignedInData | null;

interface SignedInData {
  user: User;
  posts: Post[];
  images: Image[];
  config: CmsConfig;
}

export const handler: Handlers<Data, State> = {
  async GET(_, ctx) {
    if (!ctx.state.session) return ctx.render(null);

    const user = await getUserBySession(ctx.state.session);
    if (!user) return ctx.render(null);

    const posts = await listPost();
    const images = await listImage();
    const config = await getConfig();

    return ctx.render({ user, posts, images, config });
  },
  async POST(req, ctx) {
    const form = await req.formData();
    const user = await getUserBySession(ctx.state.session ?? "");
    // TODO auth
    if (!user) return redirect("/admin");

    const title = form.get("title")?.toString() ?? "";
    const about = form.get("about")?.toString() ?? "";
    await setConfig({ title, about });

    return redirect("/admin/");
  },
};

export default function Home(props: PageProps<Data>) {
  const nav = <Nav current="index" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8 space-y-8">
          <h1 class="text-4xl">
            Configuration
          </h1>

          <div class="space-y-4">
            <div>
              <form action="/admin" method="POST">
                <div>
                  Title
                </div>
                <div>
                  <input
                    id="configTitle"
                    type="text"
                    name="title"
                    class="px-3 py-2 border border-gray-500 rounded"
                    value={props.data?.config.title}
                  />
                </div>

                <div>
                  About
                </div>
                <textarea
                  name="about"
                  id=""
                  cols={30}
                  rows={10}
                  class="px-3 py-2 border border-gray-500 rounded"
                  value={props.data?.config.about}
                >
                </textarea>

                <div>
                  <input
                    type="submit"
                    class="px-3 py-2 border border-gray-500 rounded"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </Layout>
    </AdminPage>
  );
}
