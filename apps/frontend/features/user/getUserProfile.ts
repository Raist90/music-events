import { apiClient } from "@/lib/client/client";

export async function getUserProfile() {
  try {
    const { data, error, response } = await apiClient.GET("/user/me", {
      credentials: "include",
    });
    if (error) {
      throw error;
    }
    if (!data || !response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }
    return data;
  } catch (err) {
    // TODO: we should empty the refresh_token cookie
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("Error fetching user profile: " + message);
  }
}
