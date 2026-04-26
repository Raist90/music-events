import createClient, { Middleware } from "openapi-fetch";
import type { paths } from "@/schema";

let accessToken: string | undefined = undefined;

const UNPROTECTED_PATHS: (keyof paths)[] = [
  "/auth/login",
  "/auth/logout",
  "/auth/refresh",
  "/auth/register",
  "/events",
];

const authMiddleware: Middleware = {
  async onRequest({ request, schemaPath }) {
    if (UNPROTECTED_PATHS.some((path) => schemaPath.startsWith(path))) {
      return undefined;
    }

    if (!accessToken) {
      try {
        const { data, error, response } = await apiClient.POST(
          "/auth/refresh",
          {
            credentials: "include",
          },
        );
        if (error || !response.ok) {
          throw new Error("Failed to refresh access token: " + response.status);
        }
        accessToken = data?.access_token;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unexpected exception";
        console.error("Error refreshing access token: " + message);
      }
      request.headers.set("Authorization", `Bearer ${accessToken}`);
      return request;
    }
  },
};

export const apiClient = createClient<paths>({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});
apiClient.use(authMiddleware);
