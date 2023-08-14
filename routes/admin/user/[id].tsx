import { Handlers, PageProps } from "$fresh/server.ts";
import {
  deletePost,
  deleteUser,
  getPost,
  getUserById,
  updatePost,
  updateUser,
} from "🛠️/db.ts";

import { Post, State, User, type UserRole, type UserStatus } from "🛠️/types.ts";
import { getUserBySession } from "🛠️/db.ts";

import { AdminPage } from "@/components/AdminPage.tsx";
import { Nav } from "@/components/Nav.tsx";
import { Layout } from "@/components/Layout.tsx";
import IconChevronLeft from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/chevron-left.tsx";
import Button from "🧱/Button.tsx";

async function put(user: User, id: string, form: FormData) {
  if (!id) {
    return new Response("Bad Request", { status: 400 });
  }
  const role = form.get("role")?.toString() as UserRole;
  const status = form.get("status")?.toString() as UserStatus;

  if (!role || !status) {
    return new Response("Bad Request", { status: 400 });
  }

  const editingUser = await getUserById(id);
  if (!editingUser) {
    return new Response("Not Found", { status: 404 });
  }

  await updateUser({
    ...editingUser,
    role,
    status,
  });

  return redirect("/admin/user");
}

async function remove(
  id: string,
) {
  await deleteUser(id);
  return redirect("/admin/user");
}

interface Data {
  user?: User;
  editingUser?: User;
}
export const handler: Handlers<Data, State> = {
  async GET(req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) return ctx.renderNotFound();
    const editingUser = await getUserById(ctx.params.id);
    if (!editingUser) return ctx.renderNotFound();
    return ctx.render({ user, editingUser });
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
      return remove(ctx.params.id);
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
  const nav = <Nav current="user" />;
  return (
    <AdminPage user={props.data?.user}>
      <Layout left={nav}>
        <div class="p-8">
          <div class="mb-4">
            <a href="/admin/user" class="flex text-blue-500 hover:underline">
              <IconChevronLeft class="w-6 h-6" /> Back
            </a>
            <h1 class="text-xl">Edit user</h1>
          </div>

          <div>
            <form
              class="space-y-2"
              method="POST"
              action={`/admin/user/${props.data.editingUser?.id}`}
            >
              <div>
                Role:{" "}
                <select name="role" value={props.data.editingUser?.role}>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </select>
              </div>
              <div>
                Status:{" "}
                <select name="status" value={props.data.editingUser?.status}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <div>
                <input type="hidden" name="_method" value="PUT" />
                <Button type="submit" theme="primary">Save</Button>
              </div>
            </form>
          </div>
          <div class="mt-4">
            <form
              method="POST"
              action={`/admin/user/${props.data.editingUser?.id}`}
            >
              <input type="hidden" name="_method" value="DELETE" />
              <Button type="submit" theme="danger">Delete</Button>
            </form>
          </div>
        </div>
      </Layout>
    </AdminPage>
  );
}
