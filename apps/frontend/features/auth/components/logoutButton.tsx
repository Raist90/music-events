"use client";

import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/client/client";
import { translate } from "@/lib/translate";

export function LogoutButton() {
  const { t } = translate("it");
  const router = useRouter();

  const onLogout = async () => {
    try {
      const { response } = await apiClient.DELETE("/auth/logout", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`);
      }

      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected exception";
      console.error("Logout error: " + message);
    }
  };

  return (
    <button
      onClick={onLogout}
      className="lg:font-bold font-semibold uppercase lg:capitalize cursor-pointer hover:text-blue-300"
    >
      {t("navigation.auth.logout")}
    </button>
  );
}
