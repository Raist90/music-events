import { z } from "zod";
import { translate } from "@/lib/translate";

const { t } = translate("it");

export const loginBodySchema = z.object({
  username: z.string().optional(),
  email: z.email(t("loginForm.errors.invalid_email")),
  password: z.string().min(8, t("loginForm.errors.invalid_password")),
});

export const registerBodySchema = z.object({
  username: z.string().min(1, t("registerForm.errors.invalid_username")),
  email: z.email(t("registerForm.errors.invalid_email")),
  password: z.string().min(8, t("registerForm.errors.invalid_password")),
});
