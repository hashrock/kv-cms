import { Handlers } from "$fresh/server.ts";
import { addImage, getUserBySession } from "🛠️/db.ts";
import { Image, State, User } from "🛠️/types.ts";
import { PageProps } from "$fresh/server.ts";
import { listImage } from "🛠️/db.ts";
import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";
import { prettyDate } from "@/utils/date.ts";

interface SignedInData {
  user: User;
  images: Image[];
}

export const handler: Handlers<SignedInData, State> = {
  async POST(req, ctx) {
    const form = await req.formData();
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }
    const file = form.get("image") as File | null;
    if (!file) {
      return new Response("Bad Request", { status: 400 });
    }
    const reader = file.stream().getReader();
    const result = await reader.read();
    const bytes = result.value;
    if (!bytes) {
      return new Response("Bad Request", { status: 400 });
    }

    addImage(user.id, file);

    return redirect(`/admin/image/`);
  },
  async GET(req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return new Response("Unauthorized", { status: 401 });

    const images = await listImage();
    return ctx.render({ user, images });
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

export default function Home(props: PageProps<SignedInData>) {
  const user = props.data.user ?? null;
  const userId = user?.id ?? null;
  const nav = <Nav current="image" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8">
          <div>
            <form
              action={`/admin/image`}
              method="POST"
              encType="multipart/form-data"
            >
              <input type="file" name="image" />
              <input
                class="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
                type="submit"
                value="Upload"
              />
            </form>
          </div>

          <div class="grid grid-cols-4 gap-5 mt-8">
            {props.data.images.map((image) => {
              const fileName = `${image.id}.${image.type.split("/")[1]}`;

              const url = `/image/${fileName}`;
              return (
                <div class="shadow rounded-xl p-2 border border-gray-300">
                  <img
                    src={url}
                    alt={image?.name}
                    width="200"
                  />
                  <div>
                    {image.name}
                  </div>

                  <div>
                    {prettyDate(image.createdAt)}
                  </div>
                  <form
                    class="mt-2"
                    action={`/admin/image/${image.id}`}
                    method="POST"
                  >
                    <input type="hidden" name="_method" value="DELETE" />
                    <input type="hidden" name="id" value={image.id} />
                    <input
                      type="submit"
                      value="Delete"
                      class="px-2 py-1 bg-white border border-red-500 text-red-500 rounded-lg cursor-pointer hover:bg-red-500 hover:text-white"
                    />
                  </form>
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    </AdminPage>
  );
}
