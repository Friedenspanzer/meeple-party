import DeleteAccount from "@/components/DeleteAccount/DeleteAccount";
import LanguagePicker from "@/components/LanguagePicker/LanguagePicker";
import { getTranslation } from "@/i18n";

export default async function Page() {
  const { t } = await getTranslation("settings");

  return (
    <div className="grid">
      <div className="row">
        <div className="col-8 offset-md-2">
          <h2>{t("Language.Title")}</h2>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-8 offset-md-2">
          <h3>{t("Language.Page")}</h3>
          <LanguagePicker
            availableLanguages={["auto", "en", "de"]}
            type="page"
          />
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-8 offset-md-2">
          <h3>{t("Language.Games")}</h3>
          <LanguagePicker
            availableLanguages={["follow", "auto", "en"]}
            type="game"
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-8 offset-md-2">
          <h2>{t("DangerZone.Title")}</h2>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-8 offset-md-2">
          <h3>{t("DangerZone.AccountDeletion")}</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-8 offset-md-2">
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
