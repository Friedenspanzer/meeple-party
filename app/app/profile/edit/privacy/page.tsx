import PlaceSearchable from "@/components/AutoUpdateToggle/Toggles/PlaceSearchable";
import SendAnalyticsData from "@/components/AutoUpdateToggle/Toggles/SendAnalyticsData";
import ShowPlaceInProfile from "@/components/AutoUpdateToggle/Toggles/ShowPlaceInProfile";
import ShowRealName from "@/components/AutoUpdateToggle/Toggles/ShowRealName";
import { getTranslation } from "@/i18n";

export const metadata = {
  title: "Privacy settings",
};

export default async function Privacy() {
  const {t} = await getTranslation("settings");
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
