import { Handlers } from "$fresh/server.ts";
import { addPost, getUserBySession } from "🛠️/db.ts";
import { Post, State, User } from "🛠️/types.ts";
interface Data {
  post: Post;
  user: User | null;
}
export const handler: Handlers<Data, State> = {
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
    const body = form.get("body")?.toString();
    if (!body) {
      return new Response("Bad Request", { status: 400 });
    }

    await addPost(title, body, user.id);

    return redirect();
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
