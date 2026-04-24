import { apiClient } from "@/lib/client/client";

export async function getAccessToken() {
  try {
    const { data, error } = await apiClient.POST("/auth/refresh", {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!data?.access_token || error) {
      throw error;
    }
    return data.access_token as string;
  } catch (err) {
    console.error("Error fetching access token", err);
  }
}
