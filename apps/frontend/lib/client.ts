import createClient from "openapi-fetch";
import type { paths } from "@/schema";

function getBaseUrl() {
  if (typeof window !== "undefined") return "/api";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return `${appUrl}/api`;
}

export const apiClient = createClient<paths>({
  baseUrl: getBaseUrl(),
});
