"use client";

import { useState } from "react";
import LoginForm from "../loginForm";
import RegisterForm from "../registerForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { translate } from "@/lib/translate";

type Props = Readonly<{
  ref?: React.Ref<HTMLDivElement>;
}>;

export default function AuthDialog({ ref }: Props) {
  const { t } = translate("it");

  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button className="lg:font-bold font-semibold uppercase lg:capitalize cursor-pointer hover:text-blue-300">
            {t("navigation.auth.login")}
          </button>
        }
      />
      <DialogContent className="sm:max-w-sm rounded-none" ref={ref}>
        {mode === "login" ? (
          <Login toggleMode={() => setMode("register")} />
        ) : (
          <Register toggleMode={() => setMode("login")} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function Login({ toggleMode }: { toggleMode: () => void }) {
  const { t } = translate("it");
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("navigation.auth.login")}</DialogTitle>
      </DialogHeader>

      <div>
        <LoginForm />

        <footer className="text-center">
          <p className="mt-3">
            {t("loginForm.no_account")}{" "}
            <button
              onClick={toggleMode}
              className="cursor-pointer text-blue-300 underline underline-offset-2"
            >
              {t("navigation.auth.register")}
            </button>
          </p>
        </footer>
      </div>
    </>
  );
}

function Register({ toggleMode }: { toggleMode: () => void }) {
  const { t } = translate("it");
  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("navigation.auth.register")}</DialogTitle>
      </DialogHeader>

      <div>
        <RegisterForm />

        <footer className="text-center">
          <p className="mt-3">
            {t("registerForm.have_account")}{" "}
            <button
              onClick={toggleMode}
              className="cursor-pointer text-blue-300 underline underline-offset-2"
            >
              {t("navigation.auth.login")}
            </button>
          </p>
        </footer>
      </div>
    </>
  );
}
