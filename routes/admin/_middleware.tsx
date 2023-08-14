import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { State } from "🛠️/types.ts";
import { getSessionId } from "kv_oauth";
import { redirect } from "🛠️/response.ts";
import { getUserBySession } from "🛠️/db.ts";
import { canAccessAdminPage } from "🛠️/role.ts";

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>,
) {
  ctx.state.session = getSessionId(req);

  if (!ctx.state.session) {
    return redirect("/login");
  }

  const user = await getUserBySession(ctx.state.session);
  if (!user) {
    return redirect("/login");
  }

  const [canAccess, _] = await canAccessAdminPage(user);
  if (!canAccess) {
    return redirect("/login");
  }

  return await ctx.next();
}
