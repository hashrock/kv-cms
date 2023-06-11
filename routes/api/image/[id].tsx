import { Handlers } from "$fresh/server.ts";
import { deleteImage, getImage, getUserBySession } from "🛠️/db.ts";
import { State } from "🛠️/types.ts";

async function remove(
  id: string,
) {
  await deleteImage(id);
}

export const handler: Handlers<undefined, State> = {
  async GET(req, ctx) {
    const filename = ctx.params.id;
    const filenameWithoutExt = filename.split(".").slice(0, -1).join(".");

    // No auth
    const image = await getImage(filenameWithoutExt);
    if (image === null) {
      return new Response("Not Found", { status: 404 });
    }
    return new Response(image.body, {
      headers: {
        "content-type": image.meta?.type ?? "application/octet-stream",
      },
    });
  },
  async DELETE(req, ctx) {
    const user = await getUserBySession(ctx.state.session ?? "");
    if (user === null) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (user.id !== ctx.params.uid) {
      return new Response("Forbidden", { status: 403 });
    }
    remove(ctx.params.id);
    return new Response("ok");
  },
};
