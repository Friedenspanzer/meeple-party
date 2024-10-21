import { getTranslation } from "@/i18n";
import HideProfile from "@/lib/components/AutoUpdateToggle/Toggles/HideProfile/HideProfile";
import PlaceSearchable from "@/lib/components/AutoUpdateToggle/Toggles/PlaceSearchable";
import SendAnalyticsData from "@/lib/components/AutoUpdateToggle/Toggles/SendAnalyticsData";
import ShowPlaceInProfile from "@/lib/components/AutoUpdateToggle/Toggles/ShowPlaceInProfile";
import ShowRealName from "@/lib/components/AutoUpdateToggle/Toggles/ShowRealName";

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
