"use client";

import LinkButton from "@/components/LinkButton/LinkButton";
import { useTranslation } from "@/i18n/client";

export default function LoginButton() {
  const { t } = useTranslation();
  return <LinkButton href="/api/auth/signin">{t("Login.Register")}</LinkButton>;
}
