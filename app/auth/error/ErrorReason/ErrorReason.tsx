"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/i18n/client";

const ErrorReason: React.FC = () => {
  const searchParams = useSearchParams();
  const reason = searchParams?.get("error");
  const { t } = useTranslation("auth");

  switch (reason) {
    case "Verification":
      return (
        <>
          <p>{t("Errors.TokenExpired")}</p>
          <Link className="btn btn-primary" href="/api/auth/signin">
            {t("TryAgain")}
          </Link>
        </>
      );
    case "Configuration":
    case "AccessDenied":
      return <p>{t("Errors.Configuration")}</p>;
    default:
      return <p>{t("Errors.Generic")}</p>;
  }
};

export default ErrorReason;
