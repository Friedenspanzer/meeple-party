import { getTranslation } from "@/i18n";
import AvatarDisplay from "./AvatarDisplay/AvatarDisplay";
import AvatarUpload from "./AvatarUpload/AvatarUpload";

export const metadata = {
  title: "Edit your avatar",
};

export default async function AvatarPage() {
  const { t } = await getTranslation("profile");
  return (
    <>
      <div className="row">
        <div className="col-6">
          <h2>{t("Avatar.Header")}</h2>
          <AvatarDisplay />
        </div>
        <div className="col-6">
          <h2>{t("Avatar.Upload")}</h2>
          <AvatarUpload />
        </div>
      </div>
      <div className="row">
        <div className="col-6"></div>
        <div className="col-6 mt-2">
          <div className="alert alert-info" role="alert">
            <i className="bi bi-info-circle"></i> {t("Avatar.Restrictions")}
          </div>
        </div>
      </div>
    </>
  );
}
