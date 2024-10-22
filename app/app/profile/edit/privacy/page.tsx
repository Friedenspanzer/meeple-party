import HideProfile from "@/app/app/profile/edit/privacy/_components/HideProfile/HideProfile";
import PlaceSearchable from "@/app/app/profile/edit/privacy/_components/PlaceSearchable";
import { getTranslation } from "@/i18n";
import SendAnalyticsData from "./_components/SendAnalyticsData";
import ShowPlaceInProfile from "./_components/ShowPlaceInProfile";
import ShowRealName from "./_components/ShowRealName";

export const metadata = {
  title: "Privacy settings",
};

export default async function Privacy() {
  const { t } = await getTranslation("settings");
  return (
    <>
      <div className="row">
        <div className="col offset-md-2">
          <h2>{t("Privacy.Headings.ProfileInformationVisibility")}</h2>
        </div>
      </div>

      <ShowRealName />
      <ShowPlaceInProfile />

      <div className="row">
        <div className="col offset-md-2">
          <h2>{t("Privacy.Headings.Discoverability")}</h2>
        </div>
      </div>

      <HideProfile />
      <PlaceSearchable />

      <div className="row">
        <div className="col offset-md-2">
          <h2>{t("Privacy.Headings.Tracking")}</h2>
        </div>
      </div>

      <SendAnalyticsData />
    </>
  );
}
