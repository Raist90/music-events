import "server-only";

import { cookies } from "next/headers";

export async function getSession() {
  const isLoggedIn =
    (await cookies()).get("refresh_token")?.value !== undefined;

  return {
    isLoggedIn,
  };
}
