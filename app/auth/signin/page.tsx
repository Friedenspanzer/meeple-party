import { getServerSession } from "@/utility/serverSession";
import { getProviders } from "next-auth/react";
import { redirect } from "next/navigation";
import ProviderButton from "./ProviderButton/ProviderButton";
import Link from "next/link";
import EmailLogin from "./EmailLogin/EmailLogin";
import { useTranslation } from "@/i18n";

export default async function SignIn() {
  const session = await getServerSession();
  const { t } = await useTranslation("auth");

  if (session) {
    redirect("/app");
  }

  const providers = (await getProviders()) ?? [];

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1>{t("Title")}</h1>
        </div>
      </div>

      <div className="row mt-5 justify-content-center">
        <div className="col-md-6 text-center">
          <h4>{t("UsingEmail")}</h4>
        </div>
      </div>

      <EmailLogin />

      <div className="row mt-5 justify-content-center">
        <div className="col-md-6 text-center">
          <h4>{t("UsingSocial")}</h4>
        </div>
      </div>

      {Object.values(providers)
        .filter((p) => p.id !== "email")
        .map((provider) => (
          <ProviderButton provider={provider} key={provider.id} />
        ))}

      <div className="row mt-5 justify-content-center">
        <div className="col-md-2 d-grid">
          <Link className="btn btn-secondary" href="/">
            <i className="bi bi-arrow-left"></i> {t("Back")}
          </Link>
        </div>
      </div>
    </>
  );
}
