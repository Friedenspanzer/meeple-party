import { useTranslation } from "@/i18n";

export default async function Page() {
  const { t } = await useTranslation("auth");
  return (
    <>
      <div className="row mt-5 justify-content-center">
        <div className="col-md-6 text-center">
          <h4>{t("Verify.CheckEmail")}</h4>
          <p className="lead">{t("Verify.LoginLinkSent")}</p>
          <p>{t("Verify.CheckAgain")}</p>
          <p>{t("Verify.CanClose")}</p>
        </div>
      </div>
    </>
  );
}
