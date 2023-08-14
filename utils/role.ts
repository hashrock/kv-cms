import { getConfig } from "🛠️/config.ts";
import { User } from "🛠️/types.ts";

export async function canAccessAdminPage(
  user: User,
): Promise<[boolean, string]> {
  const config = await getConfig();
  if (config.demoMode && (user.role === "guest")) {
    return [true, "Demo mode is enabled"];
  }
  if ((user.role === "admin" || user.role === "user")) {
    return [true, "You have access"];
  }
  if (user.role === "guest" && user.status === "pending") {
    return [false, "Your account is pending approval"];
  }
  return [false, "You do not have access"];
}
