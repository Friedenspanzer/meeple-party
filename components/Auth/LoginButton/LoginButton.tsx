"use client";

import { useTranslation } from "@/i18n/client";
import { Button } from "@mantine/core";
import { signIn } from "next-auth/react";

export interface LoginButtonProps {
  redirectUrl?: string;
}

export default function LoginButton({
  redirectUrl = "/app",
}: Readonly<LoginButtonProps>) {
  const { t } = useTranslation();
  return (
    <Button onClick={() => signIn(undefined, { callbackUrl: redirectUrl })}>
      {t("Login.Register")}
    </Button>
  );
}
