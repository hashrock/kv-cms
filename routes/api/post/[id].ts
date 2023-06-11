import { Handlers } from "$fresh/server.ts";
import { deletePost, getPost, getUserBySession, updatePost } from "🛠️/db.ts";
import { State, User } from "🛠️/types.ts";
interface SignedInData {
  user: User;
}

export const handler: Handlers<SignedInData, State> = {
  async GET(_req, ctx): Promise<Response> {
    const list = await getPost(ctx.params.id);
    return new Response(JSON.stringify(list), {
      headers: { "content-type": "application/json" },
    });
  },
  async PUT(req, ctx): Promise<Response> {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }
    const { title, body } = await req.json();
    await updatePost(user.id, ctx.params.id, title, body);
    return new Response(JSON.stringify({ id: ctx.params.id }), {
      headers: { "content-type": "application/json" },
    });
  },
  async DELETE(_req, ctx): Promise<Response> {
    const id = await deletePost(ctx.params.id);
    return new Response(JSON.stringify({ id }), {
      headers: { "content-type": "application/json" },
    });
  },
};
