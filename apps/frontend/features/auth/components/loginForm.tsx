import { useRouter } from "next/navigation";
import { useState, type SubmitEvent } from "react";
import { $ZodIssue } from "zod/v4/core";
import { loginBodySchema } from "../schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/client/client";
import { translate } from "@/lib/translate";

export default function LoginForm() {
  const { t } = translate("it");
  const router = useRouter();

  const [errors, setErrors] = useState<$ZodIssue[]>([]);

  const onSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const {
        data: body,
        error: validationError,
        success: isBodyValid,
      } = loginBodySchema.safeParse({
        username: formData.get("username") || "",
        email: formData.get("email"),
        password: formData.get("password"),
      });
      if (!isBodyValid) {
        setErrors(validationError.issues.map((err) => err));
        console.error("Validation error", validationError);
        throw new Error("Invalid form data");
      }
      const { error, response } = await apiClient.POST("/auth/login", {
        body,
        credentials: "include",
      });
      if (error || !response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected exception";
      console.error("Error during login: " + message);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field>
          <Label htmlFor="email">Email o username</Label>
          <Input
            autoComplete="username"
            id="email"
            name="email"
            type="email"
            aria-invalid={!!errors.find((e) => e.path.includes("email"))}
          />
          <FieldDescription>
            {errors.find((e) => e.path.includes("email"))?.message}
          </FieldDescription>
        </Field>

        <Field>
          <Label htmlFor="password">Password</Label>
          <Input
            autoComplete="current-password"
            id="password"
            name="password"
            type="password"
            aria-invalid={!!errors.find((e) => e.path.includes("password"))}
          />
          <FieldDescription>
            {errors.find((e) => e.path.includes("password"))?.message}
          </FieldDescription>
        </Field>

        <Field orientation="horizontal">
          <Checkbox className="rounded-none" id="remember" name="remember" />
          <Label htmlFor="remember">{t("loginForm.remember_me")}</Label>
        </Field>
      </FieldGroup>

      {/* Separator */}
      <div className="mt-6 mb-7 bg-input h-px" />

      <button
        className="font-semibold cursor-pointer hover:text-blue-300 py-1 px-3 border bg-input/50 w-full rounded h-9"
        type="submit"
      >
        {t("navigation.auth.login")}
      </button>
    </form>
  );
}
