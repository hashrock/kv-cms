import { Handlers } from "$fresh/server.ts";
import { getUserById, setUserWithSession } from "🛠️/db.ts";
import { getAuthenticatedUser } from "🛠️/github.ts";
import { handleCallback } from "kv_oauth";
import { User } from "🛠️/types.ts";
import { client } from "🛠️/kv_oauth.ts";

export const handler: Handlers = {
  async GET(req) {
    const { response, tokens, sessionId } = await handleCallback(req, client);
    const ghUser = await getAuthenticatedUser(tokens!.accessToken);

    const userInDb = await getUserById(String(ghUser.id));

    if (userInDb) {
      await setUserWithSession({
        id: String(ghUser.id),
        login: ghUser.login,
        name: ghUser.name,
        avatarUrl: ghUser.avatar_url,
        role: userInDb.role,
        status: userInDb.status,
      }, sessionId);
    } else {
      const user: User = {
        id: String(ghUser.id),
        name: ghUser.name,
        avatarUrl: ghUser.avatar_url,
        login: ghUser.login,
        role: "guest",
        status: "pending",
      };
      await setUserWithSession(user, sessionId);
    }
    return response;
  },
};
