import { Handlers } from "$fresh/server.ts";
import { addPost, getUserBySession, listPost } from "🛠️/db.ts";
import { Image, State, User } from "🛠️/types.ts";
interface SignedInData {
  user: User;
  images: Image[];
}
export const handler: Handlers<SignedInData, State> = {
  async GET(_req, _ctx): Promise<Response> {
    const list = await listPost();
    return new Response(JSON.stringify(list), {
      headers: { "content-type": "application/json" },
    });
  },
  async POST(req, ctx): Promise<Response> {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { title, body } = await req.json();
    const id = await addPost(title, body, user.id);
    return new Response(JSON.stringify({ id }), {
      headers: { "content-type": "application/json" },
    });
  },
};
