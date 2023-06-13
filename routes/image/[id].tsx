import { Handlers } from "$fresh/server.ts";
import { getImage } from "🛠️/db.ts";
import { State } from "🛠️/types.ts";

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
};
